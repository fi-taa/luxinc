import { NextResponse } from "next/server";
import {
	pickTxRefFromReturnSearchParams,
	resolvePaymentTxRefForMember,
	verifyMemberChapaPayment,
} from "@/lib/member/payments.server";
import { requireActiveMember } from "@/lib/member/require-member-auth";

export async function GET(request: Request) {
	const auth = await requireActiveMember();
	if (auth.error || !auth.userId) {
		return NextResponse.json(
			{ error: auth.error ?? "Unauthorized" },
			{ status: auth.error ? auth.status : 401 },
		);
	}

	const searchParams = new URL(request.url).searchParams;
	const txRef = await resolvePaymentTxRefForMember(auth.userId, {
		txRefFromUrl: pickTxRefFromReturnSearchParams({
			tx_ref: searchParams.get("tx_ref") ?? undefined,
			trx_ref: searchParams.get("trx_ref") ?? undefined,
			tnx_ref: searchParams.get("tnx_ref") ?? undefined,
		}),
		upcomingJourneyId: searchParams.get("upcomingJourneyId"),
	});

	if (!txRef) {
		return NextResponse.json(
			{ error: "Could not resolve payment reference." },
			{ status: 400 },
		);
	}

	try {
		const result = await verifyMemberChapaPayment(txRef, auth.userId);
		return NextResponse.json(result);
	} catch (e) {
		const message = e instanceof Error ? e.message : "Verification failed.";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
