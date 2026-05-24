import { upcomingItineraries } from "@/lib/member-content";
import { ItineraryCard } from "./itinerary-card";

export function UpcomingItineraries() {
	return (
		<section aria-labelledby="upcoming-itineraries-heading">
			<h1 id="upcoming-itineraries-heading" className="sr-only">
				Upcoming itineraries
			</h1>
			<div className="flex flex-col gap-8 md:gap-10">
				{upcomingItineraries.map((itinerary) => (
					<ItineraryCard key={itinerary.id} itinerary={itinerary} />
				))}
			</div>
		</section>
	);
}
