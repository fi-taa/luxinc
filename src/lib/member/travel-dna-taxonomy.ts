export const TRAVEL_DNA_ALL_PERIODS = "All past trips";

export const travelDnaDestinationCategories = [
	"Beaches",
	"Mountains",
	"Historical Cities",
	"Desert Escapes",
	"Islands",
	"Spiritual Trips",
] as const;

export const travelDnaTopicOptions = [
	"Adventure",
	"Luxury",
	"Night Life",
	"Culture",
	"Foodie",
] as const;

export const travelDnaLocationColors = [
	"#FF7F6B",
	"#B56CFF",
	"#FFD24A",
	"#FF3DB8",
	"#5E9BFF",
	"#DAEF68",
] as const;

export interface TravelDnaTopicDefinition {
	slug: string;
	name: string;
	image: string;
	imageAlt: string;
}

export const travelDnaTopicDefinitions: TravelDnaTopicDefinition[] = [
	{
		slug: "adventure",
		name: "Adventure",
		image: "/images/sd2.png",
		imageAlt: "Adventure travel",
	},
	{
		slug: "luxury",
		name: "Luxury",
		image: "/images/c2.png",
		imageAlt: "Luxury travel",
	},
	{
		slug: "night-life",
		name: "Night Life",
		image: "/images/dubai.png",
		imageAlt: "Night life",
	},
	{
		slug: "culture",
		name: "Culture",
		image: "/images/addis.png",
		imageAlt: "Culture",
	},
	{
		slug: "foodie",
		name: "Foodie",
		image: "/images/c1.png",
		imageAlt: "Foodie experiences",
	},
];

export function slugifyTravelDnaKey(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function normalizeTopicTag(value: string): string | null {
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}
	const match = travelDnaTopicOptions.find(
		(option) => option.toLowerCase() === trimmed.toLowerCase(),
	);
	return match ?? null;
}
