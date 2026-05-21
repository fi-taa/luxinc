import Image from "next/image";
import { offices } from "@/lib/landing-content";
import { SectionHeading } from "./section-heading";
import { SectionShell } from "./section-shell";

export function AddressSection() {
  return (
    <SectionShell id="contact" ariaLabelledBy="contact-heading">
      <SectionHeading
        id="contact-heading"
        title={offices.title}
        subtitle={offices.subtitle}
      />
      <div className="mt-14 grid grid-cols-1 gap-8 lg:mt-20 lg:grid-cols-2 lg:gap-10">
        {offices.locations.map((office) => (
          <article
            key={office.city}
            className="group relative aspect-[16/10] overflow-hidden md:aspect-[16/9]"
            style={{ position: "relative" }}
          >
            <Image
              src={office.image}
              alt={office.imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
              <h3 className="font-serif text-3xl text-zulu-gold md:text-4xl">
                {office.city}
              </h3>
              <div className="mt-4 space-y-1.5 font-sans text-xs leading-relaxed text-zulu-text-muted md:text-sm">
                <p>{office.address}</p>
                <p>
                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
                  >
                    {office.phone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${office.email}`}
                    className="transition-colors hover:text-zulu-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zulu-gold"
                  >
                    {office.email}
                  </a>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
