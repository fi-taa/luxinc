import Link from "next/link";
import {
	getContentDetailPath,
	type RelatedContentItem,
} from "@/lib/content-detail";
import { FillImage } from "@/components/landing/fill-image";

interface RelatedContentCardProps {
	item: RelatedContentItem;
}

export function RelatedContentCard({ item }: RelatedContentCardProps) {
	const href = getContentDetailPath(item.category, item.slug);

	return (
		<Link
			href={href}
			className="group relative block aspect-square overflow-hidden  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg "
		>
			<FillImage
				containerClassName="absolute inset-0"
				src={item.image}
				alt={item.imageAlt}
				className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
				sizes="(max-width: 768px) 100vw, 25vw"
			/>
			<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-black/10" />
			<div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
				<h3 className="font-sans text-base font-semibold text-luxinc-text md:text-md">
					{item.title}
				</h3>
				<p className="mt-2 font-sans text-xs font-normal leading-relaxed text-luxinc-text/85 md:text-xs">
					{item.subtitle}
				</p>
			</div>
		</Link>
	);
}
