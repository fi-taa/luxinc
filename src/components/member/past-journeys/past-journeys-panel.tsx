import type { PastJourney } from "@/lib/past-journeys-content";
import { PastJourneyCard } from "./past-journey-card";

interface PastJourneysPanelProps {
	journeys: PastJourney[];
	error?: string | null;
}

export function PastJourneysPanel({ journeys, error }: PastJourneysPanelProps) {
	return (
		<section aria-labelledby="past-journeys-heading" className="space-y-8">
			<h1 id="past-journeys-heading" className="sr-only">
				Past journeys
			</h1>
			<header>
				<h2 className="font-diphylleia text-2xl font-normal text-luxinc-gold md:text-3xl">
					Past journeys
				</h2>
				<p className="mt-2 font-sans text-sm text-luxinc-text-muted">
					Journeys appear here after you pay for an upcoming trip. Travel DNA uses
					completed trips only.
				</p>
			</header>
			{error ? (
				<p className="font-sans text-sm text-red-400">{error}</p>
			) : null}
			{!error && journeys.length === 0 ? (
				<p className="font-sans text-sm text-luxinc-text-muted">
					No journeys yet. Book one from{" "}
					<a href="/member/upcoming" className="text-luxinc-gold underline-offset-2 hover:underline">
						Upcoming journeys
					</a>
					.
				</p>
			) : null}
			{journeys.map((journey) => (
				<PastJourneyCard key={journey.id} journey={journey} />
			))}
		</section>
	);
}
