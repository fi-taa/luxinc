"use client";

import { useState } from "react";
import type { UpcomingItinerary } from "@/lib/member-content";
import { AddItineraryDialog } from "./forms/add-itinerary-dialog";
import { MemberSectionHeader } from "./forms/member-form-ui";
import { ItineraryCard } from "./itinerary-card";

interface UpcomingItinerariesPanelProps {
	itineraries: UpcomingItinerary[];
	error?: string | null;
}

export function UpcomingItinerariesPanel({
	itineraries,
	error,
}: UpcomingItinerariesPanelProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<section aria-labelledby="upcoming-itineraries-heading">
			<h1 id="upcoming-itineraries-heading" className="sr-only">
				Upcoming itineraries
			</h1>
			<MemberSectionHeader
				title="Upcoming itineraries"
				addLabel="Add itinerary"
				onAdd={() => setDialogOpen(true)}
			/>
			{error ? (
				<p className="font-sans text-sm text-red-400">{error}</p>
			) : null}
			{!error && itineraries.length === 0 ? (
				<p className="mb-8 font-sans text-sm text-luxinc-text-muted">
					No upcoming itineraries yet. Use Add itinerary to create one.
				</p>
			) : null}
			<div className="flex flex-col gap-8 md:gap-10">
				{itineraries.map((itinerary) => (
					<ItineraryCard key={itinerary.id} itinerary={itinerary} />
				))}
			</div>
			<AddItineraryDialog
				open={dialogOpen}
				kind="upcoming"
				onClose={() => setDialogOpen(false)}
			/>
		</section>
	);
}
