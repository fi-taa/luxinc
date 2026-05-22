import { Lock, Mail, MessageCircle } from "lucide-react";
import type {
  ConfidentialContactLine,
  OfficeLocationCard,
} from "@/lib/landing-content";
import { offices } from "@/lib/landing-content";
import { FillImage } from "./fill-image";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";
import { cn } from "@/lib/utils";

function OfficeLocationPanel({
  office,
  imageAspect,
}: {
  office: OfficeLocationCard;
  imageAspect: string;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden bg-luxinc-panel">
      <FillImage
        containerClassName={cn("relative w-full shrink-0", imageAspect)}
        src={office.image}
        alt={office.imageAlt}
        className="object-cover object-center"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="flex flex-1 flex-col justify-center px-6 py-8 text-center md:px-8 md:py-10">
        <h3 className="font-serif text-lg font-normal tracking-wide text-zulu-gold md:text-xl">
          {office.heading}
        </h3>
        <div className="mt-5 space-y-1.5 font-serif text-sm font-normal leading-relaxed text-zulu-text md:text-base">
          {office.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

function ContactIcon({ icon }: { icon: ConfidentialContactLine["icon"] }) {
  const className = "mx-auto h-4 w-4 shrink-0 text-zulu-text md:h-5 md:w-5";

  switch (icon) {
    case "mail":
      return <Mail className={className} aria-hidden />;
    case "whatsapp":
      return <MessageCircle className={className} aria-hidden />;
    case "lock":
      return <Lock className={className} aria-hidden />;
  }
}

export function AddressSection() {
  return (
    <SectionShell id="contact" ariaLabelledBy="contact-heading">
      <SectionTitle
        id="contact-heading"
        title={offices.title}
        subtitle={offices.subtitle}
        align="left"
      />

      <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 lg:mt-20 lg:grid-cols-2 lg:items-stretch lg:gap-5">
        <OfficeLocationPanel
          office={offices.addis}
          imageAspect="aspect-4/5 min-h-[280px] lg:min-h-0 lg:flex-1"
        />

        <div className="flex flex-col gap-4 lg:gap-5">
          <OfficeLocationPanel
            office={offices.dubai}
            imageAspect="aspect-[16/10] min-h-[200px] shrink-0"
          />

          <article className="flex flex-1 flex-col justify-center bg-luxinc-panel px-6 py-10 text-center md:px-8 md:py-12">
            <h3 className="font-serif text-lg font-normal tracking-wide text-zulu-gold md:text-xl">
              {offices.confidential.title}
            </h3>
            <ul className="mt-6 space-y-5">
              {offices.confidential.lines.map((line) => (
                <li key={line.text}>
                  <ContactIcon icon={line.icon} />
                  {line.href ? (
                    <a
                      href={line.href}
                      className="mt-2 block font-serif text-sm font-normal leading-relaxed text-zulu-text transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold md:text-base"
                    >
                      {line.text}
                    </a>
                  ) : (
                    <p className="mt-2 font-serif text-sm font-normal leading-relaxed text-zulu-text md:text-base">
                      {line.text}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </SectionShell>
  );
}
