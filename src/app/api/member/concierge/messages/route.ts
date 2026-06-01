import { NextResponse } from "next/server";
import type { ConciergeChatMessage } from "@/lib/concierge-chat-content";
import { conciergeMessageToBody, mapConciergeRow } from "@/lib/member/mappers";
import { requireActiveMember } from "@/lib/member/require-member-auth";
import type { ConciergeMessageRow } from "@/lib/member/db-types";

interface PostBody {
	message?: ConciergeChatMessage;
}

export async function POST(request: Request) {
	const auth = await requireActiveMember();
	if (auth.error || !auth.userId) {
		return NextResponse.json(
			{ error: auth.error ?? "Unauthorized" },
			{ status: auth.error ? auth.status : 401 },
		);
	}

	const body = (await request.json()) as PostBody;
	const message = body.message;

	if (!message || message.sender !== "user") {
		return NextResponse.json({ error: "Invalid message payload." }, { status: 400 });
	}

	const { data: insertedUser, error: userError } = await auth.supabase
		.from("concierge_messages")
		.insert({
			profile_id: auth.userId,
			sender: "user",
			message_type: message.type,
			body: conciergeMessageToBody(message),
			is_read: true,
		})
		.select("*")
		.single();

	if (userError || !insertedUser) {
		return NextResponse.json(
			{ error: userError?.message ?? "Failed to save message." },
			{ status: 400 },
		);
	}

	return NextResponse.json({
		message: mapConciergeRow(insertedUser as ConciergeMessageRow),
	});
}
