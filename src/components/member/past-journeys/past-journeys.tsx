import { pastJourneys } from "@/lib/past-journeys-content";
import { PastJourneyCard } from "./past-journey-card";

export function PastJourneys() {
	return (
		<section aria-labelledby="past-journeys-heading" className="space-y-8">
			<h1 id="past-journeys-heading" className="sr-only">
				Past journeys
			</h1>
			{pastJourneys.map((journey) => (
				<PastJourneyCard key={journey.id} journey={journey} />
			))}
		</section>
	);
}
