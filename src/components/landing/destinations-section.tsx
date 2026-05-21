import { Sparkles } from "lucide-react";
import Image from "next/image";
import { destinations } from "@/lib/landing-content";
import { SectionShell } from "./section-shell";

export function DestinationsSection() {
  return (
    <SectionShell id="destinations" ariaLabelledBy="destinations-heading">
      <div className="flex flex-col gap-4 md:gap-5">
        <div className="grid gap-4 md:gap-5 lg:grid-cols-2">
          <div className="relative flex aspect-[3/4] flex-col justify-between bg-luxinc-panel p-8 md:p-10 lg:p-12">
            <div>
              <Sparkles
                className="mb-3 size-4 text-zulu-gold md:size-5"
                aria-hidden
              />
              <h2
                id="destinations-heading"
                className="font-serif text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[1.08] text-zulu-gold"
              >
                <span className="block font-script text-[1.15em] italic">
                  {destinations.titleLine1}
                </span>
                <span className="mt-1 block font-serif not-italic">
                  {destinations.titleLine2}
                </span>
              </h2>
            </div>
            <p className="font-sans text-[10px] font-normal uppercase tracking-[0.3em] text-zulu-text md:text-xs">
              {destinations.subtitle}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src={destinations.featured.image}
                alt={destinations.featured.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
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
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
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
