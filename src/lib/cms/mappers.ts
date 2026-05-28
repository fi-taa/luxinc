import type { ContentCategory, ContentDetail, ContentParagraph } from "@/lib/content-detail";
import type {
  ConfidentialContactLine,
  DestinationSlide,
  ExperienceCard,
  NavLink,
  PersonCard,
} from "@/lib/landing-content";
import type {
  DestinationSlideRecord,
  ExperienceCardRecord,
  PersonCardRecord,
} from "./types";
import {
  resolveStorageImageUrl,
  resolveStorageImageUrls,
} from "@/lib/supabase/storage-url";

export function mapHeroRow(row: {
  location: string;
  subheadline: string;
  cta_label: string;
  cta_href: string;
  login_cta_label: string;
  login_href: string;
  image_url: string;
  image_alt: string;
}) {
  return {
    location: row.location,
    subheadline: row.subheadline,
    cta: row.cta_label,
    ctaHref: row.cta_href,
    loginCta: row.login_cta_label,
    loginHref: row.login_href,
    image: resolveStorageImageUrl(row.image_url),
    imageAlt: row.image_alt,
  };
}

export function mapHeroToRow(data: ReturnType<typeof mapHeroRow>) {
  return {
    id: 1,
    location: data.location,
    subheadline: data.subheadline,
    cta_label: data.cta,
    cta_href: data.ctaHref,
    login_cta_label: data.loginCta,
    login_href: data.loginHref,
    image_url: resolveStorageImageUrl(data.image),
    image_alt: data.imageAlt,
  };
}

export function mapCommitmentRow(row: {
  symbol: string;
  line_1: string;
  line_2: string;
  highlight: string;
}) {
  return {
    symbol: row.symbol,
    line1: row.line_1,
    line2: row.line_2,
    highlight: row.highlight,
  };
}

export function mapCommitmentToRow(data: ReturnType<typeof mapCommitmentRow>) {
  return { id: 1, symbol: data.symbol, line_1: data.line1, line_2: data.line2, highlight: data.highlight };
}

export function mapDestinationRow(row: {
  id: string;
  image_url: string[];
  title: string;
  subtitle: string;
  description: string;
}): DestinationSlideRecord {
  const images = Array.isArray(row.image_url)
    ? resolveStorageImageUrls(row.image_url.filter(Boolean))
    : [];
  const primary = images[0] ?? "";
  return {
    id: row.id,
    images,
    image: primary,
    imageAlt: [row.title, row.subtitle].filter(Boolean).join(" — ") || "Destination",
    headline: row.title,
    subtitle: row.subtitle,
    description: row.description,
  };
}

export function mapDestinationToRow(
  slide: DestinationSlideRecord,
  sortOrder: number
) {
  const imageUrls = resolveStorageImageUrls(
    slide.images?.filter(Boolean).length
      ? slide.images!.filter(Boolean)
      : slide.image
        ? [slide.image]
        : []
  );

  const row = {
    image_url: imageUrls,
    title: slide.headline,
    subtitle: slide.subtitle,
    description: slide.description,
    sort_order: sortOrder,
    is_published: true,
  };
  return slide.id ? { ...row, id: slide.id } : row;
}

export function mapCrownCollectionRow(row: {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  order?: number | null;
}): ExperienceCardRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: resolveStorageImageUrl(row.image_url),
    imageAlt: row.title,
    href: "#",
  };
}

export function mapCrownCollectionToRow(
  card: ExperienceCardRecord,
  sortOrder: number
) {
  const row = {
    title: card.title,
    description: card.description,
    image_url: resolveStorageImageUrl(card.image) || null,
    order: sortOrder,
  };
  return card.id ? { ...row, id: card.id } : row;
}

export function mapExperienceCard(row: {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_alt: string;
  href: string;
  is_featured: boolean;
}): ExperienceCardRecord {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: resolveStorageImageUrl(row.image_url),
    imageAlt: row.image_alt,
    href: row.href,
    featured: row.is_featured,
  };
}

export function mapExperienceCardToRow(card: ExperienceCardRecord, sortOrder: number) {
  const row = {
    title: card.title,
    description: card.description,
    image_url: resolveStorageImageUrl(card.image),
    image_alt: card.imageAlt,
    href: card.href,
    is_featured: card.featured ?? false,
    sort_order: sortOrder,
    is_published: true,
  };
  return card.id ? { ...row, id: card.id } : row;
}

function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "architect";
}

export function mapArchitectRow(row: {
  id: string;
  title: string;
  description: string;
  sub_title: string | null;
  short_description: string | null;
  image_url: string | null;
}): PersonCardRecord {
  return {
    id: row.id,
    name: row.title,
    role: row.short_description ?? "",
    subTitle: row.sub_title ?? undefined,
    description: row.description || undefined,
    image: resolveStorageImageUrl(row.image_url),
    imageAlt: row.title,
    slug: slugifyTitle(row.title),
  };
}

export function mapArchitectToRow(card: PersonCardRecord) {
  const row = {
    title: card.name,
    description: card.description ?? "",
    sub_title: card.subTitle ?? null,
    short_description: card.role,
    image_url: resolveStorageImageUrl(card.image) || null,
  };
  return card.id ? { ...row, id: card.id } : row;
}

type ArchitectDetailRow = {
  id: string;
  title: string;
  description: string;
  sub_title: string | null;
  short_description: string | null;
  image_url: string | null;
  updated_at?: string;
};

function paragraphsFromArchitectDescription(
  shortDescription: string | null,
  description: string
): ContentParagraph[] {
  const paragraphs: ContentParagraph[] = [];
  if (shortDescription?.trim()) {
    paragraphs.push({ segments: [{ text: shortDescription.trim() }] });
  }
  const blocks = description.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  for (const block of blocks) {
    paragraphs.push({ segments: [{ text: block }] });
  }
  return paragraphs.length ? paragraphs : [{ segments: [{ text: "" }] }];
}

export function mapArchitectToContentDetail(
  row: ArchitectDetailRow,
  relatedRows: Omit<ArchitectDetailRow, "description" | "updated_at">[]
): ContentDetail {
  const dateLabel =
    row.sub_title?.trim() ||
    (row.updated_at
      ? `Updated ${new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(row.updated_at))}`
      : "");

  return {
    slug: row.id,
    category: "architects",
    date: dateLabel,
    title: row.title,
    image: resolveStorageImageUrl(row.image_url),
    imageAlt: row.title,
    paragraphs: paragraphsFromArchitectDescription(
      row.short_description,
      row.description
    ),
    related: relatedRows.map((r) => ({
      slug: r.id,
      category: "architects",
      title: r.title,
      subtitle: r.short_description ?? r.sub_title ?? "",
      image: resolveStorageImageUrl(r.image_url),
      imageAlt: r.title,
    })),
  };
}

export function mapTeamRow(row: {
  id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
}): PersonCardRecord {
  return {
    id: row.id,
    name: row.full_name,
    role: row.description ?? "",
    image: resolveStorageImageUrl(row.avatar_url),
    imageAlt: row.full_name,
    slug: "",
  };
}

export function mapTeamToRow(card: PersonCardRecord) {
  const row = {
    full_name: card.name,
    description: card.role,
    avatar_url: resolveStorageImageUrl(card.image) || null,
  };
  return card.id ? { ...row, id: card.id } : row;
}

export function mapLandingTeamRow(row: {
  id: string;
  full_name: string;
  description: string | null;
  avatar_url: string | null;
}): PersonCardRecord {
  return mapTeamRow(row);
}

export function mapLandingTeamToRow(card: PersonCardRecord, sortOrder: number) {
  const row = {
    full_name: card.name,
    description: card.role,
    avatar_url: resolveStorageImageUrl(card.image) || null,
    sort_order: sortOrder,
    is_published: true,
  };
  return card.id ? { ...row, id: card.id } : row;
}

export function mapPersonCard(row: {
  id: string;
  name: string;
  role: string;
  image_url: string;
  image_alt: string;
  slug: string;
  is_tall: boolean;
}): PersonCardRecord {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    image: resolveStorageImageUrl(row.image_url),
    imageAlt: row.image_alt,
    slug: row.slug,
    tall: row.is_tall,
  };
}

export function mapPersonCardToRow(
  card: PersonCardRecord,
  section: "architects" | "team",
  sortOrder: number
) {
  const row = {
    section,
    name: card.name,
    role: card.role,
    image_url: resolveStorageImageUrl(card.image),
    image_alt: card.imageAlt,
    slug: card.slug,
    is_tall: card.tall ?? false,
    sort_order: sortOrder,
    is_published: true,
  };
  return card.id ? { ...row, id: card.id } : row;
}

export function mapSiteRow(row: {
  site_name: string;
  nav_cta_label: string;
  nav_cta_href: string;
}) {
  return {
    name: row.site_name,
    navCta: { label: row.nav_cta_label, href: row.nav_cta_href },
  };
}

export function mapNavLink(row: {
  id: string;
  label: string;
  href: string;
  is_active: boolean;
}): NavLink & { id: string } {
  return {
    id: row.id,
    label: row.label,
    href: row.href,
    isActive: row.is_active,
  };
}

export function mapFooterRow(row: {
  quote: string;
  attribution: string;
  tagline: string;
  locations: string;
  copyright_lead: string;
  copyright_tail: string;
}) {
  return {
    quote: row.quote,
    attribution: row.attribution,
    tagline: row.tagline,
    locations: row.locations,
    copyrightLead: row.copyright_lead,
    copyrightTail: row.copyright_tail,
  };
}

export function mapFooterToRow(data: ReturnType<typeof mapFooterRow>) {
  return {
    id: 1,
    quote: data.quote,
    attribution: data.attribution,
    tagline: data.tagline,
    locations: data.locations,
    copyright_lead: data.copyrightLead,
    copyright_tail: data.copyrightTail,
    show_quote_on_marketing: true,
  };
}

export function mapBlackBookRow(row: {
  title: string;
  subtitle: string;
  email_placeholder: string;
  button_label: string;
}) {
  return {
    title: row.title,
    subtitle: row.subtitle,
    placeholder: row.email_placeholder,
    buttonLabel: row.button_label,
  };
}

export function mapFeedbackRow(row: {
  id: string;
  full_name: string;
  description: string;
  is_featured: boolean;
}) {
  return {
    id: row.id,
    fullName: row.full_name,
    description: row.description,
    featured: row.is_featured,
  };
}

export function mapFeedbackToRow(
  item: {
    id: string;
    fullName: string;
    description: string;
    featured: boolean;
  },
  sortOrder: number
) {
  const row = {
    full_name: item.fullName,
    description: item.description,
    is_featured: item.featured,
    order: sortOrder,
    is_published: true,
  };
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      item.id
    );
  return isUuid ? { ...row, id: item.id } : row;
}

export function formatFeedbackAttribution(fullName: string): string {
  const trimmed = fullName.trim();
  if (trimmed.startsWith("—") || trimmed.startsWith("-")) {
    return trimmed;
  }
  return `— ${trimmed}`;
}

export function mapBlackBookToRow(data: ReturnType<typeof mapBlackBookRow>) {
  return {
    id: 1,
    title: data.title,
    subtitle: data.subtitle,
    email_placeholder: data.placeholder,
    button_label: data.buttonLabel,
  };
}

export function mapJournalSettings(row: {
  title: string;
  subtitle: string;
  collage_image_url: string;
  collage_image_alt: string;
  cta_label: string;
  cta_href: string;
}) {
  return {
    title: row.title,
    subtitle: row.subtitle,
    collageImage: resolveStorageImageUrl(row.collage_image_url),
    collageAlt: row.collage_image_alt,
    cta: row.cta_label,
    ctaHref: row.cta_href,
  };
}

type JournalRow = {
  id: string;
  title: string;
  sub_title: string;
  short_description: string;
  description: string | null;
  image_url: string | null;
  updated_at?: string;
};

export function mapJournalHighlightRow(row: JournalRow) {
  return {
    id: row.id,
    title: row.title,
    subTitle: row.sub_title,
    body: row.short_description,
    description: row.description ?? "",
    image: resolveStorageImageUrl(row.image_url),
    imageAlt: row.title,
  };
}

export function mapJournalHighlightToLanding(
  row: Pick<JournalRow, "id" | "title" | "sub_title" | "short_description">
) {
  return {
    label: row.sub_title?.trim() || row.title,
    body: row.short_description,
    href: `/journal/${row.id}`,
  };
}

export function mapJournalHighlightToRow(
  item: {
    id: string;
    title: string;
    subTitle: string;
    body: string;
    description: string;
    image: string;
  },
  sortOrder: number
) {
  const row = {
    title: item.title,
    sub_title: item.subTitle,
    short_description: item.body,
    description: item.description || null,
    image_url: resolveStorageImageUrl(item.image) || null,
    order: sortOrder,
    is_published: true,
  };
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      item.id
    );
  return isUuid ? { ...row, id: item.id } : row;
}

function paragraphsFromJournalDescription(
  shortDescription: string | null,
  description: string | null
): ContentParagraph[] {
  const paragraphs: ContentParagraph[] = [];
  if (shortDescription?.trim()) {
    paragraphs.push({ segments: [{ text: shortDescription.trim() }] });
  }
  const blocks = (description ?? "")
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean);
  for (const block of blocks) {
    paragraphs.push({ segments: [{ text: block }] });
  }
  return paragraphs.length ? paragraphs : [{ segments: [{ text: "" }] }];
}

export function mapJournalToContentDetail(
  row: JournalRow,
  relatedRows: Pick<
    JournalRow,
    "id" | "title" | "sub_title" | "short_description" | "image_url"
  >[]
): ContentDetail {
  const dateLabel =
    row.sub_title?.trim() ||
    (row.updated_at
      ? `Updated ${new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(row.updated_at))}`
      : "");

  return {
    slug: row.id,
    category: "journal",
    date: dateLabel,
    title: row.title,
    image: resolveStorageImageUrl(row.image_url) || "/images/j.png",
    imageAlt: row.title,
    paragraphs: paragraphsFromJournalDescription(
      row.short_description,
      row.description
    ),
    related: relatedRows.map((r) => ({
      slug: r.id,
      category: "journal",
      title: r.title,
      subtitle: r.short_description ?? r.sub_title ?? "",
      image: resolveStorageImageUrl(r.image_url) || "/images/j.png",
      imageAlt: r.title,
    })),
  };
}

export function paragraphsFromJson(value: unknown): ContentParagraph[] {
  if (!Array.isArray(value)) return [];
  return value as ContentParagraph[];
}

export function mapContentArticle(
  row: {
    id: string;
    slug: string;
    category: ContentCategory;
    date_label: string;
    title: string;
    image_url: string;
    image_alt: string;
    paragraphs: unknown;
  },
  toc: { item_id: string; label: string }[],
  related: {
    related_slug: string;
    related_category: ContentCategory;
    title: string;
    subtitle: string;
    image_url: string;
    image_alt: string;
  }[]
): ContentDetail {
  return {
    slug: row.slug,
    category: row.category,
    date: row.date_label,
    title: row.title,
    image: resolveStorageImageUrl(row.image_url),
    imageAlt: row.image_alt,
    paragraphs: paragraphsFromJson(row.paragraphs),
    tableOfContents:
      toc.length > 0 ? toc.map((t) => ({ id: t.item_id, label: t.label })) : undefined,
    related: related.map((r) => ({
      slug: r.related_slug,
      category: r.related_category,
      title: r.title,
      subtitle: r.subtitle,
      image: resolveStorageImageUrl(r.image_url),
      imageAlt: r.image_alt,
    })),
  };
}
