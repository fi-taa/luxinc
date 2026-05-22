import { footer } from "@/lib/landing-content";

const detailFooterGradient =
  "linear-gradient(90deg, rgba(27, 24, 19, 0) 0%, #1B1813 53.85%, rgba(27, 24, 19, 0) 100%)";

export function DetailFooter() {
  return (
    <footer
      className="relative left-1/2 w-screen -translate-x-1/2"
      style={{ background: detailFooterGradient }}
    >
      <div className="mx-auto px-6 py-16 text-center md:px-10 md:py-24 lg:px-16">
        <p className="font-diphylleia text-sm font-normal leading-relaxed text-zulu-gold md:text-base">
          <span className="text-zulu-gold">LUXINC</span>
          {" — "}
          {footer.tagline}
        </p>
        <p className="mt-3 font-sans text-sm font-normal leading-relaxed text-zulu-text/80 md:text-base">
          {footer.locations}
        </p>
        <p className="mt-3 font-sans text-sm font-normal leading-relaxed md:text-base">
          <span className="text-zulu-gold">
            © 2026 Luxinc Luxury Tour & Travel.
          </span>{" "}
          <span className="text-zulu-text/80">
            No public pricing. Zero data leakage.
          </span>
        </p>
      </div>
    </footer>
  );
}
