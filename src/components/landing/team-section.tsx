"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchTeams,
  selectTeamSectionData,
  selectTeam,
} from "@/store/slices/team-slice";
import { SectionShell } from "./section-shell";
import { SectionTitle } from "./section-title";
import { TeamSectionView } from "./team-section-view";

export function TeamSection() {
  const dispatch = useAppDispatch();
  const teamData = useAppSelector(selectTeamSectionData);
  const { loading, loaded, error } = useAppSelector(selectTeam);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  if (loading && teamData.members.length === 0) {
    return null;
  }

  if (loaded && error && teamData.members.length === 0) {
    return (
      <SectionShell id="team" bordered ariaLabelledBy="team-heading">
        <SectionTitle
          id="team-heading"
          title={teamData.title}
          subtitle={teamData.subtitle}
        />
        <p className="mt-8 text-center font-sans text-sm text-red-400/90">
          {error}
        </p>
      </SectionShell>
    );
  }

  if (teamData.members.length === 0) {
    return null;
  }

  return <TeamSectionView team={teamData} />;
}
