import Image from "next/image";
import Link from "next/link";
import { MemberPanel } from "@/components/member/member-panel";
import type { DnaTopic } from "@/lib/travel-dna-content";
import { ensureImageSrc } from "@/lib/supabase/storage-url";

interface TravelDnaTopicsProps {
	title: string;
	topics: DnaTopic[];
}

function TopicRow({ topic }: { topic: DnaTopic }) {
	const imageSrc = ensureImageSrc(topic.image, "/images/sd2.png");

	return (
		<li className="flex items-center gap-3">
			<div className="relative size-12 shrink-0 overflow-hidden rounded-md sm:size-14">
				<Image
					src={imageSrc}
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
						{topic.percent}% of trips
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
			{topics.length === 0 ? (
				<p className="mt-4 font-sans text-sm text-luxinc-text-muted">
					No topic scores yet. Tag past journeys with travel topics when you add them.
				</p>
			) : null}
			<ul className="mt-5 space-y-4">
				{topics.map((topic) => (
					<TopicRow key={topic.id} topic={topic} />
				))}
			</ul>
			{topics.length === 0 ? (
				<Link
					href="/member/past-journeys"
					className="mt-4 inline-block font-sans text-sm text-luxinc-gold underline-offset-4 hover:underline"
				>
					Add a past journey
				</Link>
			) : null}
		</MemberPanel>
	);
}
