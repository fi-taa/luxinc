import { NextResponse } from "next/server";
import { requireActiveMember } from "@/lib/member/require-member-auth";

export async function POST() {
	const auth = await requireActiveMember();
	if (auth.error) {
		return NextResponse.json({ error: auth.error }, { status: auth.status });
	}

	return NextResponse.json(
		{
			error:
				"Journeys are added automatically when you pay for an upcoming trip. Browse Upcoming journeys to book.",
		},
		{ status: 403 },
	);
}
