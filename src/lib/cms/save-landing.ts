"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import {
  mapBlackBookToRow,
  mapCommitmentToRow,
  mapDestinationToRow,
  mapArchitectToRow,
  mapCrownCollectionToRow,
  mapFooterToRow,
  mapFeedbackToRow,
  mapHeroToRow,
  mapJournalHighlightToRow,
  mapTeamToRow,
} from "@/lib/cms/mappers";
import { revalidatePublicSite } from "@/lib/cms/revalidate";
import type {
  ArchitectsFormState,
  CrownCollectionFormState,
  DestinationsFormState,
  FeedbackAdminFormState,
  JournalAdminFormState,
  TeamFormState,
} from "@/lib/cms/types";
import type { commitment, footer, hero } from "@/lib/landing-content";

export type FooterLegalFormState = Pick<
  typeof footer,
  "tagline" | "locations" | "copyrightLead" | "copyrightTail"
>;

function assertNoError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

async function syncRepeaterTable<
  T extends { id?: string },
>(
  table:
    | "destinations"
    | "crown_collections"
    | "architects"
    | "person_cards"
    | "journals"
    | "feedback",
  items: T[],
  toRow: (item: T, index: number) => Record<string, unknown>,
  extraFilter?: Record<string, string>
) {
  const supabase = getSupabaseBrowserClient();
  let query = supabase.from(table).select("id");
  if (extraFilter) {
    for (const [key, value] of Object.entries(extraFilter)) {
      query = query.eq(key, value);
    }
  }
  const { data: existing } = await query;
  const existingIds = new Set((existing ?? []).map((r) => r.id as string));
  const keptIds = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const row = toRow(items[i], i);
    if ("id" in row && row.id) {
      keptIds.add(row.id as string);
      const { error } = await supabase.from(table).update(row).eq("id", row.id);
      assertNoError(error);
    } else {
      const { data: inserted, error } = await supabase
        .from(table)
        .insert(row)
        .select("id")
        .single();
      assertNoError(error);
      if (inserted?.id) keptIds.add(inserted.id as string);
    }
  }

  const toDelete = [...existingIds].filter((id) => !keptIds.has(id));
  if (toDelete.length) {
    const { error } = await supabase.from(table).delete().in("id", toDelete);
    assertNoError(error);
  }
}

export async function saveHero(data: typeof hero) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("hero_settings")
    .upsert(mapHeroToRow(data));
  assertNoError(error);
  await revalidatePublicSite();
}

export async function saveCommitment(data: typeof commitment) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("commitment_settings")
    .upsert(mapCommitmentToRow(data));
  assertNoError(error);
  await revalidatePublicSite();
}

export async function saveDestinations(data: DestinationsFormState) {
  await syncRepeaterTable("destinations", data.slides, (slide, index) =>
    mapDestinationToRow(slide, index)
  );
  await revalidatePublicSite();
}

export async function saveCrownCollection(data: CrownCollectionFormState) {
  await syncRepeaterTable("crown_collections", data.cards, (card, index) =>
    mapCrownCollectionToRow(card, index)
  );
  await revalidatePublicSite();
}

export async function saveArchitectsSection(data: ArchitectsFormState) {
  await syncRepeaterTable("architects", data.members, (member) =>
    mapArchitectToRow(member)
  );
  await revalidatePublicSite();
}

/** Updates public.teams landing fields only; does not delete rows removed from the carousel. */
export async function saveTeamSection(data: TeamFormState) {
  const supabase = getSupabaseBrowserClient();

  for (const member of data.members) {
    const row = mapTeamToRow(member);
    if (member.id) {
      const { error } = await supabase.from("teams").update(row).eq("id", member.id);
      assertNoError(error);
    } else {
      const { error } = await supabase.from("teams").insert({
        ...row,
        status: "active",
        role: "member",
      });
      assertNoError(error);
    }
  }

  await revalidatePublicSite();
}

export async function saveJournalSection(data: JournalAdminFormState) {
  await syncRepeaterTable("journals", data.highlights, (item, index) =>
    mapJournalHighlightToRow(item, index)
  );
  await revalidatePublicSite();
}

export async function saveFeedbackSection(data: FeedbackAdminFormState) {
  await syncRepeaterTable("feedback", data.items, (item, index) =>
    mapFeedbackToRow(item, index)
  );
  await revalidatePublicSite();
}

export async function saveFooterLegal(data: FooterLegalFormState) {
  const supabase = getSupabaseBrowserClient();
  const { data: existing } = await supabase
    .from("footer_settings")
    .select("quote,attribution")
    .eq("id", 1)
    .maybeSingle();

  const { error } = await supabase.from("footer_settings").upsert({
    id: 1,
    quote: existing?.quote ?? "",
    attribution: existing?.attribution ?? "",
    tagline: data.tagline,
    locations: data.locations,
    copyright_lead: data.copyrightLead,
    copyright_tail: data.copyrightTail,
    show_quote_on_marketing: true,
  });
  assertNoError(error);
  await revalidatePublicSite();
}

export async function saveBlackBook(data: {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonLabel: string;
}) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("black_book_settings").upsert(mapBlackBookToRow(data));
  assertNoError(error);
  await revalidatePublicSite();
}
