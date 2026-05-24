import { cn } from "@/lib/utils";

interface MemberPanelProps {
	children: React.ReactNode;
	className?: string;
}

export function MemberPanel({ children, className }: MemberPanelProps) {
	return (
		<div
			className={cn(
				"border border-luxinc-border/60 bg-luxinc-panel/40 p-5 md:p-6",
				className,
			)}
		>
			{children}
		</div>
	);
}
