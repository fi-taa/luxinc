import { footer } from "@/lib/landing-content";

export function DetailFooter() {
  return (
    <footer className="px-6 py-16 text-center md:px-10 md:py-20 lg:px-16">
      <p className="font-diphylleia text-sm font-normal leading-relaxed text-zulu-gold md:text-base">
        <span className="text-zulu-gold">LUXINC</span>
        {" — "}
        {footer.tagline}
      </p>
      <p className="mt-3 font-diphylleia text-sm font-normal leading-relaxed text-zulu-gold md:text-base">
        {footer.locations}
      </p>
      <p className="mt-3 font-diphylleia text-sm font-normal leading-relaxed text-zulu-gold/90 md:text-base">
        {footer.copyright}
      </p>
    </footer>
  );
}
