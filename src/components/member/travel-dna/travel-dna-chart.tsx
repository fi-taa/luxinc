"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { MemberPanel } from "@/components/member/member-panel";
import { travelDnaChartGrid } from "@/lib/travel-dna-content";
import type { DnaLocationBar, DnaLocationLegend } from "@/lib/travel-dna-content";

function ColorRing({ color }: { color: string }) {
	return (
		<span
			className="size-3.5 shrink-0 rounded-full border-2 bg-transparent"
			style={{ borderColor: color }}
			aria-hidden
		/>
	);
}

interface TravelDnaChartProps {
	activePeriod: string;
	periodOptions: string[];
	locationBars: DnaLocationBar[];
	locationLegend: DnaLocationLegend[];
}

export function TravelDnaChart({
	activePeriod,
	periodOptions,
	locationBars,
	locationLegend,
}: TravelDnaChartProps) {
	const router = useRouter();
	const selectId = useId();
	const [period, setPeriod] = useState(activePeriod);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		setPeriod(activePeriod);
	}, [activePeriod]);

	async function handlePeriodChange(nextPeriod: string) {
		setPeriod(nextPeriod);
		setIsSaving(true);
		try {
			const response = await fetch("/api/member/travel-dna/period", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ period: nextPeriod }),
			});
			if (!response.ok) {
				const body = (await response.json()) as { error?: string };
				throw new Error(body.error ?? "Failed to save period");
			}
			router.refresh();
		} catch {
			setPeriod(activePeriod);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<MemberPanel>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h2 className="font-diphylleia text-xl font-normal text-luxinc-gold md:text-2xl">
					Travel DNA Profile
				</h2>
				<div className="relative flex items-center gap-1 sm:justify-end">
					<label htmlFor={selectId} className="sr-only">
						Reporting period
					</label>
					<select
						id={selectId}
						value={period}
						disabled={isSaving || periodOptions.length === 0}
						onChange={(e) => void handlePeriodChange(e.target.value)}
						className="cursor-pointer appearance-none bg-transparent pr-6 font-sans text-sm text-luxinc-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold disabled:opacity-60"
					>
						{periodOptions.map((option) => (
							<option key={option} value={option} className="bg-luxinc-bg">
								{option}
							</option>
						))}
					</select>
					<ChevronDown
						className="pointer-events-none absolute right-0 size-4 text-luxinc-text"
						aria-hidden
					/>
				</div>
			</div>

			{locationBars.length === 0 ? (
				<p className="mt-4 font-sans text-sm text-luxinc-text-muted">
					No location stats for this period. Add past journeys under Past Journeys —
					your chart updates automatically from trip destinations.
				</p>
			) : null}

			<div className="mt-6 overflow-hidden rounded-lg border border-luxinc-border/40 bg-[#121212] p-4 md:p-6">
				<div className="relative">
					<div
						className="pointer-events-none absolute inset-x-0 top-0 bottom-5 flex justify-between"
						aria-hidden
					>
						{travelDnaChartGrid.map((tick) => (
							<div
								key={tick}
								className="h-full w-px bg-white/10"
								style={{ marginLeft: tick === 0 ? 0 : undefined }}
							/>
						))}
					</div>

					<div className="relative space-y-3.5 py-0.5">
						{locationBars.map((bar) => (
							<div key={bar.id} className="relative h-4">
								<div
									className="absolute top-1/2 left-0 h-[5px] -translate-y-1/2 rounded-full"
									style={{
										width: `${bar.percent}%`,
										backgroundColor: bar.color,
									}}
								/>
								<span
									className="absolute top-1/2 -translate-y-1/2 font-sans text-[10px] font-semibold leading-none text-luxinc-text"
									style={{ left: `calc(${bar.percent}% + 6px)` }}
								>
									{bar.percent}%
								</span>
							</div>
						))}
					</div>

					<div
						className="mt-2 flex justify-between font-sans text-[11px] text-luxinc-text-muted"
						aria-hidden
					>
						{travelDnaChartGrid.map((tick) => (
							<span key={tick}>{tick}%</span>
						))}
					</div>
				</div>
			</div>

			<ul className="mt-6 space-y-4 border-t border-luxinc-border/50 pt-6">
				{locationLegend.map((item) => (
					<li
						key={item.id}
						className="flex items-center justify-between gap-4 font-sans text-sm"
					>
						<div className="flex min-w-0 items-center gap-3">
							<ColorRing color={item.color} />
							<span className="text-luxinc-text">{item.label}</span>
						</div>
						<span className="shrink-0 tabular-nums text-luxinc-text">
							{item.percent}%
						</span>
					</li>
				))}
			</ul>
		</MemberPanel>
	);
}
