import { UpcomingItinerariesPanel } from "@/components/member/upcoming-itineraries-panel";
import { fetchPublishedUpcomingJourneys } from "@/lib/member/member-data.server";

export default async function UpcomingPage() {
	let itineraries: Awaited<ReturnType<typeof fetchPublishedUpcomingJourneys>> = [];
	let error: string | null = null;

	try {
		itineraries = await fetchPublishedUpcomingJourneys();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load upcoming journeys.";
	}

	return <UpcomingItinerariesPanel itineraries={itineraries} error={error} />;
}
