import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
	getContentDetailPath,
	getContentDetailSlugs,
	type ContentCategory,
} from "@/lib/content-detail";

interface ContentArticlesPanelProps {
	category: ContentCategory;
	title?: string;
	description?: string;
}

export function ContentArticlesPanel({
	category,
	title = "Detail articles",
	description = "Long-form pages linked from this section. Add new articles or edit existing ones.",
}: ContentArticlesPanelProps) {
	const slugs = getContentDetailSlugs(category);
	const adminBase = `/admin/landing/${category}`;

	return (
		<AdminPanel title={title}>
			<p className="mb-4 font-sans text-sm text-luxinc-text-muted">
				{description}
			</p>
			<ul className="divide-y divide-luxinc-border/40 border border-luxinc-border/50 rounded-sm">
				{slugs.map((slug) => (
					<li
						key={slug}
						className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
					>
						<span className="font-sans text-sm text-luxinc-text">{slug}</span>
						<div className="flex items-center gap-3">
							<Link
								href={getContentDetailPath(category, slug)}
								target="_blank"
								rel="noopener noreferrer"
								className="font-sans text-xs text-luxinc-text-muted hover:text-luxinc-text"
							>
								Preview
							</Link>
							<Link
								href={`${adminBase}/${slug}`}
								className="font-sans text-xs font-medium text-luxinc-gold hover:text-luxinc-gold-muted"
							>
								Edit
							</Link>
						</div>
					</li>
				))}
			</ul>
			<Link
				href={`${adminBase}/new`}
				className="mt-4 inline-flex h-8 items-center gap-1.5 rounded-sm border border-dashed border-luxinc-gold/50 bg-luxinc-gold/5 px-3 font-sans text-xs font-medium text-luxinc-gold transition-colors hover:border-luxinc-gold hover:bg-luxinc-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
			>
				<Plus className="size-3.5" aria-hidden />
				Add article
			</Link>
		</AdminPanel>
	);
}
