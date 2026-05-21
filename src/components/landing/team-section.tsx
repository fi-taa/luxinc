import { team } from "@/lib/landing-content";
import { FillImage } from "./fill-image";
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
            <FillImage
              containerClassName="aspect-[3/4] w-full rounded-sm"
              src={member.image}
              alt={member.imageAlt}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
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
