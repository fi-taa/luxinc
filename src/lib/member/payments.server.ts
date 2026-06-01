import type { SupabaseClient } from "@supabase/supabase-js";
import { toErrorMessage } from "@/lib/errors/to-error-message";
import {
	generateChapaTxRef,
	getChapaConfig,
	initializeChapaPayment,
	normalizeChapaPhone,
	verifyChapaPayment,
	type ChapaVerifyResult,
} from "@/lib/payments/chapa.server";
import { createSupabaseServiceClient } from "@/lib/supabase/service-client";
import type { MemberPaymentRow, UpcomingJourneyRow } from "./db-types";
import { fulfillBookedJourneyFromCatalog } from "./fulfill-booked-journey";

function getServiceClient(): SupabaseClient {
	const client = createSupabaseServiceClient();
	if (!client) {
		throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
	}
	return client;
}

export async function getSuccessfulPaymentJourneyIds(
	supabase: SupabaseClient,
	profileId: string,
	journeyIds: string[],
): Promise<Set<string>> {
	if (journeyIds.length === 0) {
		return new Set();
	}

	const { data, error } = await supabase
		.from("member_payments")
		.select("upcoming_journey_id")
		.eq("profile_id", profileId)
		.eq("status", "success")
		.in("upcoming_journey_id", journeyIds);

	if (error) {
		throw new Error(error.message);
	}

	return new Set(
		((data ?? []) as Pick<MemberPaymentRow, "upcoming_journey_id">[]).map(
			(row) => row.upcoming_journey_id,
		),
	);
}

interface MemberProfileForChapa {
	email: string;
	full_name: string;
	phone: string | null;
}

async function loadPublishedJourney(
	supabase: SupabaseClient,
	upcomingJourneyId: string,
): Promise<UpcomingJourneyRow> {
	const { data, error } = await supabase
		.from("upcoming_journeys")
		.select("*")
		.eq("id", upcomingJourneyId)
		.eq("is_published", true)
		.maybeSingle();

	if (error) {
		throw new Error(error.message);
	}
	if (!data) {
		throw new Error("Journey not found or not available.");
	}

	return data as UpcomingJourneyRow;
}

async function loadMemberProfile(
	supabase: SupabaseClient,
	profileId: string,
): Promise<MemberProfileForChapa> {
	const { data, error } = await supabase
		.from("profiles")
		.select("email,full_name,phone")
		.eq("id", profileId)
		.maybeSingle();

	if (error || !data) {
		throw new Error("Member profile not found.");
	}

	return data as MemberProfileForChapa;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
	const parts = fullName.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) {
		return { firstName: "Member", lastName: "Luxinc" };
	}
	if (parts.length === 1) {
		return { firstName: parts[0], lastName: "Member" };
	}
	return {
		firstName: parts[0],
		lastName: parts.slice(1).join(" "),
	};
}

export async function initializeMemberChapaPayment(
	memberSupabase: SupabaseClient,
	profileId: string,
	upcomingJourneyId: string,
): Promise<{ checkoutUrl: string }> {
	const service = getServiceClient();

	const existingSuccess = await getSuccessfulPaymentJourneyIds(service, profileId, [
		upcomingJourneyId,
	]);
	if (existingSuccess.has(upcomingJourneyId)) {
		throw new Error("You have already paid for this journey.");
	}

	const catalog = await loadPublishedJourney(memberSupabase, upcomingJourneyId);
	const profile = await loadMemberProfile(memberSupabase, profileId);
	const { appUrl } = getChapaConfig();
	const txRef = generateChapaTxRef(profileId, upcomingJourneyId);
	const { firstName, lastName } = splitName(profile.full_name);

	const { error: insertError } = await service.from("member_payments").insert({
		profile_id: profileId,
		upcoming_journey_id: upcomingJourneyId,
		tx_ref: txRef,
		amount_minor: catalog.amount_minor,
		currency: catalog.currency,
		status: "pending",
	});

	if (insertError) {
		throw new Error(toErrorMessage(insertError, "Could not create payment record."));
	}

	const returnUrl = `${appUrl}/member/upcoming/payment/return?upcomingJourneyId=${upcomingJourneyId}&tx_ref=${encodeURIComponent(txRef)}`;
	const callbackUrl = `${appUrl}/api/member/payments/chapa/webhook`;
	const phone = normalizeChapaPhone(profile.phone);

	try {
		const { checkoutUrl } = await initializeChapaPayment({
			email: profile.email,
			firstName,
			lastName,
			phone,
			txRef,
			amount: String(catalog.amount_minor),
			currency: catalog.currency,
			title: catalog.destination,
			description: catalog.travel_date_label,
			returnUrl,
			callbackUrl,
		});

		return { checkoutUrl };
	} catch (chapaError) {
		await service.from("member_payments").delete().eq("tx_ref", txRef);
		throw chapaError;
	}
}

async function loadPaymentByTxRef(txRef: string) {
	const service = getServiceClient();
	const { data, error } = await service
		.from("member_payments")
		.select("*")
		.eq("tx_ref", txRef)
		.maybeSingle();

	if (error) {
		throw new Error(error.message);
	}
	if (!data) {
		throw new Error("Payment not found.");
	}

	return data as MemberPaymentRow & {
		upcoming_journey_id: string;
		profile_id: string;
	};
}

async function applyVerifiedPayment(
	txRef: string,
	verify: ChapaVerifyResult,
): Promise<{ status: string; upcomingJourneyId: string }> {
	const service = getServiceClient();
	const payment = await loadPaymentByTxRef(txRef);

	if (payment.status === "success") {
		const { data: catalog } = await service
			.from("upcoming_journeys")
			.select("*")
			.eq("id", payment.upcoming_journey_id)
			.single();

		if (catalog) {
			await fulfillBookedJourneyFromCatalog(
				service,
				payment.profile_id,
				catalog as UpcomingJourneyRow,
			);
		}

		return {
			status: "success",
			upcomingJourneyId: payment.upcoming_journey_id,
		};
	}

	if (verify.status === "success") {
		const { error: updateError } = await service
			.from("member_payments")
			.update({
				status: "success",
				chapa_ref_id: verify.refId,
				raw_verify: verify.raw,
				failure_reason: null,
			})
			.eq("tx_ref", txRef)
			.eq("status", "pending");

		if (updateError) {
			throw new Error(updateError.message);
		}

		const { data: catalog, error: catalogError } = await service
			.from("upcoming_journeys")
			.select("*")
			.eq("id", payment.upcoming_journey_id)
			.single();

		if (catalogError || !catalog) {
			throw new Error(catalogError?.message ?? "Catalog journey not found.");
		}

		await fulfillBookedJourneyFromCatalog(
			service,
			payment.profile_id,
			catalog as UpcomingJourneyRow,
		);

		return {
			status: "success",
			upcomingJourneyId: payment.upcoming_journey_id,
		};
	}

	if (verify.status === "failed") {
		await service
			.from("member_payments")
			.update({
				status: "failed",
				raw_verify: verify.raw,
				failure_reason: "Payment failed or was cancelled.",
			})
			.eq("tx_ref", txRef)
			.in("status", ["pending", "failed"]);
	}

	return {
		status: verify.status,
		upcomingJourneyId: payment.upcoming_journey_id,
	};
}

export function pickTxRefFromReturnSearchParams(params: {
	tx_ref?: string;
	trx_ref?: string;
	tnx_ref?: string;
}): string {
	return (
		params.tx_ref?.trim() ||
		params.trx_ref?.trim() ||
		params.tnx_ref?.trim() ||
		""
	);
}

export async function resolvePaymentTxRefForMember(
	profileId: string,
	options: {
		txRefFromUrl?: string | null;
		upcomingJourneyId?: string | null;
	},
): Promise<string | null> {
	const fromUrl = options.txRefFromUrl?.trim();
	if (fromUrl) {
		return fromUrl;
	}

	const service = getServiceClient();
	const journeyId = options.upcomingJourneyId?.trim();

	if (journeyId) {
		const { data, error } = await service
			.from("member_payments")
			.select("tx_ref")
			.eq("profile_id", profileId)
			.eq("upcoming_journey_id", journeyId)
			.order("created_at", { ascending: false })
			.limit(1)
			.maybeSingle();

		if (error) {
			throw new Error(error.message);
		}
		if (data?.tx_ref) {
			return data.tx_ref as string;
		}
	}

	const { data: pending, error: pendingError } = await service
		.from("member_payments")
		.select("tx_ref")
		.eq("profile_id", profileId)
		.eq("status", "pending")
		.order("created_at", { ascending: false })
		.limit(1)
		.maybeSingle();

	if (pendingError) {
		throw new Error(pendingError.message);
	}

	return (pending?.tx_ref as string | undefined) ?? null;
}

export async function verifyMemberChapaPayment(
	txRef: string,
	profileId?: string,
): Promise<{ status: string; upcomingJourneyId: string }> {
	const payment = await loadPaymentByTxRef(txRef);
	if (profileId && payment.profile_id !== profileId) {
		throw new Error("Payment does not belong to this member.");
	}

	const verify = await verifyChapaPayment(txRef);
	return applyVerifiedPayment(txRef, verify);
}

export async function handleChapaWebhook(txRef: string): Promise<void> {
	const verify = await verifyChapaPayment(txRef);
	await applyVerifiedPayment(txRef, verify);
}
