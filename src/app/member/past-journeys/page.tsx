import { PastJourneysPanel } from "@/components/member/past-journeys/past-journeys-panel";
import { fetchMemberItineraries } from "@/lib/member/member-data.server";
import type { PastJourney } from "@/lib/past-journeys-content";

export default async function PastJourneysPage() {
	let journeys: PastJourney[] = [];
	let error: string | null = null;

	try {
		journeys = (await fetchMemberItineraries("past")) as PastJourney[];
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load past journeys.";
	}

	return <PastJourneysPanel journeys={journeys} error={error} />;
}
