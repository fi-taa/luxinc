"use client";

import { useCallback, useEffect, useState } from "react";
import type { DestinationSlide } from "@/lib/landing-content";
import { cn } from "@/lib/utils";
import { FillImage } from "./fill-image";

const AUTO_PLAY_MS = 5000;
const TRANSITION_MS = 700;

interface DestinationDotsProps {
	slides: DestinationSlide[];
	activeIndex: number;
	onIndexChange: (index: number) => void;
	fixedHeadline?: string;
}

function DestinationDots({
	slides,
	activeIndex,
	onIndexChange,
	fixedHeadline,
}: DestinationDotsProps) {
	return (
		<div
			className="absolute bottom-4 left-4 z-10 flex gap-2 md:bottom-5 md:left-5"
			role="tablist"
			aria-label="Destination images"
		>
			{slides.map((slide, index) => {
				const isActive = index === activeIndex;
				return (
					<button
						key={slide.image}
						type="button"
						role="tab"
						aria-selected={isActive}
						aria-label={
							fixedHeadline
								? `Show ${fixedHeadline} — ${slide.subtitle}`
								: `Show ${slide.headline}`
						}
						onClick={() => onIndexChange(index)}
						className={cn(
							"h-3 w-3 shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg",
							isActive
								? "bg-luxinc-gold"
								: "border border-luxinc-gold/60 bg-luxinc-gold/25 hover:bg-luxinc-gold/45",
						)}
					/>
				);
			})}
		</div>
	);
}

interface DestinationCarouselCaptionProps {
	slides: DestinationSlide[];
	activeIndex: number;
	fixedHeadline?: string;
}

function DestinationCarouselCaption({
	slides,
	activeIndex,
	fixedHeadline,
}: DestinationCarouselCaptionProps) {
	if (fixedHeadline) {
		return (
			<div className="mt-4 min-h-21 md:min-h-23">
				<h3 className="font-serif text-base text-luxinc-gold md:text-lg">
					{fixedHeadline}
					{" — "}
					<span className="relative inline">
						{slides.map((slide, index) => (
							<span
								key={`${slide.image}-subtitle`}
								className={cn(
									"transition-opacity ease-in-out",
									index === activeIndex
										? "relative opacity-100"
										: "pointer-events-none absolute left-0 top-0 opacity-0",
								)}
								style={{ transitionDuration: `${TRANSITION_MS}ms` }}
								aria-hidden={index !== activeIndex}
							>
								{slide.subtitle}
							</span>
						))}
					</span>
				</h3>
				<div className="relative mt-2 min-h-13 md:min-h-14">
					{slides.map((slide, index) => (
						<p
							key={`${slide.image}-description`}
							className={cn(
								"font-sans text-xs leading-relaxed text-luxinc-text-muted transition-opacity ease-in-out md:text-sm",
								index === activeIndex
									? "relative opacity-100"
									: "pointer-events-none absolute inset-0 opacity-0",
							)}
							style={{ transitionDuration: `${TRANSITION_MS}ms` }}
							aria-hidden={index !== activeIndex}
						>
							{slide.description}
						</p>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="relative mt-4 min-h-21 md:min-h-23">
			{slides.map((slide, index) => (
				<div
					key={slide.image}
					className={cn(
						"transition-opacity ease-in-out",
						index === activeIndex
							? "relative opacity-100"
							: "pointer-events-none absolute inset-0 opacity-0",
					)}
					style={{ transitionDuration: `${TRANSITION_MS}ms` }}
					aria-hidden={index !== activeIndex}
				>
					<h3 className="font-serif text-base text-luxinc-gold md:text-lg">
						{slide.headline}
						{slide.subtitle ? (
							<>
								{" — "}
								<span>{slide.subtitle}</span>
							</>
						) : null}
					</h3>
					<p className="mt-2 font-sans text-xs leading-relaxed text-luxinc-text-muted md:text-sm">
						{slide.description}
					</p>
				</div>
			))}
		</div>
	);
}

interface DestinationCarouselProps {
	slides: DestinationSlide[];
	aspectClassName?: string;
	imageSizes?: string;
	priority?: boolean;
	initialIndex?: number;
	autoPlay?: boolean;
	fixedHeadline?: string;
}

export function DestinationCarousel({
	slides,
	aspectClassName = "aspect-3/4 w-full",
	imageSizes = "(max-width: 1024px) 100vw, 50vw",
	priority = false,
	initialIndex = 0,
	autoPlay = true,
	fixedHeadline,
}: DestinationCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(initialIndex);

	const advance = useCallback(() => {
		setActiveIndex((current) => (current + 1) % slides.length);
	}, [slides.length]);

	useEffect(() => {
		if (!autoPlay || slides.length <= 1) return;

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (prefersReducedMotion) return;

		const intervalId = window.setInterval(advance, AUTO_PLAY_MS);
		return () => window.clearInterval(intervalId);
	}, [advance, autoPlay, slides.length]);

	if (slides.length === 0) return null;

	return (
		<div className="flex flex-col">
			<div className={cn("relative", aspectClassName)}>
				{slides.map((slide, index) => (
					<FillImage
						key={slide.image}
						containerClassName="absolute inset-0"
						src={slide.image}
						alt={slide.imageAlt}
						className={cn(
							"object-cover transition-opacity ease-in-out",
							index === activeIndex ? "opacity-100" : "opacity-0",
						)}
						style={{ transitionDuration: `${TRANSITION_MS}ms` }}
						sizes={imageSizes}
						priority={priority && index === initialIndex}
					/>
				))}
				<DestinationDots
					slides={slides}
					activeIndex={activeIndex}
					onIndexChange={setActiveIndex}
					fixedHeadline={fixedHeadline}
				/>
			</div>
			<DestinationCarouselCaption
				slides={slides}
				activeIndex={activeIndex}
				fixedHeadline={fixedHeadline}
			/>
		</div>
	);
}

export { AUTO_PLAY_MS };
