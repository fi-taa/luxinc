import Image from "next/image";
import { footer } from "@/lib/landing-content";

export function SiteFooter() {
  return (
    <footer>
      <div className="px-6 py-20 text-center md:px-10 md:py-28 lg:px-16">
        <Image
          src="/images/feather.png"
          alt=""
          width={120}
          height={120}
          className="mx-auto h-16 w-auto md:h-20"
          aria-hidden
        />
        <blockquote
          className="mx-auto mt-10 max-w-3xl font-homemade-apple text-2xl font-normal leading-normal text-zulu-text md:mt-12 md:text-3xl lg:text-4xl"
          style={{ fontFamily: '"Homemade Apple", cursive' }}
        >
          &ldquo;{footer.quote}&rdquo;
        </blockquote>
        <p className="mt-8 font-diphylleia text-base font-normal text-zulu-gold md:text-lg">
          {footer.attribution}
        </p>
      </div>

      <div className="bg-luxinc-panel px-6 py-10 text-center md:px-10 md:py-12 lg:px-16">
        <p className="font-diphylleia text-sm font-normal leading-relaxed text-zulu-gold md:text-base">
          <span className="font-normal text-zulu-gold">LUXINC</span>
          {" — "}
          {footer.tagline}
        </p>
        <p className="mt-3 font-diphylleia text-sm font-normal leading-relaxed text-zulu-gold md:text-base">
          {footer.locations}
        </p>
        <p className="mt-3 font-diphylleia text-sm font-normal leading-relaxed text-zulu-gold/90 md:text-base">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
