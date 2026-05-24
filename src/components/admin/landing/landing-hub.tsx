import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { landingSections } from "@/lib/admin/landing-sections";
import { cn } from "@/lib/utils";

export function LandingHub() {
	return (
		<>
			<AdminPageHeader
				title="Landing page"
				description="Manage marketing sections shown on the public homepage."
				previewHref="/"
			/>
			<div className="grid gap-4 md:grid-cols-2">
				{landingSections.map((section) => (
					<article
						key={section.id}
						className="flex flex-col rounded-sm border border-luxinc-border/50 bg-[#111111] p-4"
					>
						<div className="flex items-start justify-between gap-3">
							<h2 className="font-sans text-sm font-semibold text-luxinc-text">
								{section.name}
							</h2>
							<span
								className={cn(
									"shrink-0 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-medium uppercase",
									section.status === "published"
										? "bg-luxinc-gold/20 text-luxinc-gold"
										: "bg-white/10 text-luxinc-text-muted",
								)}
							>
								{section.status}
							</span>
						</div>
						<p className="mt-2 flex-1 font-sans text-sm text-luxinc-text-muted">
							{section.description}
						</p>
						<p className="mt-3 font-sans text-xs text-luxinc-text-muted">
							Updated {section.lastUpdated}
						</p>
						<Link
							href={section.href}
							className="mt-4 inline-flex h-8 items-center justify-center rounded-sm border border-luxinc-border bg-[#0c0c0c] px-3 font-sans text-xs font-medium text-luxinc-text transition-colors hover:border-luxinc-gold/50 hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
						>
							Edit
						</Link>
					</article>
				))}
			</div>
		</>
	);
}
