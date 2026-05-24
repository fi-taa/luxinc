export interface DnaLocationBar {
	id: string;
	label: string;
	percent: number;
	color: string;
}

export interface DnaLocationLegend {
	id: string;
	label: string;
	percent: number;
	color: string;
}

export interface PreferredDestination {
	id: string;
	rank: number;
	name: string;
	pointsLabel: string;
	correctPercent?: number;
	trend: "up" | "down";
}

export interface DnaTopic {
	id: string;
	name: string;
	percent: number;
	image: string;
	imageAlt: string;
}

export const travelDnaPeriods = [
	"for September 2019",
	"for August 2019",
	"for July 2019",
] as const;

export const travelDnaChartGrid = [0, 25, 50, 75, 100] as const;

export const travelDnaLocationBars: DnaLocationBar[] = [
	{ id: "addis", label: "Addis Ababa, Ethiopia", percent: 63, color: "#FF7F6B" },
	{ id: "tanzania", label: "Tanzania", percent: 47, color: "#B56CFF" },
	{ id: "dubai", label: "Dubai", percent: 52, color: "#FFD24A" },
	{ id: "kenya", label: "Kenya Mombasa", percent: 81, color: "#FF3DB8" },
];

export const travelDnaLocationLegend: DnaLocationLegend[] = [
	{
		id: "kenya",
		label: "Kenya Mombassa",
		percent: 81.57,
		color: "#FF3DB8",
	},
	{
		id: "addis",
		label: "Addis Ababa, Ethiopia",
		percent: 63.25,
		color: "#FF7F6B",
	},
	{ id: "dubai", label: "Dubai", percent: 52.95, color: "#FFD24A" },
	{ id: "tanzania", label: "Tanzania", percent: 47.29, color: "#B56CFF" },
];

export const preferredDestinations: PreferredDestination[] = [
	{
		id: "beaches",
		rank: 1,
		name: "Beaches",
		pointsLabel: "52 Points / User",
		correctPercent: 97,
		trend: "up",
	},
	{
		id: "mountains",
		rank: 2,
		name: "Mountains",
		pointsLabel: "52 Points / User",
		correctPercent: 95,
		trend: "down",
	},
	{
		id: "historical",
		rank: 3,
		name: "Historical Cities",
		pointsLabel: "52 Points / User",
		correctPercent: 87,
		trend: "up",
	},
	{
		id: "desert",
		rank: 4,
		name: "Desert Escapes",
		pointsLabel: "52 Points / User",
		trend: "up",
	},
	{
		id: "islands",
		rank: 5,
		name: "Islands",
		pointsLabel: "52 Points / User",
		trend: "down",
	},
	{
		id: "spiritual",
		rank: 6,
		name: "Spiritual Trips",
		pointsLabel: "52 Points / User",
		trend: "up",
	},
];

export const weakestTopics: DnaTopic[] = [
	{
		id: "adventure",
		name: "Adventure",
		percent: 74,
		image: "/images/sd2.png",
		imageAlt: "Adventure travel",
	},
	{
		id: "luxury",
		name: "Luxury",
		percent: 52,
		image: "/images/c2.png",
		imageAlt: "Luxury travel",
	},
	{
		id: "night-life",
		name: "Night Life",
		percent: 36,
		image: "/images/dubai.png",
		imageAlt: "Night life",
	},
];

export const strongestTopics: DnaTopic[] = [
	{
		id: "nightlife",
		name: "Nightlife",
		percent: 95,
		image: "/images/dubai.png",
		imageAlt: "Nightlife",
	},
	{
		id: "culture",
		name: "Culture",
		percent: 92,
		image: "/images/addis.png",
		imageAlt: "Culture",
	},
	{
		id: "foodie",
		name: "Foodie",
		percent: 89,
		image: "/images/c1.png",
		imageAlt: "Foodie experiences",
	},
];
