interface DashboardPlaceholderProps {
	title: string;
	description: string;
}

export function DashboardPlaceholder({
	title,
	description,
}: DashboardPlaceholderProps) {
	return (
		<section
			aria-labelledby="dashboard-placeholder-heading"
			className="flex min-h-[280px] flex-col items-center justify-center border border-luxinc-border/60 bg-luxinc-panel/40 px-6 py-16 text-center md:min-h-[360px] md:px-12"
		>
			<h1
				id="dashboard-placeholder-heading"
				className="font-diphylleia text-2xl font-normal text-luxinc-gold md:text-3xl"
			>
				{title}
			</h1>
			<p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-luxinc-text-muted md:text-base">
				{description}
			</p>
			<p className="mt-8 font-diphylleia text-sm text-luxinc-gold/80">
				Coming soon
			</p>
		</section>
	);
}
