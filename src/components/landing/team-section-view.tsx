"use client";

import type { team } from "@/lib/landing-content";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";
import { TeamCarousel } from "./team-carousel";

export type TeamSectionData = typeof team;

export function TeamSectionView({ team: teamData }: { team: TeamSectionData }) {
  return (
    <SectionShell id="team" bordered ariaLabelledBy="team-heading">
      <SectionTitle
        id="team-heading"
        title={teamData.title}
        subtitle={teamData.subtitle}
      />
      <TeamCarousel members={teamData.members} />
    </SectionShell>
  );
}
