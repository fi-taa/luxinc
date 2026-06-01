import { PastJourneysPanel } from "@/components/member/past-journeys/past-journeys-panel";
import { fetchMemberPastJourneys } from "@/lib/member/member-data.server";

export default async function PastJourneysPage() {
	let journeys: Awaited<ReturnType<typeof fetchMemberPastJourneys>> = [];
	let error: string | null = null;

	try {
		journeys = await fetchMemberPastJourneys();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load past journeys.";
	}

	return <PastJourneysPanel journeys={journeys} error={error} />;
}
