import Link from "next/link";
import { cn } from "@/lib/utils";

interface GoldButtonProps {
	children: React.ReactNode;
	href?: string;
	type?: "button" | "submit";
	variant?: "outline" | "solid" | "soft" | "ghost" | "ghost-gradient";
	className?: string;
	onClick?: () => void;
}

const outlineStyles =
	"border border-luxinc-gold bg-transparent text-luxinc-gold hover:bg-luxinc-gold hover:text-luxinc-bg";

const solidStyles =
	"border border-luxinc-gold bg-luxinc-gold text-luxinc-bg hover:bg-luxinc-gold-muted hover:border-luxinc-gold-muted hover:text-luxinc-bg";

const softStyles =
	"border border-luxinc-gold/50 bg-luxinc-gold/30 text-luxinc-gold hover:bg-luxinc-gold/45 hover:border-luxinc-gold/70";

const ghostStyles =
	"border border-luxinc-gold/50 bg-luxinc-gold/30 text-luxinc-bg backdrop-blur-sm hover:bg-luxinc-gold/45 hover:border-luxinc-gold/70";

const ghostGradientStyles =
	"border-0 bg-linear-to-r from-luxinc-gold/45 via-luxinc-gold/20 to-transparent text-luxinc-bg backdrop-blur-sm hover:from-luxinc-gold/55 hover:via-luxinc-gold/25";

export function GoldButton({
	children,
	href,
	type = "button",
	variant = "outline",
	className,
	onClick,
}: GoldButtonProps) {
	const baseStyles = cn(
		"inline-flex h-10 items-center justify-center px-8 font-sans text-xs font-semibold normal-case tracking-normal transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg",
		variant === "solid"
			? solidStyles
			: variant === "soft"
				? softStyles
				: variant === "ghost"
					? ghostStyles
					: variant === "ghost-gradient"
						? ghostGradientStyles
						: outlineStyles,
	);

	if (href) {
		return (
			<Link href={href} onClick={onClick} className={cn(baseStyles, className)}>
				{children}
			</Link>
		);
	}

	return (
		<button type={type} onClick={onClick} className={cn(baseStyles, className)}>
			{children}
		</button>
	);
}
