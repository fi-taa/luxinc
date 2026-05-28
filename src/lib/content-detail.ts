export type ContentCategory = "journal" | "architects";

export interface InlineSegment {
  text: string;
  href?: string;
}

export interface ContentParagraph {
  segments: InlineSegment[];
}

export interface TableOfContentsItem {
  id: string;
  label: string;
}

export interface RelatedContentItem {
  slug: string;
  category: ContentCategory;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
}

export interface ContentDetail {
  slug: string;
  category: ContentCategory;
  date: string;
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: ContentParagraph[];
  tableOfContents?: TableOfContentsItem[];
  related: RelatedContentItem[];
}

const relatedPool: RelatedContentItem[] = [
  {
    slug: "elroi-backing",
    category: "architects",
    title: "Access",
    subtitle: "Eastern Africa safari guru & luxury edge negotiator",
    image: "/images/a3.png",
    imageAlt: "Elroi branding on black background",
  },
  {
    slug: "team-bios",
    category: "architects",
    title: "Seamless",
    subtitle: "Ethiopian heritage & red-letter cosmopolitan accord",
    image: "/images/a1.png",
    imageAlt: "Classical illustration of a figure addressing a gathering",
  },
  {
    slug: "philosophical",
    category: "architects",
    title: "Client Stories",
    subtitle: "Private aviation director — Gulfstream, helicopter permits",
    image: "/images/a2.png",
    imageAlt: "Classical statue of a bearded philosopher reading",
  },
  {
    slug: "concierge-memo",
    category: "journal",
    title: "The Concierge Memo",
    subtitle: "In every task we perform, we strive for excellence",
    image: "/images/j.png",
    imageAlt: "Journal collage featuring global destinations",
  },
  {
    slug: "nusa-penida-bali",
    category: "journal",
    title: "Island Guide",
    subtitle: "Nusa Penida — cliffs, charter boats, and private sequencing",
    image: "/images/sd4.png",
    imageAlt: "Tropical coastline with limestone cliffs and turquoise water",
  },
];

function pickRelated(
  currentSlug: string,
  currentCategory: ContentCategory
): RelatedContentItem[] {
  return relatedPool
    .filter(
      (item) =>
        !(item.slug === currentSlug && item.category === currentCategory)
    )
    .slice(0, 4);
}

const journalArticles: ContentDetail[] = [
  {
    slug: "nusa-penida-bali",
    category: "journal",
    date: "June 12, 2024",
    title: "Nusa Penida Island In Bali: Travel Guide & Things To Do",
    image: "/images/sd4.png",
    imageAlt: "Tropical coastline with limestone cliffs and turquoise water",
    tableOfContents: [
      { id: "overview", label: "Overview" },
      { id: "getting-there", label: "Getting There" },
      { id: "things-to-do", label: "Things To Do" },
      { id: "where-to-stay", label: "Where To Stay" },
    ],
    paragraphs: [
      {
        segments: [
          {
            text: "Nusa Penida is a relatively small island southeast of Bali, Indonesia. It is part of the ",
          },
          { text: "Nusa Islands", href: "https://en.wikipedia.org/wiki/Nusa_Islands" },
          {
            text: " together with Nusa Lembongan and Nusa Ceningan. The island is known for its dramatic cliffs, crystal-clear waters, and secluded beaches — one of the ",
          },
          {
            text: "most beautiful places to visit in Indonesia",
            href: "https://en.wikipedia.org/wiki/Indonesia",
          },
          { text: "." },
        ],
      },
      {
        segments: [
          {
            text: "For Luxinc clients, Nusa Penida is rarely a standalone stop. We thread it into longer Indonesian arcs — private fast-boat charters from Sanur, cliffside lunch reservations at Kelingking before the day-trippers arrive, and helicopter positioning when the wider itinerary demands it.",
          },
        ],
      },
      {
        segments: [
          {
            text: "Angel's Billabong, Broken Beach, and Crystal Bay remain the headline draws. Our Travel Architects sequence visits to avoid congestion, secure licensed guides, and pair the island with Komodo or Raja Ampat extensions when the brief calls for true remoteness.",
          },
        ],
      },
      {
        segments: [
          {
            text: "Accommodation on Penida has improved, though we still favor private villa buyouts on Bali proper with Penida as a curated day — or overnight only when the client requires dawn at Atuh Beach without compromise.",
          },
        ],
      },
    ],
    related: [],
  },
  {
    slug: "mughal-fort-case-study",
    category: "journal",
    date: "April 3, 2024",
    title: "Private Dinner Inside A Closed Mughal Fort",
    image: "/images/j.png",
    imageAlt: "Journal collage featuring Taj Mahal and heritage destinations",
    paragraphs: [
      {
        segments: [
          {
            text: "72-hour orchestration: antiques sourced from three states, original frescoes stabilized under conservation protocol, and a twelve-course heritage meal served to fourteen guests inside a monument closed to the public.",
          },
        ],
      },
      {
        segments: [
          {
            text: "No vendor names appear in client-facing materials. The fort remains unnamed in our archive — discretion is the deliverable.",
          },
        ],
      },
    ],
    related: [],
  },
  {
    slug: "concierge-memo",
    category: "journal",
    date: "March 18, 2024",
    title: "Three Impossible Requests — March Memo",
    image: "/images/c2.png",
    imageAlt: "Volcanic crater with glowing lava lake at night",
    paragraphs: [
      {
        segments: [
          {
            text: "Helicopter ski positioning on Kilimanjaro. Last-minute gorilla naming ceremony attendance in Rwanda. Private jet diversion for aurora viewing above the Arctic Circle — all fulfilled within the same calendar month.",
          },
        ],
      },
      {
        segments: [
          {
            text: "In every task we perform, we strive for excellence. The memo exists so returning clients understand what \"impossible\" means inside the Luxinc operating system.",
          },
        ],
      },
    ],
    related: [],
  },
];

const architectProfiles: ContentDetail[] = [
  {
    slug: "team-bios",
    category: "architects",
    date: "Updated January 2026",
    title: "Team Bios — Ethiopian Heritage & Ecclesiastical Access",
    image: "/images/a1.png",
    imageAlt: "Classical illustration of a figure addressing a gathering",
    paragraphs: [
      {
        segments: [
          {
            text: "Our Addis-based Travel Architects carry generational fluency in Ethiopia's sacred geography — Lalibela after hours, Danakil with private geologists, liturgy arranged through channels that do not appear in any brochure.",
          },
        ],
      },
      {
        segments: [
          {
            text: "Seamless is not a marketing word here. It describes the red-letter introductions, the embassy-adjacent logistics, and the cosmopolitan accord that lets a single brief move from Bole to Burj without friction.",
          },
        ],
      },
    ],
    related: [],
  },
  {
    slug: "philosophical",
    category: "architects",
    date: "Updated January 2026",
    title: "Philosophical — Private Aviation & Permits",
    image: "/images/a2.png",
    imageAlt: "Classical statue of a bearded philosopher reading",
    paragraphs: [
      {
        segments: [
          {
            text: "Gulfstream G650 and G700 positioning, helicopter permits across East Africa, and last-minute airspace clearance when a board retreat must disappear from public flight trackers.",
          },
        ],
      },
      {
        segments: [
          {
            text: "Client stories from this desk rarely surface publicly. The work is measured in wheels-up certainty and silence on the ramp.",
          },
        ],
      },
    ],
    related: [],
  },
  {
    slug: "elroi-backing",
    category: "architects",
    date: "Updated January 2026",
    title: "Elroi Backing — Safari Guru & Lodge Negotiator",
    image: "/images/a3.png",
    imageAlt: "Elroi branding on black background",
    paragraphs: [
      {
        segments: [
          {
            text: "Luxinc operates with the negotiating power of Elroi Investment Group behind every safari block, lodge buyout, and conservancy access request across Eastern and Southern Africa.",
          },
        ],
      },
      {
        segments: [
          {
            text: "Access means more than a room list. It means the edge table at a camp that has been sold out for eighteen months — and the ranger team that remembers your last visit.",
          },
        ],
      },
    ],
    related: [],
  },
];

const allDetails: ContentDetail[] = [...journalArticles, ...architectProfiles].map(
  (item) => ({
    ...item,
    related: pickRelated(item.slug, item.category),
  })
);

export function getContentDetail(
  category: ContentCategory,
  slug: string
): ContentDetail | undefined {
  return allDetails.find(
    (item) => item.category === category && item.slug === slug
  );
}

export function getContentDetailSlugs(
  category: ContentCategory
): string[] {
  return allDetails
    .filter((item) => item.category === category)
    .map((item) => item.slug);
}

export function getContentDetailPath(
  category: ContentCategory,
  slug: string
): string {
  return `/${category}/${slug}`;
}

export function getArchitectDetailPath(id: string): string {
  return `/architects/${id}`;
}

export const defaultJournalSlug = "nusa-penida-bali";
