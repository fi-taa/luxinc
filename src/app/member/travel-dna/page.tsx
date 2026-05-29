import { TravelDnaDashboardPanel } from "@/components/member/travel-dna/travel-dna-dashboard-panel";
import { fetchMemberTravelDna } from "@/lib/member/member-data.server";

export default async function TravelDnaPage() {
	let travelDna = null;
	let error: string | null = null;

	try {
		travelDna = await fetchMemberTravelDna();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to load travel DNA.";
	}

	return <TravelDnaDashboardPanel travelDna={travelDna} error={error} />;
}
