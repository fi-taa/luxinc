import { NextResponse } from "next/server";
import {
	createConciergeTextMessage,
	getDummyConciergeReply,
	getReplyContextFromMessage,
	type ConciergeChatMessage,
} from "@/lib/concierge-chat-content";
import {
	conciergeMessageToBody,
	mapConciergeRow,
} from "@/lib/member/mappers";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import type { ConciergeMessageRow } from "@/lib/member/db-types";

interface PostBody {
	message?: ConciergeChatMessage;
}

export async function POST(request: Request) {
	const supabase = await createSupabaseAuthServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = (await request.json()) as PostBody;
	const message = body.message;

	if (!message || message.sender !== "user") {
		return NextResponse.json({ error: "Invalid message payload." }, { status: 400 });
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("role,status")
		.eq("id", user.id)
		.maybeSingle();

	if (!profile || profile.role !== "member" || profile.status !== "active") {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const { data: insertedUser, error: userError } = await supabase
		.from("concierge_messages")
		.insert({
			profile_id: user.id,
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

	const replyText = getDummyConciergeReply(getReplyContextFromMessage(message));
	const replyPayload = createConciergeTextMessage(replyText);

	const { data: insertedReply, error: replyError } = await supabase
		.from("concierge_messages")
		.insert({
			profile_id: user.id,
			sender: "concierge",
			message_type: "text",
			body: conciergeMessageToBody(replyPayload),
			is_read: false,
		})
		.select("*")
		.single();

	if (replyError || !insertedReply) {
		return NextResponse.json(
			{ error: replyError?.message ?? "Failed to save concierge reply." },
			{ status: 400 },
		);
	}

	return NextResponse.json({
		messages: [
			mapConciergeRow(insertedUser as ConciergeMessageRow),
			mapConciergeRow(insertedReply as ConciergeMessageRow),
		],
	});
}
