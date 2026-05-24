export interface PastJourneyStop {
	time: string;
	activity: string;
}

export interface PastJourney {
	id: string;
	destination: string;
	travelDate: string;
	image: string;
	imageAlt: string;
	stops: PastJourneyStop[];
}

export const pastJourneys: PastJourney[] = [
	{
		id: "tanzania-june-2026",
		destination: "Tanzania",
		travelDate: "June 10, 2026",
		image: "/images/sd3.png",
		imageAlt: "Tropical beach in Tanzania with palm trees and turquoise water",
		stops: [
			{ time: "8:00 AM", activity: "Flight departure" },
			{ time: "11:30 AM", activity: "Arrive in Paris" },
			{ time: "1:00 PM", activity: "Check in to hotel" },
			{ time: "3:00 PM", activity: "Visit Eiffel Tower" },
			{ time: "7:00 PM", activity: "Dinner cruise on the Seine River" },
		],
	},
];
