import { UpcomingItinerariesPanel } from "@/components/member/upcoming-itineraries-panel";
import { fetchMemberItineraries } from "@/lib/member/member-data.server";
import type { UpcomingItinerary } from "@/lib/member-content";

export default async function UpcomingPage() {
	let itineraries: UpcomingItinerary[] = [];
	let error: string | null = null;

	try {
		itineraries = (await fetchMemberItineraries("upcoming")) as UpcomingItinerary[];
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load itineraries.";
	}

	return <UpcomingItinerariesPanel itineraries={itineraries} error={error} />;
}
