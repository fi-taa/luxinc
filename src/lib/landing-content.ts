import { placeholderImages } from "./placeholders";

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface DestinationCard {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface DestinationSlide {
  image: string;
  imageAlt: string;
  headline: string;
  subtitle: string;
  description: string;
}

export interface ExperienceCard {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  featured?: boolean;
}

export interface PersonCard {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  slug: string;
  tall?: boolean;
}

export interface JournalArticle {
  title: string;
  date: string;
  image: string;
  imageAlt: string;
  href: string;
}

export interface OfficeLocationCard {
  heading: string;
  lines: string[];
  image: string;
  imageAlt: string;
}

export interface ConfidentialContactLine {
  icon: "mail" | "whatsapp" | "lock";
  text: string;
  href?: string;
}

export const site = {
  name: "LUXINC.",
  navCta: {
    label: "Login",
    href: "#contact",
  },
};

export const navLinks: NavLink[] = [
  { label: "Experiences", href: "#destinations", isActive: true },
  { label: "Crown Collection", href: "#crown-collection" },
  { label: "The Architects", href: "#architects" },
  { label: "Journal", href: "#journal" },
  { label: "Our Addresses", href: "#contact" },
]

export const hero = {
  location: "Addis Ababa • Dubai",
  subheadline:
    "Unreasonably exclusive access. Absolute discretion. Two gateways to the impossible.",
  cta: "Begin Your Journey",
  ctaHref: "#contact",
  loginCta: "Login",
  loginHref: "#login",
  image: "/images/hero.png",
  imageAlt: "Addis Ababa city boulevard at night",
};

export const auth = {
  image: "/images/auth.png",
  imageAlt: "Tropical coastline with turquoise water and limestone cliffs at Diamond Beach",
  subtitle: "Our Travel Architect Respond within 4 hours",
  signIn: {
    title: "SIGN IN",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    submitLabel: "Sign In",
    switchPrompt: "Don't Have an Account?",
    switchAction: "Sign UP",
  },
  signUp: {
    title: "SIGN UP",
    fullNamePlaceholder: "Full name",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    confirmPasswordPlaceholder: "Confirm Password",
    submitLabel: "Sign Up",
    switchPrompt: "Already Have an Account ?",
    switchAction: "Sign In",
  },
};

export const commitment = {
  symbol: "4h",
  line1:
    "The Luxinc Promise: Every bespoke request receives a first-draft",
  line2: "itinerary from a Travel Architect within",
  highlight: "4 hours.",
};

export const destinations = {
  titleImage: "/images/sd.png",
  titleImageAlt: "Signature Destination — East Africa & Beyond",
  slides: [
    {
      image: "/images/sd2.png",
      imageAlt: "Ethiopia landscape with palm trees and city skyline",
      headline: "Signature Destination",
      subtitle: "Sacred Origins",
      description:
        "After-hours Lalibela, helicopter over Danakil lava lake, private liturgy at Holy Trinity. Unmatched.",
    },
    {
      image: "/images/sd3.png",
      imageAlt: "Giraffes with Kilimanjaro in the background",
      headline: "Addis Ababa",
      subtitle: "The Untamed Covenant",
      description:
        "Private Masai Mara conservancies, rhino tracking by foot, mid-air helicopter transfers.",
    },
    {
      image: "/images/sd4.png",
      imageAlt: "Tropical beach with turquoise water",
      headline: "Rwanda",
      subtitle: "Crater & Coast",
      description:
        "Gorilla naming ceremonies, night descent into Ngorongoro Crater, private Mnemba Island.",
    },
    {
      image: "/images/sd5.png",
      imageAlt: "World landmarks and private aviation",
      headline: "Global",
      subtitle: "Beyond Africa",
      description:
        "Maldives private atolls, Japanese ryokan buyouts, Tuscan villa & helicopter fleet.",
    },
  ] satisfies DestinationSlide[],
};

export const crownCollection = {
  title: "The Crown Collection",
  subtitle: "unrepeatable odysseys",
  cards: [
    {
      title: "THE CROWN ODYSSEY OF THE RIFT →",
      description:
        "14 days, full lodge buyouts, Gulfstream G650, Michelin chef, crater night descent.",
      image: "/images/c1.png",
      imageAlt: "Aerial view of a lush green canyon with a winding river",
      href: "#",
    },
    {
      title: "THE LAST FRONTIER →",
      description:
        "9 days – Danakil, Simiens & exclusive Mara. Volcano cable slide and starlit dinners.",
      image: "/images/c2.png",
      imageAlt: "Volcanic crater with glowing lava lake at night",
      href: "#",
      featured: true,
    },
    {
      title: "CORPORATE CROWN →",
      description:
        "Invisible board retreats for 10–50 executives. Absolute secrecy, flawless operations.",
      image: "/images/c3.png",
      imageAlt: "Tropical beach with overwater bungalows and palm trees",
      href: "#",
    },
  ] satisfies ExperienceCard[],
};

export const architects = {
  title: "The Architects",
  subtitle: "masters of impossible logistics",
  members: [
    {
      name: "Team Bios",
      role: "Ethiopian heritage & exclusive ecclesiastical access.",
      image: "/images/a1.png",
      imageAlt: "Classical illustration of a figure addressing a gathering",
      slug: "team-bios",
    },
    {
      name: "Philosophical",
      role: "Private aviation director – Gulfstream, helicopter permits.",
      image: "/images/a2.png",
      imageAlt: "Classical statue of a bearded philosopher reading",
      slug: "philosophical",
    },
    {
      name: "Elroi Backing",
      role: "Eastern Africa safari guru & luxury lodge negotiator.",
      image: "/images/a3.png",
      imageAlt: "Elroi branding on black background",
      slug: "elroi-backing",
    },
  ] satisfies PersonCard[],
};

export const blackBook = {
  title: "The Luxinc Black Book",
  subtitle:
    "5 experiences you cannot book online. Receive our confidential PDF.",
  placeholder: "Your Exclusive Email",
  buttonLabel: "Send",
};

export const journal = {
  title: "Journal",
  subtitle: "The Concierge Memo",
  collageImage: "/images/j.png",
  collageAlt:
    "Journal collage featuring Taj Mahal, Ethiopia travel, and Santorini destinations",
  caseStudy: {
    label: "CASE STUDY",
    body: "Private dinner inside a closed Mughal fort / \"72-hour orchestration: antiques, original frescoes, a 12-course heritage meal.\"",
  },
  memo: {
    label: "THE MEMO",
    body: "3 impossible requests fulfilled last month / Helicopter ski on Kilimanjaro, last-minute gorilla naming, private jet diversion for aurora.",
  },
  cta: "View More →",
  ctaHref: "/journal/nusa-penida-bali",
  caseStudyHref: "/journal/mughal-fort-case-study",
  memoHref: "/journal/concierge-memo",
};

export const team = {
  title: "Meet The Team",
  subtitle: "masters of impossible logistics",
  members: [
    {
      name: "James C.",
      role: "Private aviation director – Gulfstream, helicopter permits.",
      image: "/images/c1.png",
      imageAlt: "Aerial view of a lush green canyon with a winding river",
      slug: "philosophical",
    },
    {
      name: "Meron T.",
      role: "Ethiopian heritage & exclusive ecclesiastical access.",
      image: "/images/c2.png",
      imageAlt: "Volcanic crater with glowing lava lake at night",
      slug: "team-bios",
    },
    {
      name: "Alexandria V.",
      role: "Southern Africa safari guru & luxury lodge negotiator.",
      image: "/images/c3.png",
      imageAlt: "Tropical beach with overwater bungalows and palm trees",
      slug: "elroi-backing",
    },
  ] satisfies PersonCard[],
};

export const offices = {
  title: "Address Info",
  subtitle: "masters of impossible logistics",
  addis: {
    heading: "ADDIS ABABA · ETHIOPIA",
    lines: [
      "Global Headquarters",
      "Bole Road, Cape Verde Street",
      "Luxinc Pavilion, 4th Floor",
      "Addis Ababa, Ethiopia",
    ],
    image: "/images/addis.png",
    imageAlt: "Addis Ababa skyline at night",
  } satisfies OfficeLocationCard,
  dubai: {
    heading: "DUBAI · UNITED ARAB EMIRATES",
    lines: [
      "Middle East Representative Office",
      "Burj Al Arab Jumeirah, Private Wing",
      "Office 7B – The Terrace",
      "Dubai, UAE",
    ],
    image: "/images/dubai.png",
    imageAlt: "Dubai skyline at sunset",
  } satisfies OfficeLocationCard,
  confidential: {
    title: "Confidential Contact",
    lines: [
      {
        icon: "mail",
        text: "architects@luxinc.com (encrypted)",
        href: "mailto:architects@luxinc.com",
      },
      {
        icon: "whatsapp",
        text: "WhatsApp: +251 9X XXX XXXX (clients only)",
      },
      {
        icon: "lock",
        text: "PGP key upon request",
      },
    ] satisfies ConfidentialContactLine[],
  },
};

export const footer = {
  quote:
    "Flawless from takeoff to landing – they turned an impossible dream into a seamless narrative.",
  attribution: "— Mrs. Salmani A.",
  tagline: "Architects of the Impossible. Custodians of Discretion.",
  locations: "Addis Ababa · Dubai | Member of Elroi Investment Group",
  copyrightLead: "© 2026 Luxinc Luxury Tour & Travel.",
  copyrightTail: "No public pricing. Zero data leakage.",
};
