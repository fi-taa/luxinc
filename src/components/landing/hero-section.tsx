import Image from "next/image";
import { hero } from "@/lib/landing-content";
import { GoldButton } from "./gold-button";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center"
      aria-label="Hero"
    >
      <Image
        src={hero.image}
        alt={hero.imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/55" />
      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 pb-20 pt-32 text-center md:px-10 md:pt-36 lg:px-16">
        <p className="font-verietta text-[clamp(1.25rem,4vw,32px)] font-normal leading-none text-zulu-gold">
          {hero.location}
        </p>
        <h1 className="mt-8 max-w-5xl font-verietta text-[clamp(2.25rem,9vw,99px)] font-normal leading-[1.23] tracking-normal text-zulu-text lg:leading-[122px]">
          Time is the ultimate{" "}
          <span className="text-zulu-gold">LUXURY.</span>
          <br />
          We architect its <span className="text-zulu-gold">MEMORY.</span>
        </h1>
        <p className="mt-8 max-w-3xl font-diphylleia text-[clamp(1.125rem,2.5vw,24px)] font-normal leading-none text-zulu-text">
          {hero.subheadline}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <GoldButton
            href={hero.ctaHref}
            variant="solid"
            className="h-12 min-w-[200px] px-10 text-sm"
          >
            {hero.cta}
          </GoldButton>
          <GoldButton
            href={hero.loginHref}
            variant="ghost"
            className="h-12 min-w-[140px] px-10 text-sm"
          >
            {hero.loginCta}
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
