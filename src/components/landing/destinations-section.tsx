import { destinations } from "@/lib/landing-content";
import { FillImage } from "./fill-image";
import { SectionShell } from "./section-shell";

export function DestinationsSection() {
  return (
    <SectionShell id="destinations" ariaLabelledBy="destinations-heading">
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="grid gap-4 md:gap-5 lg:grid-cols-2 lg:items-stretch">
          <div className="flex min-h-0 flex-col lg:h-full">
            <h2 id="destinations-heading" className="sr-only">
              {destinations.titleImageAlt}
            </h2>
            <FillImage
              containerClassName="aspect-[3/4] w-full bg-luxinc-panel lg:aspect-auto lg:h-full"
              src={destinations.titleImage}
              alt={destinations.titleImageAlt}
              className="object-contain"
              sizes="(max-width: 1024px) 50vw, 640px"
              priority
            />
          </div>
          <div className="flex flex-col">
            <FillImage
              containerClassName="aspect-[3/4] w-full"
              src={destinations.featured.image}
              alt={destinations.featured.imageAlt}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <h3 className="mt-4 font-serif text-base text-zulu-gold md:text-lg">
              {destinations.featured.captionTitle}
            </h3>
            <p className="mt-2 font-sans text-xs leading-relaxed text-zulu-text-muted md:text-sm">
              {destinations.featured.captionBody}
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {destinations.cards.map((card) => (
            <article key={card.title} className="flex flex-col">
              <FillImage
                containerClassName="aspect-[4/3] w-full"
                src={card.image}
                alt={card.imageAlt}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <h3 className="mt-4 font-serif text-sm text-zulu-gold md:text-base">
                {card.title}
              </h3>
              <p className="mt-2 font-sans text-xs leading-relaxed text-zulu-text-muted">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
