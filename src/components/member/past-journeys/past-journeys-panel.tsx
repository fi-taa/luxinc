"use client";

import { useState } from "react";
import type { PastJourney } from "@/lib/past-journeys-content";
import { AddItineraryDialog } from "../forms/add-itinerary-dialog";
import { MemberSectionHeader } from "../forms/member-form-ui";
import { PastJourneyCard } from "./past-journey-card";

interface PastJourneysPanelProps {
	journeys: PastJourney[];
	error?: string | null;
}

export function PastJourneysPanel({ journeys, error }: PastJourneysPanelProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<section aria-labelledby="past-journeys-heading" className="space-y-8">
			<h1 id="past-journeys-heading" className="sr-only">
				Past journeys
			</h1>
			<MemberSectionHeader
				title="Past journeys"
				addLabel="Add journey"
				onAdd={() => setDialogOpen(true)}
			/>
			{error ? (
				<p className="font-sans text-sm text-red-400">{error}</p>
			) : null}
			{!error && journeys.length === 0 ? (
				<p className="font-sans text-sm text-luxinc-text-muted">
					No past journeys yet. Use Add journey to record one.
				</p>
			) : null}
			{journeys.map((journey) => (
				<PastJourneyCard key={journey.id} journey={journey} />
			))}
			<AddItineraryDialog
				open={dialogOpen}
				kind="past"
				onClose={() => setDialogOpen(false)}
			/>
		</section>
	);
}
