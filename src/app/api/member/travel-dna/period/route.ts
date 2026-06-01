import { NextResponse } from "next/server";
import { recomputeMemberTravelDna } from "@/lib/member/recompute-travel-dna";
import { requireActiveMember } from "@/lib/member/require-member-auth";

interface PatchBody {
	period?: string;
}

export async function PATCH(request: Request) {
	const auth = await requireActiveMember();
	if (auth.error) {
		return NextResponse.json({ error: auth.error }, { status: auth.status });
	}

	const body = (await request.json()) as PatchBody;
	const period = body.period?.trim() ?? "";

	if (!period) {
		return NextResponse.json({ error: "Period is required." }, { status: 400 });
	}

	if (!auth.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const bundle = await recomputeMemberTravelDna(auth.supabase, auth.userId, period);
		return NextResponse.json({ activePeriod: bundle.activePeriod });
	} catch (updateError) {
		const message =
			updateError instanceof Error ? updateError.message : "Failed to update period.";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
