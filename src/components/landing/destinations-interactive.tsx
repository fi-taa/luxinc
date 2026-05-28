"use client";

import { useLandingContent } from "@/components/landing/landing-content-provider";
import { DestinationCarousel } from "./destination-carousel";
import { FillImage } from "./fill-image";
import Image from "next/image";

const BOTTOM_INITIAL_INDICES = [1, 2, 3] as const;

export function DestinationsInteractive() {
	const { destinations } = useLandingContent();
	const { slides, titleImage, titleImageAlt } = destinations;

	return (
		<div className="flex flex-col gap-4 md:gap-5">
			<div className="grid gap-4 md:gap-5 lg:grid-cols-2 lg:items-stretch">
				<div className="flex min-h-0 flex-col lg:h-full">
					<h2 id="destinations-heading" className="sr-only">
						{titleImageAlt}
					</h2>
					<div className="relative aspect-3/4 w-full bg-luxinc-panel lg:aspect-auto lg:h-full flex flex-col items-start justify-center pl-6 lg:pl-10">
						<span className="font-diphylleia font-normal leading-none tracking-normal text-luxinc-gold text-7xl lg:text-8xl">
							Signature
						</span>
						<span className="font-diphylleia font-normal leading-none tracking-normal text-luxinc-gold text-7xl lg:text-8xl">
							Destination
						</span>
						<span className="font-diphylleia font-normal leading-none tracking-normal text-luxinc-text text-3xl md:text-4xl lg:text-5xl">
							East Africa & Beyond
						</span>
	
						<Image
							src="/images/sparkle.svg"
							alt="Sparkle"
							width={45}
							height={45}
							className="absolute top-3/11 right-1/15 scale-80 md:top-1/3 md:right-1/6 md:scale-100"
						/>
					</div>
				</div>
				<DestinationCarousel
					slides={slides}
					fixedHeadline="Signature Destination"
					priority
				/>
			</div>
			<div className="grid gap-4 md:grid-cols-3 md:gap-5">
				{BOTTOM_INITIAL_INDICES.map((initialIndex) => {
					const slide = slides[initialIndex];
					if (!slide) return null;
					return (
						<DestinationCarousel
							key={`destination-carousel-${initialIndex}`}
							slides={[slide]}
							initialIndex={0}
							lockToInitialSlide
							fixedHeadline={slide.headline}
							aspectClassName="aspect-4/3 w-full"
							imageSizes="(max-width: 768px) 100vw, 33vw"
						/>
					);
				})}
			</div>
		</div>
	);
}
