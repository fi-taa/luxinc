import { ChevronRight, Triangle } from "lucide-react";
import Link from "next/link";
import {
	preferredDestinations,
	type PreferredDestination,
} from "@/lib/travel-dna-content";
import { cn } from "@/lib/utils";

function formatSubtext(item: PreferredDestination): string {
	if (item.correctPercent !== undefined) {
		return `${item.pointsLabel} - ${item.correctPercent}% Correct`;
	}
	return item.pointsLabel;
}

function RankTrend({ rank, trend }: { rank: number; trend: PreferredDestination["trend"] }) {
	const isUp = trend === "up";

	return (
		<div className="flex shrink-0 items-center gap-1.5">
			<span className="font-sans text-sm font-medium text-luxinc-text">{rank}</span>
			<Triangle
				className={cn(
					"size-2.5 fill-current",
					isUp ? "text-[#5EEAD4]" : "rotate-180 text-[#FF7F50]",
				)}
				aria-hidden
			/>
		</div>
	);
}

export function TravelDnaDestinations() {
	return (
		<section className="flex h-full flex-col rounded-lg border border-luxinc-gold/45 bg-luxinc-bg p-5 md:p-6">
			<h2 className="font-diphylleia text-lg font-normal italic text-luxinc-gold md:text-xl">
				Travel Statistics Preferred Destinations
			</h2>

			<ol className="mt-8 flex flex-1 flex-col gap-7">
				{preferredDestinations.map((item) => (
					<li
						key={item.id}
						className="flex items-start justify-between gap-6"
					>
						<div className="min-w-0">
							<p className="font-sans text-sm font-bold text-luxinc-text md:text-base">
								{item.name}
							</p>
							<p className="mt-1 font-sans text-xs text-[#888888] md:text-sm">
								{formatSubtext(item)}
							</p>
						</div>
						<RankTrend rank={item.rank} trend={item.trend} />
					</li>
				))}
			</ol>

			<div className="mt-10 border-t border-luxinc-gold/50 pt-6">
				<Link
					href="/member/upcoming"
					className="flex items-center justify-center gap-1 font-sans text-sm text-luxinc-gold transition-colors hover:text-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
				>
					View full Destination
					<ChevronRight className="size-4" aria-hidden />
				</Link>
			</div>
		</section>
	);
}
