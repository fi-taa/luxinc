import Image from "next/image";
import { team } from "@/lib/landing-content";
import { SectionHeading } from "./section-heading";
import { SectionShell } from "./section-shell";

export function TeamSection() {
  return (
    <SectionShell bordered ariaLabelledBy="team-heading">
      <SectionHeading
        id="team-heading"
        title={team.title}
        subtitle={team.subtitle}
      />
      <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 lg:mt-20 lg:gap-12">
        {team.members.map((member) => (
          <article key={member.name}>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm">
              <Image
                src={member.image}
                alt={member.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <h3 className="mt-5 font-serif text-lg text-zulu-gold md:text-xl">
              {member.name}
            </h3>
            <p className="mt-1 font-sans text-xs uppercase tracking-[0.15em] text-zulu-text-muted">
              {member.role}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
