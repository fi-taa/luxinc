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
          className="max-w-2xl font-serif text-lg leading-relaxed text-zulu-text md:text-xl lg:text-2xl"
        >
          {commitment.line1}
          <br />
          {commitment.line2}{" "}
          <span className="bg-linear-to-r from-zulu-gold from-55% to-transparent px-2 py-0.5 text-zulu-bg">
            {commitment.highlight}
          </span>
        </p>
      </div>
    </SectionShell>
  );
}
