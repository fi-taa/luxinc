"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DestinationSlide } from "@/lib/landing-content";
import { cn } from "@/lib/utils";
import { FillImage } from "./fill-image";

const AUTO_PLAY_MS = 5000;
const TRANSITION_MS = 700;

function slideImages(slide: DestinationSlide): string[] {
	const list = slide.images?.filter(Boolean);
	if (list?.length) return list;
	return slide.image ? [slide.image] : [];
}

interface DestinationImageControlsProps {
	images: string[];
	activeImageIndex: number;
	onImageIndexChange: (index: number) => void;
}

function DestinationImageControls({
	images,
	activeImageIndex,
	onImageIndexChange,
}: DestinationImageControlsProps) {
	if (images.length <= 1) return null;

	return (
		<div
			className="absolute bottom-4 left-4 z-10 flex items-center gap-2 md:bottom-5 md:left-5"
			role="tablist"
			aria-label="Destination images"
		>
			{images.map((_, index) => {
				const isActive = index === activeImageIndex;
				return (
					<button
						key={`image-indicator-${index}`}
						type="button"
						role="tab"
						aria-selected={isActive}
						aria-label={`Show image ${index + 1} of ${images.length}`}
						onClick={() => onImageIndexChange(index)}
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
								key={`${slide.id ?? slide.headline}-subtitle`}
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
							key={`${slide.id ?? slide.headline}-description`}
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
					key={slide.id ?? `${slide.headline}-${index}`}
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
	/** When true, only cycles images on the initial slide (single destination card). */
	lockToInitialSlide?: boolean;
}

export function DestinationCarousel({
	slides,
	aspectClassName = "aspect-3/4 w-full",
	imageSizes = "(max-width: 1024px) 100vw, 50vw",
	priority = false,
	initialIndex = 0,
	autoPlay = true,
	fixedHeadline,
	lockToInitialSlide = false,
}: DestinationCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(initialIndex);
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const pauseAutoPlayUntil = useRef(0);

	const slideIndex = lockToInitialSlide ? initialIndex : activeIndex;
	const activeSlide = slides[slideIndex];
	const currentImages = activeSlide ? slideImages(activeSlide) : [];

	const goToImage = useCallback((index: number) => {
		pauseAutoPlayUntil.current = Date.now() + AUTO_PLAY_MS * 2;
		setActiveImageIndex(index);
	}, []);

	const goToNextImage = useCallback(() => {
		pauseAutoPlayUntil.current = Date.now() + AUTO_PLAY_MS * 2;
		if (currentImages.length === 0) return;

		if (activeImageIndex < currentImages.length - 1) {
			setActiveImageIndex(activeImageIndex + 1);
			return;
		}

		if (lockToInitialSlide) {
			setActiveImageIndex(0);
			return;
		}

		const nextSlideIdx = (slideIndex + 1) % slides.length;
		setActiveIndex(nextSlideIdx);
		setActiveImageIndex(0);
	}, [
		activeImageIndex,
		currentImages.length,
		lockToInitialSlide,
		slideIndex,
		slides.length,
	]);

	useEffect(() => {
		setActiveIndex(initialIndex);
		setActiveImageIndex(0);
	}, [initialIndex]);

	useEffect(() => {
		setActiveImageIndex((current) =>
			currentImages.length === 0
				? 0
				: Math.min(current, currentImages.length - 1),
		);
	}, [slideIndex, currentImages.length]);

	useEffect(() => {
		if (!autoPlay || slides.length === 0 || currentImages.length === 0) return;

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		if (prefersReducedMotion) return;

		const intervalId = window.setInterval(() => {
			if (Date.now() < pauseAutoPlayUntil.current) return;
			goToNextImage();
		}, AUTO_PLAY_MS);

		return () => window.clearInterval(intervalId);
	}, [autoPlay, currentImages.length, goToNextImage, slideIndex, slides.length]);

	if (slides.length === 0) return null;

	const displaySrc =
		currentImages[activeImageIndex] ?? currentImages[0] ?? activeSlide?.image ?? "";

	const captionIndex = lockToInitialSlide ? initialIndex : activeIndex;

	return (
		<div className="flex flex-col">
			<div className={cn("relative", aspectClassName)}>
				{displaySrc ? (
					<FillImage
						key={`${slideIndex}-${activeImageIndex}-${displaySrc}`}
						containerClassName="absolute inset-0"
						src={displaySrc}
						alt={activeSlide?.imageAlt ?? ""}
						className="object-cover transition-opacity ease-in-out"
						style={{ transitionDuration: `${TRANSITION_MS}ms` }}
						sizes={imageSizes}
						priority={priority && slideIndex === initialIndex}
					/>
				) : null}
				<DestinationImageControls
					images={currentImages}
					activeImageIndex={activeImageIndex}
					onImageIndexChange={goToImage}
				/>
			</div>
			<DestinationCarouselCaption
				slides={slides}
				activeIndex={captionIndex}
				fixedHeadline={fixedHeadline}
			/>
		</div>
	);
}

export { AUTO_PLAY_MS };
