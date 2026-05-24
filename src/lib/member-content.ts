export type MemberNavId =
	| "upcoming"
	| "travel-dna"
	| "concierge"
	| "referrals"
	| "past-journeys";

export interface MemberNavItem {
	id: MemberNavId;
	label: string;
	href: string;
}

export interface ItineraryStop {
	time: string;
	activity: string;
}

export interface UpcomingItinerary {
	id: string;
	destination: string;
	travelDate: string;
	image: string;
	imageAlt: string;
	stops: ItineraryStop[];
}

export const memberUser = {
	name: "Daniel Alemayehu",
	avatarSrc: "/images/a1.png",
};

export const memberNavItems: MemberNavItem[] = [
	{ id: "upcoming", label: "Upcoming Itinerary", href: "/member/upcoming" },
	{ id: "travel-dna", label: "Travel DNA Profile", href: "/member/travel-dna" },
	{
		id: "concierge",
		label: "24/7 Concierge Chat",
		href: "/member/concierge",
	},
	{ id: "referrals", label: "Referral Programme", href: "/member/referrals" },
	{ id: "past-journeys", label: "Past Journeys", href: "/member/past-journeys" },
];

export const upcomingItineraries: UpcomingItinerary[] = [
	{
		id: "tanzania-june-2026",
		destination: "Tanzania",
		travelDate: "June 10, 2026",
		image: "/images/sd3.png",
		imageAlt: "Tropical coastline in Tanzania",
		stops: [
			{ time: "8:00 AM", activity: "Flight departure" },
			{ time: "11:30 AM", activity: "Arrive in Paris" },
			{ time: "2:00 PM", activity: "Private transfer to hotel" },
			{ time: "7:00 PM", activity: "Welcome dinner" },
		],
	},
	{
		id: "kenya-june-2026",
		destination: "Kenya",
		travelDate: "June 10, 2026",
		image: "/images/sd5.png",
		imageAlt: "Wildlife safari in Kenya",
		stops: [
			{ time: "8:00 AM", activity: "Flight departure" },
			{ time: "11:30 AM", activity: "Arrive in Paris" },
			{ time: "2:00 PM", activity: "Private transfer to hotel" },
			{ time: "7:00 PM", activity: "Welcome dinner" },
		],
	},
];
