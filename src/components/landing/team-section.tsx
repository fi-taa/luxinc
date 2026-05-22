import { team } from "@/lib/landing-content";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";
import { TeamCarousel } from "./team-carousel";

export function TeamSection() {
  return (
    <SectionShell bordered ariaLabelledBy="team-heading">
      <SectionTitle
        id="team-heading"
        title={team.title}
        subtitle={team.subtitle}
      />
      <TeamCarousel members={team.members} />
    </SectionShell>
  );
}
