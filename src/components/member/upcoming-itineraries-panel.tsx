import type { UpcomingItinerary } from "@/lib/member-content";
import { ItineraryCard } from "./itinerary-card";

interface UpcomingItinerariesPanelProps {
	itineraries: UpcomingItinerary[];
	error?: string | null;
}

export function UpcomingItinerariesPanel({
	itineraries,
	error,
}: UpcomingItinerariesPanelProps) {
	return (
		<section aria-labelledby="upcoming-itineraries-heading">
			<h1 id="upcoming-itineraries-heading" className="sr-only">
				Upcoming journeys
			</h1>
			<header className="mb-8">
				<h2 className="font-diphylleia text-2xl font-normal text-luxinc-gold md:text-3xl">
					Upcoming journeys
				</h2>
				<p className="mt-2 font-sans text-sm text-luxinc-text-muted">
					Choose a journey curated by Luxinc. Payment confirms your spot.
				</p>
			</header>
			{error ? (
				<p className="font-sans text-sm text-red-400">{error}</p>
			) : null}
			{!error && itineraries.length === 0 ? (
				<p className="mb-8 font-sans text-sm text-luxinc-text-muted">
					No upcoming journeys are available right now. Check back soon.
				</p>
			) : null}
			<div className="flex flex-col gap-8 md:gap-10">
				{itineraries.map((itinerary) => (
					<ItineraryCard key={itinerary.id} itinerary={itinerary} />
				))}
			</div>
		</section>
	);
}
