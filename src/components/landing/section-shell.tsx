import { cn } from "@/lib/utils";

interface SectionShellProps {
	id?: string;
	children: React.ReactNode;
	className?: string;
	ariaLabelledBy?: string;
	bordered?: boolean;
	fullWidth?: boolean;
}

export function SectionShell({
	id,
	children,
	className,
	ariaLabelledBy,
	bordered = false,
	fullWidth = false,
}: SectionShellProps) {
	return (
		<section
			id={id}
			aria-labelledby={ariaLabelledBy}
			className={cn(
				"py-20 md:py-28 lg:py-32",
				bordered && "border-y border-luxinc-border",
				className,
			)}
		>
			<div
				className={cn(
					"mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-16",
					fullWidth && "max-w-none px-0",
				)}
			>
				{children}
			</div>
		</section>
	);
}
