/**
 * Static fallbacks when DB is empty or unreachable.
 * Source of truth for initial seed + offline dev.
 */
export {
  site,
  navLinks,
  hero,
  auth,
  commitment,
  destinations,
  crownCollection,
  architects,
  blackBook,
  journal,
  team,
  offices,
  feedback,
  footer,
} from "@/lib/landing-content";

export {
  getContentDetail,
  getContentDetailSlugs,
  getContentDetailPath,
  defaultJournalSlug,
} from "@/lib/content-detail";

export type { ContentCategory, ContentDetail } from "@/lib/content-detail";
