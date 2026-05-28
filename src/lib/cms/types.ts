import type {
  DestinationSlide,
  ExperienceCard,
  FeedbackItem,
  NavLink,
  PersonCard,
} from "@/lib/landing-content";
import type { ContentDetail } from "@/lib/content-detail";
import type {
  architects,
  auth,
  blackBook,
  commitment,
  crownCollection,
  destinations,
  feedback,
  footer,
  hero,
  journal,
  offices,
  site,
  team,
} from "@/lib/landing-content";

export interface LandingContent {
  site: typeof site;
  navLinks: NavLink[];
  hero: typeof hero;
  auth: typeof auth;
  commitment: typeof commitment;
  destinations: typeof destinations;
  crownCollection: typeof crownCollection;
  architects: typeof architects;
  blackBook: typeof blackBook;
  journal: typeof journal;
  team: typeof team;
  offices: typeof offices;
  footer: typeof footer;
  feedback: FeedbackItem[];
}

export interface FeedbackFormItem extends FeedbackItem {
  id: string;
}

export interface FeedbackAdminFormState {
  items: FeedbackFormItem[];
}

export interface DestinationSlideRecord extends DestinationSlide {
  id?: string;
  images?: string[];
}

export interface ExperienceCardRecord extends ExperienceCard {
  id?: string;
}

export interface PersonCardRecord extends PersonCard {
  id?: string;
}

export interface DestinationsFormState {
  titleImage: string;
  titleImageAlt: string;
  slides: DestinationSlideRecord[];
}

export interface CrownCollectionFormState {
  title: string;
  subtitle: string;
  cards: ExperienceCardRecord[];
}

export interface ArchitectsFormState {
  title: string;
  subtitle: string;
  members: PersonCardRecord[];
}

export interface TeamFormState {
  title: string;
  subtitle: string;
  members: PersonCardRecord[];
}

export interface JournalHighlightForm {
  id: string;
  title: string;
  subTitle: string;
  body: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface JournalAdminFormState {
  highlights: JournalHighlightForm[];
}

export type { ContentDetail };
