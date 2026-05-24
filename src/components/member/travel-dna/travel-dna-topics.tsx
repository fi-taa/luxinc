import Image from "next/image";
import { MemberPanel } from "@/components/member/member-panel";
import type { DnaTopic } from "@/lib/travel-dna-content";

interface TravelDnaTopicsProps {
	title: string;
	topics: DnaTopic[];
}

function TopicRow({ topic }: { topic: DnaTopic }) {
	return (
		<li className="flex items-center gap-3">
			<div className="relative size-12 shrink-0 overflow-hidden rounded-md sm:size-14">
				<Image
					src={topic.image}
					alt={topic.imageAlt}
					fill
					className="object-cover"
					sizes="56px"
				/>
			</div>
			<div className="min-w-0 flex-1">
				<div className="flex items-center justify-between gap-2">
					<p className="font-sans text-sm font-medium text-luxinc-text">
						{topic.name}
					</p>
					<span className="shrink-0 font-sans text-xs text-luxinc-text-muted">
						{topic.percent}% Correct
					</span>
				</div>
				<div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
					<div
						className="h-full rounded-full bg-luxinc-gold transition-all duration-300"
						style={{ width: `${topic.percent}%` }}
					/>
				</div>
			</div>
		</li>
	);
}

export function TravelDnaTopics({ title, topics }: TravelDnaTopicsProps) {
	return (
		<MemberPanel>
			<h2 className="font-diphylleia text-lg font-normal text-luxinc-gold md:text-xl">
				{title}
			</h2>
			<ul className="mt-5 space-y-4">
				{topics.map((topic) => (
					<TopicRow key={topic.id} topic={topic} />
				))}
			</ul>
		</MemberPanel>
	);
}
