"use client";

import { destinations } from "@/lib/landing-content";
import { DestinationCarousel } from "./destination-carousel";
import { FillImage } from "./fill-image";

const BOTTOM_INITIAL_INDICES = [1, 2, 3] as const;

export function DestinationsInteractive() {
  const { slides, titleImage, titleImageAlt } = destinations;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="grid gap-4 md:gap-5 lg:grid-cols-2 lg:items-stretch">
        <div className="flex min-h-0 flex-col lg:h-full">
          <h2 id="destinations-heading" className="sr-only">
            {titleImageAlt}
          </h2>
          <FillImage
            containerClassName="aspect-3/4 w-full bg-luxinc-panel lg:aspect-auto lg:h-full"
            src={titleImage}
            alt={titleImageAlt}
            className="object-contain"
            sizes="(max-width: 1024px) 50vw, 640px"
            priority
          />
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
              slides={slides}
              initialIndex={initialIndex}
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
