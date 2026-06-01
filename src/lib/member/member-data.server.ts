import type { SupabaseClient } from "@supabase/supabase-js";
import type { ConciergeChatMessage } from "@/lib/concierge-chat-content";
import type { UpcomingItinerary } from "@/lib/member-content";
import type { PastJourney } from "@/lib/past-journeys-content";
import type { ReferralProgramme } from "@/lib/referral-content";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import type {
	ConciergeMessageRow,
	MemberJourneyRow,
	MemberReferralRow,
	UpcomingJourneyRow,
} from "./db-types";
import { getSuccessfulPaymentJourneyIds } from "./payments.server";
import {
	mapConciergeRow,
	mapMemberJourneyRow,
	mapReferralRow,
	mapUpcomingJourneyRow,
	type TravelDnaBundle,
} from "./mappers";
import { loadMemberTravelDna } from "./recompute-travel-dna";

const upcomingJourneySelect =
	"id,destination,travel_date_label,image_url,image_alt,stops,amount_minor,currency,is_published,sort_order";

const memberJourneySelect =
	"id,profile_id,upcoming_journey_id,journey_status,destination,travel_date_label,reporting_period,destination_category,topic_tags,image_url,image_alt,stops,sort_order";

async function getAuthenticatedProfileId(
	supabase: SupabaseClient,
	profileId?: string,
): Promise<string> {
	if (profileId) {
		return profileId;
	}

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error || !user) {
		throw new Error("Not authenticated");
	}
	return user.id;
}

export async function fetchPublishedUpcomingJourneys(
	profileId?: string,
	client?: SupabaseClient,
): Promise<UpcomingItinerary[]> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);

	const { data, error } = await supabase
		.from("upcoming_journeys")
		.select(upcomingJourneySelect)
		.eq("is_published", true)
		.order("sort_order", { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	const rows = (data ?? []) as UpcomingJourneyRow[];
	const paidIds = await getSuccessfulPaymentJourneyIds(
		supabase,
		resolvedProfileId,
		rows.map((row) => row.id),
	);

	return rows.map((row) =>
		mapUpcomingJourneyRow(row, paidIds.has(row.id) ? "paid" : "unpaid"),
	);
}

export async function fetchMemberPastJourneys(
	profileId?: string,
	client?: SupabaseClient,
): Promise<PastJourney[]> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);

	const { data, error } = await supabase
		.from("member_journeys")
		.select(memberJourneySelect)
		.eq("profile_id", resolvedProfileId)
		.order("sort_order", { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return ((data ?? []) as MemberJourneyRow[]).map(mapMemberJourneyRow);
}

export async function fetchMemberReferrals(
	profileId?: string,
	client?: SupabaseClient,
): Promise<ReferralProgramme[]> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);

	const { data, error } = await supabase
		.from("member_referrals")
		.select("*")
		.eq("profile_id", resolvedProfileId)
		.order("sort_order", { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return ((data ?? []) as MemberReferralRow[]).map(mapReferralRow);
}

export async function fetchMemberTravelDna(
	profileId?: string,
	client?: SupabaseClient,
): Promise<TravelDnaBundle> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);
	return loadMemberTravelDna(supabase, resolvedProfileId);
}

export async function fetchConciergeMessages(
	profileId?: string,
	client?: SupabaseClient,
): Promise<ConciergeChatMessage[]> {
	const supabase = client ?? (await createSupabaseAuthServerClient());
	const resolvedProfileId = await getAuthenticatedProfileId(supabase, profileId);

	const { data, error } = await supabase
		.from("concierge_messages")
		.select("*")
		.eq("profile_id", resolvedProfileId)
		.order("created_at", { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return ((data ?? []) as ConciergeMessageRow[]).map(mapConciergeRow);
}

export interface MemberPortalSnapshot {
	upcoming: UpcomingItinerary[];
	pastJourneys: PastJourney[];
	referralProgrammes: ReferralProgramme[];
	travelDna: TravelDnaBundle;
	conciergeMessages: ConciergeChatMessage[];
}

export async function fetchMemberPortalSnapshot(
	profileId: string,
	client: SupabaseClient,
): Promise<MemberPortalSnapshot> {
	const [upcoming, pastJourneys, referralProgrammes, travelDna, conciergeMessages] =
		await Promise.all([
			fetchPublishedUpcomingJourneys(profileId, client),
			fetchMemberPastJourneys(profileId, client),
			fetchMemberReferrals(profileId, client),
			fetchMemberTravelDna(profileId, client),
			fetchConciergeMessages(profileId, client),
		]);

	return {
		upcoming,
		pastJourneys,
		referralProgrammes,
		travelDna,
		conciergeMessages,
	};
}
