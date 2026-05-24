import {
	strongestTopics,
	weakestTopics,
} from "@/lib/travel-dna-content";
import { TravelDnaChart } from "./travel-dna-chart";
import { TravelDnaDestinations } from "./travel-dna-destinations";
import { TravelDnaTopics } from "./travel-dna-topics";

export function TravelDnaDashboard() {
	return (
		<section aria-labelledby="travel-dna-heading" className="space-y-6">
			<h1 id="travel-dna-heading" className="sr-only">
				Travel DNA Profile
			</h1>
			<TravelDnaChart />
			<div className="grid gap-6 lg:grid-cols-2">
				<TravelDnaDestinations />
				<div className="flex flex-col gap-6">
					<TravelDnaTopics title="Weakest Topics" topics={weakestTopics} />
					<TravelDnaTopics title="Strongest Topics" topics={strongestTopics} />
				</div>
			</div>
		</section>
	);
}
