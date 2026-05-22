import { commitment } from "@/lib/landing-content";
import { SectionShell } from "./section-shell";

export function CommitmentSection() {
  return (
    <SectionShell ariaLabelledBy="commitment-heading">
      <div className="flex flex-col items-center justify-center gap-5 lg:flex-row lg:items-center lg:gap-5 xl:gap-5">
        <p
          className="shrink-0 font-serif text-[clamp(5rem,14vw,11rem)] font-light leading-[0.85] text-zulu-gold"
          aria-hidden
        >
          {commitment.symbol}
        </p>
        <p
          id="commitment-heading"
          className="max-w-2xl text-center font-serif text-lg leading-relaxed text-zulu-text md:text-xl lg:text-left lg:text-2xl"
        >
          {commitment.line1}
          <br />
          {commitment.line2}{" "}
          <span className="mx-auto mt-1 block w-max bg-linear-to-r from-zulu-gold from-55% to-transparent px-2 py-0.5 text-zulu-bg md:mx-0 md:mt-0 md:inline md:w-auto">
            {commitment.highlight}
          </span>
        </p>
      </div>
    </SectionShell>
  );
}
