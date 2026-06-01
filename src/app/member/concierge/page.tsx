import { ConciergeChat } from "@/components/member/concierge/concierge-chat";
import { fetchConciergeMessages } from "@/lib/member/member-data.server";
import type { ConciergeChatMessage } from "@/lib/concierge-chat-content";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";

export default async function ConciergePage() {
	let initialMessages: ConciergeChatMessage[] = [];
	let error: string | null = null;
	let profileId: string | null = null;

	try {
		const supabase = await createSupabaseAuthServerClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			error = "Please sign in to use concierge chat.";
		} else {
			profileId = user.id;
			initialMessages = await fetchConciergeMessages(user.id, supabase);
		}
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load concierge chat.";
	}

	if (!profileId) {
		return (
			<section className="border border-luxinc-gold/35 bg-luxinc-panel/30 px-6 py-12 text-center">
				<p className="font-sans text-sm text-luxinc-text-muted">
					{error ?? "Please sign in to use concierge chat."}
				</p>
			</section>
		);
	}

	return (
		<ConciergeChat
			profileId={profileId}
			initialMessages={initialMessages}
			loadError={error}
		/>
	);
}
