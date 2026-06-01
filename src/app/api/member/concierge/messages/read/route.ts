import { NextResponse } from "next/server";
import { requireActiveMember } from "@/lib/member/require-member-auth";

export async function PATCH() {
	const auth = await requireActiveMember();
	if (auth.error || !auth.userId) {
		return NextResponse.json(
			{ error: auth.error ?? "Unauthorized" },
			{ status: auth.error ? auth.status : 401 },
		);
	}

	const { error } = await auth.supabase
		.from("concierge_messages")
		.update({ is_read: true })
		.eq("profile_id", auth.userId)
		.eq("sender", "concierge")
		.eq("is_read", false);

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}

	return NextResponse.json({ ok: true });
}
