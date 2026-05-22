import Image from "next/image";
import Link from "next/link";
import { journal } from "@/lib/landing-content";
import { JournalGeometricPattern } from "./journal-geometric-pattern";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";

export function JournalSection() {
  return (
    <SectionShell
      id="journal"
      ariaLabelledBy="journal-heading"
      fullWidth
      className="overflow-hidden"
    >
      <div className="relative flex flex-col lg:flex-row lg:items-stretch">
        <div className="flex min-w-0 flex-col lg:w-1/2 lg:shrink-0">
          <div className="px-6 md:px-10 lg:pl-16 lg:pr-8">
            <SectionTitle
              id="journal-heading"
              title={journal.title}
              subtitle={journal.subtitle}
              align="left"
            />
          </div>
          <figure className="mt-8 w-full ml-[calc(100%-50vw)] lg:mt-10">
            <Image
              src={journal.collageImage}
              alt={journal.collageAlt}
              width={1050}
              height={472}
              className="block h-auto w-full object-contain object-left"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </figure>
        </div>

        <div className="relative flex min-h-[400px] flex-col justify-center overflow-visible px-6 py-10 md:px-10 lg:w-1/2 lg:shrink-0 lg:py-0 lg:pl-8 lg:pr-10 xl:pl-10 xl:pr-12">
          <JournalGeometricPattern />
          <div className="relative z-10 w-full max-w-2xl space-y-8 lg:max-w-none lg:space-y-10">
            <div>
              <h3 className="text-center font-diphylleia text-[clamp(1rem,2vw,22px)] font-normal leading-normal tracking-normal text-zulu-gold">
                {journal.caseStudy.label}
              </h3>
              <p className="mt-3 font-encode text-[clamp(0.8125rem,1.5vw,17px)] font-normal leading-normal tracking-normal text-zulu-text">
                {journal.caseStudy.body}
              </p>
            </div>
            <div>
              <h3 className="text-center font-diphylleia text-[clamp(1rem,2vw,22px)] font-normal leading-normal tracking-normal text-zulu-gold">
                {journal.memo.label}
              </h3>
              <p className="mt-3 font-encode text-[clamp(0.8125rem,1.5vw,17px)] font-normal leading-normal tracking-normal text-zulu-text">
                {journal.memo.body}
              </p>
            </div>
            <Link
              href={journal.ctaHref}
              className="inline-flex h-11 items-center justify-center bg-zulu-gold px-8 font-sans text-sm font-medium normal-case tracking-normal text-zulu-bg transition-colors hover:bg-zulu-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold focus-visible:ring-offset-2 focus-visible:ring-offset-zulu-bg"
            >
              {journal.cta}
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
