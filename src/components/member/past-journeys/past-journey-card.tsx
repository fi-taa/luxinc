import Image from "next/image";
import { GoldButton } from "@/components/landing/gold-button";
import type { PastJourney } from "@/lib/past-journeys-content";
import { ensureImageSrc } from "@/lib/supabase/storage-url";

interface PastJourneyCardProps {
	journey: PastJourney;
}

export function PastJourneyCard({ journey }: PastJourneyCardProps) {
	const imageSrc = ensureImageSrc(journey.image, "/images/sd3.png");

	return (
		<article className="flex flex-col gap-6 rounded-lg border border-luxinc-border/60 bg-luxinc-panel/50 p-4 sm:flex-row sm:gap-8 sm:p-6">
			<figure className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-lg sm:aspect-auto sm:h-[220px] sm:w-[280px] md:h-[260px] md:w-[320px]">
				<Image
					src={imageSrc}
					alt={journey.imageAlt}
					fill
					className="object-cover"
					sizes="(max-width: 640px) 100vw, 320px"
				/>
			</figure>
			<div className="flex min-w-0 flex-1 flex-col">
				<div className="flex flex-wrap items-center gap-3">
					<h2 className="font-diphylleia text-2xl font-normal text-luxinc-gold md:text-[1.75rem]">
						To — {journey.destination}
					</h2>
					<span
						className={
							journey.journeyStatus === "completed"
								? "rounded border border-luxinc-gold/40 px-2 py-0.5 font-sans text-xs font-semibold text-luxinc-gold"
								: "rounded border border-luxinc-border/60 px-2 py-0.5 font-sans text-xs font-semibold text-luxinc-text-muted"
						}
					>
						{journey.journeyStatus === "completed" ? "Completed" : "Booked"}
					</span>
				</div>
				<p className="mt-2 font-sans text-sm text-luxinc-text-muted">
					{journey.travelDate}
				</p>
				<ul className="mt-5 space-y-2 font-sans text-sm leading-relaxed">
					{journey.stops.map((stop) => (
						<li key={`${stop.time}-${stop.activity}`} className="flex gap-2">
							<span className="text-luxinc-text-muted" aria-hidden>
								•
							</span>
							<span className="text-luxinc-text-muted">
								<span className="text-luxinc-gold">{stop.time}</span>
								{" – "}
								{stop.activity}
							</span>
						</li>
					))}
				</ul>
				<div className="mt-6 sm:mt-auto sm:pt-4">
					<GoldButton variant="outline" className="px-6">
						Rate Your Experience
					</GoldButton>
				</div>
			</div>
		</article>
	);
}
