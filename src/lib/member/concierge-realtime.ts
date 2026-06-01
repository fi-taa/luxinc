import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { ConciergeMessageRow } from "./db-types";

export function subscribeToConciergeMessages(
	profileId: string,
	onInsert: (row: ConciergeMessageRow) => void,
): () => void {
	const supabase = getSupabaseBrowserClient();

	const channel = supabase
		.channel(`concierge-messages:${profileId}`)
		.on(
			"postgres_changes",
			{
				event: "INSERT",
				schema: "public",
				table: "concierge_messages",
				filter: `profile_id=eq.${profileId}`,
			},
			(payload) => {
				onInsert(payload.new as ConciergeMessageRow);
			},
		)
		.subscribe();

	return () => {
		void supabase.removeChannel(channel);
	};
}
