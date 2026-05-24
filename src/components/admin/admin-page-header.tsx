import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface AdminPageHeaderProps {
	title: string;
	description?: string;
	previewHref?: string;
	action?: React.ReactNode;
}

export function AdminPageHeader({
	title,
	description,
	previewHref,
	action,
}: AdminPageHeaderProps) {
	return (
		<div className="mb-5 flex flex-col gap-3 border-b border-luxinc-border/40 pb-4 sm:flex-row sm:items-start sm:justify-between">
			<div className="min-w-0">
				<h1 className="font-sans text-xl font-semibold tracking-tight text-luxinc-text md:text-2xl">
					{title}
				</h1>
				{description ? (
					<p className="mt-1 font-sans text-sm text-luxinc-text-muted">
						{description}
					</p>
				) : null}
				{previewHref ? (
					<Link
						href={previewHref}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-2 inline-flex items-center gap-1 font-sans text-xs text-luxinc-gold transition-colors hover:text-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
					>
						View on site
						<ExternalLink className="size-3" aria-hidden />
					</Link>
				) : null}
			</div>
			{action ? <div className="shrink-0">{action}</div> : null}
		</div>
	);
}
