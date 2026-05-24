import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { GoldButton } from "@/components/landing/gold-button";
import type { UpcomingItinerary } from "@/lib/member-content";

interface ItineraryCardProps {
	itinerary: UpcomingItinerary;
}

export function ItineraryCard({ itinerary }: ItineraryCardProps) {
	return (
		<article className="flex flex-col gap-6 border border-luxinc-border/60 bg-luxinc-panel/40 p-4 sm:flex-row sm:gap-8 sm:p-6">
			<figure className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg sm:aspect-auto sm:h-[220px] sm:w-[280px] md:h-[240px] md:w-[320px]">
				<Image
					src={itinerary.image}
					alt={itinerary.imageAlt}
					fill
					className="object-cover"
					sizes="(max-width: 640px) 100vw, 320px"
				/>
			</figure>
			<div className="flex min-w-0 flex-1 flex-col">
				<h2 className="font-diphylleia text-2xl font-normal text-luxinc-gold md:text-[1.75rem]">
					Destination: {itinerary.destination}
				</h2>
				<p className="mt-2 font-sans text-sm font-medium">
					<span className="text-luxinc-gold">Travel Date:</span>{" "}
					<span className="text-luxinc-text">{itinerary.travelDate}</span>
				</p>
				<ul className="mt-5 space-y-2 font-sans text-sm leading-relaxed text-luxinc-text">
					{itinerary.stops.map((stop) => (
						<li key={`${stop.time}-${stop.activity}`} className="flex gap-2">
							<span aria-hidden>•</span>
							<span>
								<span className="text-luxinc-gold">{stop.time}</span>
								{" – "}
								{stop.activity}
							</span>
						</li>
					))}
				</ul>
				<div className="mt-6 sm:mt-auto sm:pt-4">
					<GoldButton
						variant="solid"
						className="inline-flex items-center gap-2 px-6"
					>
						Start My Journey
						<ArrowRight className="size-4" aria-hidden />
					</GoldButton>
				</div>
			</div>
		</article>
	);
}
