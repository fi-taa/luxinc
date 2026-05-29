import { ConciergeChat } from "@/components/member/concierge/concierge-chat";
import { fetchConciergeMessages } from "@/lib/member/member-data.server";
import type { ConciergeChatMessage } from "@/lib/concierge-chat-content";

export default async function ConciergePage() {
	let initialMessages: ConciergeChatMessage[] = [];
	let error: string | null = null;

	try {
		initialMessages = await fetchConciergeMessages();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load concierge chat.";
	}

	return (
		<ConciergeChat initialMessages={initialMessages} loadError={error} />
	);
}
