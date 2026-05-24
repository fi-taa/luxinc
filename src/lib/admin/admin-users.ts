import { upcomingItineraries } from "@/lib/member-content";
import type { UpcomingItinerary } from "@/lib/member-content";
import { pastJourneys } from "@/lib/past-journeys-content";
import type { PastJourney } from "@/lib/past-journeys-content";
import { referralProgrammes } from "@/lib/referral-content";
import type { ReferralProgramme } from "@/lib/referral-content";
import {
	preferredDestinations,
	travelDnaLocationBars,
	travelDnaLocationLegend,
	travelDnaPeriods,
	weakestTopics,
	strongestTopics,
} from "@/lib/travel-dna-content";

export type AdminUserRole = "member" | "admin";
export type AdminUserStatus = "active" | "disabled";

export interface AdminUserRecord {
	id: string;
	name: string;
	email: string;
	phone?: string;
	role: AdminUserRole;
	status: AdminUserStatus;
	joinedAt: string;
	avatarSrc: string;
	upcoming: UpcomingItinerary[];
	pastJourneys: PastJourney[];
	referralProgrammes: ReferralProgramme[];
	travelDnaPeriod: (typeof travelDnaPeriods)[number];
	locationBars: typeof travelDnaLocationBars;
	locationLegend: typeof travelDnaLocationLegend;
	preferredDestinations: typeof preferredDestinations;
	weakestTopics: typeof weakestTopics;
	strongestTopics: typeof strongestTopics;
}

export const adminUsers: AdminUserRecord[] = [
	{
		id: "user-daniel",
		name: "Daniel Alemayehu",
		email: "daniel.alemayehu@luxinc.com",
		phone: "+251 9XX XXX XXX",
		role: "member",
		status: "active",
		joinedAt: "Jan 12, 2025",
		avatarSrc: "/images/a1.png",
		upcoming: upcomingItineraries,
		pastJourneys: pastJourneys,
		referralProgrammes: referralProgrammes,
		travelDnaPeriod: travelDnaPeriods[0],
		locationBars: travelDnaLocationBars,
		locationLegend: travelDnaLocationLegend,
		preferredDestinations: preferredDestinations,
		weakestTopics: weakestTopics,
		strongestTopics: strongestTopics,
	},
	{
		id: "user-salmani",
		name: "Mrs. Salmani A.",
		email: "salmani.a@example.com",
		role: "member",
		status: "active",
		joinedAt: "Mar 4, 2025",
		avatarSrc: "/images/a2.png",
		upcoming: [],
		pastJourneys: pastJourneys.slice(0, 1),
		referralProgrammes: referralProgrammes.slice(0, 1),
		travelDnaPeriod: travelDnaPeriods[1],
		locationBars: travelDnaLocationBars,
		locationLegend: travelDnaLocationLegend,
		preferredDestinations: preferredDestinations,
		weakestTopics: weakestTopics,
		strongestTopics: strongestTopics,
	},
	{
		id: "user-james",
		name: "James C.",
		email: "james.c@luxinc.com",
		role: "admin",
		status: "active",
		joinedAt: "Nov 2, 2024",
		avatarSrc: "/images/c1.png",
		upcoming: [],
		pastJourneys: [],
		referralProgrammes: [],
		travelDnaPeriod: travelDnaPeriods[0],
		locationBars: travelDnaLocationBars,
		locationLegend: travelDnaLocationLegend,
		preferredDestinations: preferredDestinations,
		weakestTopics: weakestTopics,
		strongestTopics: strongestTopics,
	},
	{
		id: "user-meron",
		name: "Meron T.",
		email: "meron.t@example.com",
		role: "member",
		status: "disabled",
		joinedAt: "Feb 18, 2025",
		avatarSrc: "/images/c2.png",
		upcoming: upcomingItineraries.slice(1),
		pastJourneys: [],
		referralProgrammes: referralProgrammes,
		travelDnaPeriod: travelDnaPeriods[2],
		locationBars: travelDnaLocationBars,
		locationLegend: travelDnaLocationLegend,
		preferredDestinations: preferredDestinations,
		weakestTopics: weakestTopics,
		strongestTopics: strongestTopics,
	},
];

export function getAdminUser(id: string): AdminUserRecord | undefined {
	return adminUsers.find((user) => user.id === id);
}

export function getRecentSignUpCount(): number {
	return adminUsers.filter((user) => user.role === "member").length;
}
