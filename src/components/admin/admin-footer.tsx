import Link from "next/link";

export function AdminFooter() {
	return (
		<footer className="border-t border-luxinc-border/50 bg-[#0c0c0c] px-4 py-3 lg:px-5">
			<div className="flex flex-wrap items-center justify-between gap-2 font-sans text-xs text-luxinc-text-muted">
				<p>Luxinc Admin · Preview environment</p>
				<Link
					href="/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-luxinc-gold transition-colors hover:text-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
				>
					View public site
				</Link>
			</div>
		</footer>
	);
}
