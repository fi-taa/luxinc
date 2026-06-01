import { NextResponse } from "next/server";
import { toErrorMessage } from "@/lib/errors/to-error-message";
import { initializeMemberChapaPayment } from "@/lib/member/payments.server";
import { requireActiveMember } from "@/lib/member/require-member-auth";

interface InitializeBody {
	upcomingJourneyId?: string;
}

export async function POST(request: Request) {
	const auth = await requireActiveMember();
	if (auth.error || !auth.userId) {
		return NextResponse.json(
			{ error: auth.error ?? "Unauthorized" },
			{ status: auth.error ? auth.status : 401 },
		);
	}

	const body = (await request.json()) as InitializeBody;
	const upcomingJourneyId = body.upcomingJourneyId?.trim() ?? "";

	if (!upcomingJourneyId) {
		return NextResponse.json({ error: "Journey id is required." }, { status: 400 });
	}

	try {
		const { checkoutUrl } = await initializeMemberChapaPayment(
			auth.supabase,
			auth.userId,
			upcomingJourneyId,
		);
		return NextResponse.json({ checkoutUrl });
	} catch (e) {
		const message = toErrorMessage(e, "Payment could not be started.");
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
