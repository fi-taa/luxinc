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

export interface ExperienceCard {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
}

export interface PersonCard {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
}

export interface JournalArticle {
  title: string;
  date: string;
  image: string;
  imageAlt: string;
  href: string;
}

export interface OfficeCard {
  city: string;
  address: string;
  phone: string;
  email: string;
  image: string;
  imageAlt: string;
}

export const site = {
  name: "LUXINC.",
  navCta: {
    label: "Begin Your Journey",
    href: "#contact",
  },
};

export const navLinks: NavLink[] = [
  { label: "Experiences", href: "#destinations", isActive: true },
  { label: "Crown Collection", href: "#crown-collection" },
  { label: "The Architects", href: "#architects" },
  { label: "Journal", href: "#journal" },
  { label: "Our Addresses", href: "#contact" },
];

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

export const commitment = {
  symbol: "4h",
  line1:
    "The Luxinc Promise: Every bespoke request receives a first-draft",
  line2: "itinerary from a Travel Architect within",
  highlight: "4 hours.",
};

export const destinations = {
  titleLine1: "Signature",
  titleLine2: "Destination",
  subtitle: "EAST AFRICA & BEYOND",
  featured: {
    image: "/images/destination-featured.png",
    imageAlt: "Ethiopia landscape with palm trees and city skyline",
    captionTitle: "Ethiopia — Sacred Origins",
    captionBody:
      "After-hours Lalibela, helicopter over Danakil lava lake, private liturgy at Holy Trinity. Unmatched.",
  },
  cards: [
    {
      title: "Kenya — The Untamed Covenant",
      description:
        "Private Masai Mara conservancies, rhino tracking by foot, mid-air helicopter transfers.",
      image: "/images/destination-kenya.png",
      imageAlt: "Giraffes with Kilimanjaro in the background",
    },
    {
      title: "Rwanda & Tanzania",
      description:
        "Gorilla naming ceremonies, night descent into Ngorongoro Crater, private Mnemba Island.",
      image: "/images/destination-rwanda.png",
      imageAlt: "Tropical beach with turquoise water",
    },
    {
      title: "Global Extensions",
      description:
        "Maldives private atolls, Japanese ryokan buyouts, Tuscan villa & helicopter fleet.",
      image: "/images/destination-global.png",
      imageAlt: "World landmarks and private aviation",
    },
  ] satisfies DestinationCard[],
};

export const crownCollection = {
  title: "The Crown Collection",
  subtitle: "extraordinary experiences",
  cards: [
    {
      title: "Ocean Sovereignty",
      description: "Private yacht charters across the Indian Ocean",
      image: placeholderImages.cruise,
      imageAlt: "Luxury cruise ship",
      href: "#",
    },
    {
      title: "Desert Kingdom",
      description: "Exclusive desert retreats under infinite stars",
      image: placeholderImages.desert,
      imageAlt: "Desert landscape at sunset",
      href: "#",
    },
    {
      title: "Urban Elegance",
      description: "Metropolitan luxury in the world's finest cities",
      image: placeholderImages.skyline,
      imageAlt: "City skyline at night",
      href: "#",
    },
  ] satisfies ExperienceCard[],
};

export const architects = {
  title: "The Architects",
  subtitle: "masters of impossible logistics",
  members: [
    {
      name: "James Whitfield",
      role: "Chief Travel Architect",
      image: placeholderImages.architect1,
      imageAlt: "James Whitfield portrait",
    },
    {
      name: "Sarah Chen",
      role: "Destination Curator",
      image: placeholderImages.architect2,
      imageAlt: "Sarah Chen portrait",
    },
    {
      name: "Marcus Okonkwo",
      role: "Experience Designer",
      image: placeholderImages.architect3,
      imageAlt: "Marcus Okonkwo portrait",
    },
  ] satisfies PersonCard[],
};

export const blackBook = {
  title: "The Luxury Black Book",
  subtitle: "Exclusive access to the world's finest establishments",
  placeholder: "Enter your email for privileged access",
  buttonLabel: "Subscribe",
};

export const journal = {
  title: "Journal",
  subtitle: "The Concierge Voice",
  articles: [
    {
      title: "The Art of Slow Travel",
      date: "March 2026",
      image: placeholderImages.journal1,
      imageAlt: "Slow travel article thumbnail",
      href: "#",
    },
    {
      title: "Hidden Gems of the Serengeti",
      date: "February 2026",
      image: placeholderImages.journal2,
      imageAlt: "Serengeti article thumbnail",
      href: "#",
    },
    {
      title: "Private Aviation Redefined",
      date: "January 2026",
      image: placeholderImages.journal3,
      imageAlt: "Private aviation article thumbnail",
      href: "#",
    },
  ] satisfies JournalArticle[],
  featured: {
    label: "Case Study",
    title: "A Royal Safari: 14 Days Across East Africa",
    description:
      "How we orchestrated an impossible itinerary for a family of four, spanning three countries, five lodges, and a private charter—delivered in under 4 hours from first inquiry.",
    image: placeholderImages.caseStudy,
    imageAlt: "Safari case study feature image",
    cta: "Read More",
    href: "#",
  },
};

export const team = {
  title: "Meet The Team",
  subtitle: "masters of impossible logistics",
  members: [
    {
      name: "Elena Vasquez",
      role: "Head of Concierge",
      image: placeholderImages.team1,
      imageAlt: "Elena Vasquez headshot",
    },
    {
      name: "David Okafor",
      role: "Logistics Director",
      image: placeholderImages.team2,
      imageAlt: "David Okafor headshot",
    },
    {
      name: "Amelia Hart",
      role: "Client Relations",
      image: placeholderImages.team3,
      imageAlt: "Amelia Hart headshot",
    },
  ] satisfies PersonCard[],
};

export const offices = {
  title: "Address Info",
  subtitle: "masters of impossible logistics",
  locations: [
    {
      city: "London",
      address: "14 Berkeley Square, Mayfair, London W1J 6BR",
      phone: "+44 20 7123 4567",
      email: "london@luxinc.com",
      image: placeholderImages.london,
      imageAlt: "London cityscape",
    },
    {
      city: "Dubai",
      address: "Level 42, Emirates Towers, Sheikh Zayed Road, Dubai",
      phone: "+971 4 123 4567",
      email: "dubai@luxinc.com",
      image: placeholderImages.dubai,
      imageAlt: "Dubai skyline",
    },
  ] satisfies OfficeCard[],
};

export const footer = {
  quote:
    "Memories from Luxinc... My travel is impossible dream. It's a constant creation.",
  copyright: "© 2026 Luxinc. All rights reserved.",
  links: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
  social: [
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Twitter", href: "#" },
  ],
};
