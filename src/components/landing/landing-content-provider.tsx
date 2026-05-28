"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { LandingContent } from "@/lib/cms/types";
import * as fallback from "@/lib/cms/fallbacks";

const LandingContentContext = createContext<LandingContent | null>(null);

export function LandingContentProvider({
  value,
  children,
}: {
  value: LandingContent;
  children: ReactNode;
}) {
  return (
    <LandingContentContext.Provider value={value}>
      {children}
    </LandingContentContext.Provider>
  );
}

export function useLandingContent(): LandingContent {
  const ctx = useContext(LandingContentContext);
  if (!ctx) {
    return {
      site: fallback.site,
      navLinks: fallback.navLinks,
      hero: fallback.hero,
      auth: fallback.auth,
      commitment: fallback.commitment,
      destinations: fallback.destinations,
      crownCollection: fallback.crownCollection,
      architects: fallback.architects,
      blackBook: fallback.blackBook,
      journal: fallback.journal,
      team: fallback.team,
      offices: fallback.offices,
      feedback: fallback.feedback,
      footer: fallback.footer,
    };
  }
  return ctx;
}
