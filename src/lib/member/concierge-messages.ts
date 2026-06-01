import type { ConciergeChatMessage } from "@/lib/concierge-chat-content";
import type { ConciergeMessageRow } from "./db-types";
import { mapConciergeRow } from "./mappers";

export function mergeConciergeMessage(
	messages: ConciergeChatMessage[],
	incoming: ConciergeChatMessage,
): ConciergeChatMessage[] {
	if (messages.some((message) => message.id === incoming.id)) {
		return messages;
	}
	return [...messages, incoming];
}

export function mapConciergeRowToMessage(row: ConciergeMessageRow): ConciergeChatMessage {
	return mapConciergeRow(row);
}

export async function markConciergeMessagesRead(): Promise<void> {
	const response = await fetch("/api/member/concierge/messages/read", {
		method: "PATCH",
	});
	if (!response.ok) {
		const body = (await response.json()) as { error?: string };
		throw new Error(body.error ?? "Failed to mark messages read.");
	}
}
