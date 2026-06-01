"use client";

import type { TravelDnaBundle } from "@/lib/member/mappers";
import { TravelDnaChart } from "./travel-dna-chart";
import { TravelDnaDestinations } from "./travel-dna-destinations";
import { TravelDnaTopics } from "./travel-dna-topics";

interface TravelDnaDashboardPanelProps {
	travelDna: TravelDnaBundle | null;
	error?: string | null;
}

export function TravelDnaDashboardPanel({
	travelDna,
	error,
}: TravelDnaDashboardPanelProps) {
	if (error) {
		return <p className="font-sans text-sm text-red-400">{error}</p>;
	}

	if (!travelDna) {
		return null;
	}

	const hasDnaData = travelDna.locationBars.length > 0;
	const hasBookedOnly =
		!hasDnaData &&
		travelDna.bookedJourneyCount > 0 &&
		travelDna.completedJourneyCount === 0;

	return (
		<section aria-labelledby="travel-dna-heading" className="space-y-6">
			{hasBookedOnly ? (
				<p className="font-sans text-sm text-luxinc-text-muted">
					You have {travelDna.bookedJourneyCount}{" "}
					{travelDna.bookedJourneyCount === 1 ? "trip" : "trips"} in Past journeys marked
					as Booked. Travel DNA is built from trips marked Completed after you travel.
					Ask your concierge or admin to mark a trip completed when it is done.
				</p>
			) : null}
			{!hasDnaData && !hasBookedOnly ? (
				<p className="font-sans text-sm text-luxinc-text-muted">
					No completed trips yet. Completed journeys with destination type and travel
					topics show charts here.
				</p>
			) : null}
			<h1 id="travel-dna-heading" className="sr-only">
				Travel DNA Profile
			</h1>
			<TravelDnaChart
				activePeriod={travelDna.activePeriod}
				periodOptions={travelDna.periodOptions}
				locationBars={travelDna.locationBars}
				locationLegend={travelDna.locationLegend}
			/>
			<div className="grid gap-6 lg:grid-cols-2">
				<TravelDnaDestinations destinations={travelDna.preferredDestinations} />
				<div className="flex flex-col gap-6">
					<TravelDnaTopics title="Weakest Topics" topics={travelDna.weakestTopics} />
					<TravelDnaTopics title="Strongest Topics" topics={travelDna.strongestTopics} />
				</div>
			</div>
		</section>
	);
}
