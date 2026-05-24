import { cn } from "@/lib/utils";

interface AdminPanelProps {
	title?: string;
	children: React.ReactNode;
	className?: string;
}

export function AdminPanel({ title, children, className }: AdminPanelProps) {
	return (
		<section
			className={cn(
				"rounded-sm border border-luxinc-border/50 bg-[#111111] p-4",
				className,
			)}
		>
			{title ? (
				<h2 className="mb-4 border-b border-luxinc-border/40 pb-2 font-sans text-sm font-semibold text-luxinc-text">
					{title}
				</h2>
			) : null}
			{children}
		</section>
	);
}
