import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  toLandingImageUrl,
  toLandingImageUrls,
} from "@/lib/supabase/storage-url.server";
import * as fallback from "@/lib/cms/fallbacks";
import {
  mapBlackBookRow,
  mapCommitmentRow,
  mapDestinationRow,
  mapArchitectRow,
  mapCrownCollectionRow,
  mapFooterRow,
  formatFeedbackAttribution,
  mapFeedbackRow,
  mapHeroRow,
  mapJournalHighlightRow,
  mapJournalHighlightToLanding,
  mapNavLink,
  mapSiteRow,
} from "@/lib/cms/mappers";
import { fetchTeamMembers, mapTeamMembersToCards } from "@/lib/cms/fetch-team";
import type {
  ArchitectsFormState,
  CrownCollectionFormState,
  DestinationsFormState,
  LandingContent,
  TeamFormState,
} from "@/lib/cms/types";

export async function fetchLandingContent(): Promise<LandingContent> {
  const [
    site,
    navLinks,
    hero,
    commitment,
    destinations,
    crownCollection,
    architects,
    journal,
    team,
    offices,
    footerLegal,
    blackBook,
    featuredFeedback,
  ] = await Promise.all([
    fetchSite(),
    fetchNavLinks(),
    fetchHero(),
    fetchCommitment(),
    fetchDestinations(),
    fetchCrownCollection(),
    fetchArchitectsSection(),
    fetchJournalSection(),
    Promise.resolve(fallback.team),
    fetchOffices(),
    fetchFooter(),
    fetchBlackBook(),
    fetchFeaturedFeedback(),
  ]);

  const footer = {
    ...footerLegal,
    quote: featuredFeedback?.quote ?? fallback.footer.quote,
    attribution: featuredFeedback?.attribution ?? fallback.footer.attribution,
  };

  return {
    site,
    navLinks,
    hero,
    auth: fallback.auth,
    commitment,
    destinations,
    crownCollection,
    architects,
    blackBook,
    journal,
    team,
    offices,
    footer,
    feedback: featuredFeedback?.items ?? fallback.feedback,
  };
}

export async function fetchSite() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data ? mapSiteRow(data) : fallback.site;
}

export async function fetchNavLinks() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("nav_links")
    .select("id,label,href,is_active")
    .order("sort_order");
  if (!data?.length) return fallback.navLinks;
  return data.map((row) => {
    const link = mapNavLink(row);
    return { label: link.label, href: link.href, isActive: link.isActive };
  });
}

export async function fetchHero() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("hero_settings").select("*").eq("id", 1).maybeSingle();
  return data ? mapHeroRow(data) : fallback.hero;
}

export async function fetchCommitment() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("commitment_settings").select("*").eq("id", 1).maybeSingle();
  return data ? mapCommitmentRow(data) : fallback.commitment;
}

export async function fetchDestinations(): Promise<typeof fallback.destinations> {
  const form = await fetchDestinationsForm();
  return {
    titleImage: form.titleImage,
    titleImageAlt: form.titleImageAlt,
    slides: form.slides,
  };
}

export async function fetchDestinationsForm(): Promise<DestinationsFormState> {
  const supabase = createSupabaseServerClient();
  const { data: rows } = await supabase
    .from("destinations")
    .select("id,image_url,title,subtitle,description")
    .eq("is_published", true)
    .order("sort_order");

  if (!rows?.length) {
    return {
      titleImage: fallback.destinations.titleImage,
      titleImageAlt: fallback.destinations.titleImageAlt,
      slides: fallback.destinations.slides.map((s) => ({ ...s })),
    };
  }

  return {
    titleImage: fallback.destinations.titleImage,
    titleImageAlt: fallback.destinations.titleImageAlt,
    slides: rows.map((row) => {
      const slide = mapDestinationRow(row);
      return {
        ...slide,
        image: toLandingImageUrl(slide.image),
        images: slide.images ? toLandingImageUrls(slide.images) : slide.images,
      };
    }),
  };
}

export async function fetchCrownCollection(): Promise<typeof fallback.crownCollection> {
  const form = await fetchCrownCollectionForm();
  return {
    title: form.title,
    subtitle: form.subtitle,
    cards: form.cards,
  };
}

export async function fetchCrownCollectionForm(): Promise<CrownCollectionFormState> {
  const supabase = createSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from("crown_collections")
    .select("id,title,description,image_url,order")
    .order("order", { ascending: true });

  if (error) {
    console.error("[cms] crown_collections fetch failed:", error.message);
  }

  const cards =
    rows?.length ?
      rows.map((row, index) => {
        const card = mapCrownCollectionRow(row);
        return {
          ...card,
          image: toLandingImageUrl(card.image),
          featured: index === 1,
        };
      })
    : fallback.crownCollection.cards.map((c) => ({ ...c }));

  return {
    title: fallback.crownCollection.title,
    subtitle: fallback.crownCollection.subtitle,
    cards,
  };
}

export async function fetchArchitectsSection(): Promise<typeof fallback.architects> {
  const form = await fetchArchitectsForm();
  return {
    title: form.title,
    subtitle: form.subtitle,
    members: form.members,
  };
}

export async function fetchArchitectsForm(): Promise<ArchitectsFormState> {
  const supabase = createSupabaseServerClient();
  const { data: rows, error } = await supabase
    .from("architects")
    .select("id,title,description,sub_title,short_description,image_url")
    .order("updated_at", { ascending: true });

  if (error) {
    console.error("[cms] architects fetch failed:", error.message);
  }

  const members =
    rows?.length ?
      rows.map((row) => {
        const member = mapArchitectRow(row);
        return { ...member, image: toLandingImageUrl(member.image) };
      })
    : fallback.architects.members.map((m) => ({ ...m }));

  return {
    title: fallback.architects.title,
    subtitle: fallback.architects.subtitle,
    members,
  };
}

export async function fetchJournalSection(): Promise<typeof fallback.journal> {
  const highlights = await fetchJournalHighlights();
  const ctaHref = highlights[0]?.href ?? fallback.journal.ctaHref;

  return {
    title: fallback.journal.title,
    subtitle: fallback.journal.subtitle,
    collageImage: fallback.journal.collageImage,
    collageAlt: fallback.journal.collageAlt,
    cta: fallback.journal.cta,
    ctaHref,
    highlights: highlights.length ? highlights : fallback.journal.highlights,
  };
}

export async function fetchJournalAdminForm(): Promise<
  import("./types").JournalAdminFormState
> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("journals")
    .select("id,title,sub_title,short_description,description,image_url")
    .order("order", { ascending: true });

  if (error) {
    console.error("[cms] journals fetch failed:", error.message);
    return { highlights: [] };
  }

  if (!data?.length) {
    return { highlights: [] };
  }

  return {
    highlights: data.map((row) => mapJournalHighlightRow(row)),
  };
}

async function fetchJournalHighlights(): Promise<
  typeof fallback.journal.highlights
> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("journals")
    .select("id,title,sub_title,short_description")
    .eq("is_published", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("[cms] journals highlights fetch failed:", error.message);
    return [];
  }

  if (!data?.length) {
    return [];
  }

  return data.map((row) => mapJournalHighlightToLanding(row));
}

export async function fetchTeamSection(): Promise<typeof fallback.team> {
  const form = await fetchTeamForm();
  return {
    title: form.title,
    subtitle: form.subtitle,
    members: form.members,
  };
}

export async function fetchTeamForm(): Promise<TeamFormState> {
  const { rows, error } = await fetchTeamMembers();

  if (error && !rows.length) {
    console.error("[cms] teams fetch failed:", error);
  }

  const members =
    rows.length ? mapTeamMembersToCards(rows, toLandingImageUrl) : [];

  return {
    title: fallback.team.title,
    subtitle: fallback.team.subtitle,
    members,
  };
}

export async function fetchOffices(): Promise<typeof fallback.offices> {
  const supabase = createSupabaseServerClient();
  const [settings, locations, confidential] = await Promise.all([
    supabase.from("contact_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("office_locations").select("id,heading,image_url,image_alt").order("sort_order"),
    supabase
      .from("confidential_contact_lines")
      .select("icon,text,href")
      .order("sort_order"),
  ]);

  if (!locations.data?.length) return fallback.offices;

  const linesByOffice = await Promise.all(
    (locations.data ?? []).map(async (office) => {
      const { data: lines } = await supabase
        .from("office_address_lines")
        .select("line")
        .eq("office_id", office.id)
        .order("sort_order");
      return {
        heading: office.heading,
        image: toLandingImageUrl(office.image_url),
        imageAlt: office.image_alt,
        lines: lines?.map((l) => l.line) ?? [],
      };
    })
  );

  const addis = linesByOffice[0] ?? fallback.offices.addis;
  const dubai = linesByOffice[1] ?? fallback.offices.dubai;

  return {
    title: settings.data?.title ?? fallback.offices.title,
    subtitle: settings.data?.subtitle ?? fallback.offices.subtitle,
    addis,
    dubai,
    confidential: {
      title: settings.data?.confidential_title ?? fallback.offices.confidential.title,
      lines:
        confidential.data?.map((line) => ({
          icon: line.icon as "mail" | "whatsapp" | "lock",
          text: line.text,
          href: line.href ?? undefined,
        })) ?? fallback.offices.confidential.lines,
    },
  };
}

export async function fetchFooter() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("footer_settings").select("*").eq("id", 1).maybeSingle();
  const base = data ? mapFooterRow(data) : fallback.footer;
  return {
    tagline: base.tagline,
    locations: base.locations,
    copyrightLead: base.copyrightLead,
    copyrightTail: base.copyrightTail,
  };
}

export async function fetchFeaturedFeedback(): Promise<{
  quote: string;
  attribution: string;
  items: import("@/lib/landing-content").FeedbackItem[];
} | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("id,full_name,description,is_featured")
    .eq("is_published", true)
    .order("order", { ascending: true });

  if (error) {
    console.error("[cms] feedback fetch failed:", error.message);
    return null;
  }

  if (!data?.length) {
    return null;
  }

  const items = data.map((row) => mapFeedbackRow(row));
  const featured = items.find((item) => item.featured) ?? items[0];

  return {
    quote: featured.description,
    attribution: formatFeedbackAttribution(featured.fullName),
    items,
  };
}

export async function fetchFeedbackAdminForm(): Promise<
  import("./types").FeedbackAdminFormState
> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("id,full_name,description,is_featured")
    .order("order", { ascending: true });

  if (error) {
    console.error("[cms] feedback admin fetch failed:", error.message);
    return { items: [] };
  }

  if (!data?.length) {
    return { items: [] };
  }

  return {
    items: data.map((row) => mapFeedbackRow(row)),
  };
}

export async function fetchBlackBook() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from("black_book_settings").select("*").eq("id", 1).maybeSingle();
  return data ? mapBlackBookRow(data) : fallback.blackBook;
}
