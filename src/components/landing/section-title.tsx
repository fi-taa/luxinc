import { cn } from "@/lib/utils";

interface SectionTitleProps {
	id?: string;
	title: string;
	subtitle?: string;
	align?: "left" | "center";
	className?: string;
}

export function SectionTitle({
	id,
	title,
	subtitle,
	align = "center",
	className,
}: SectionTitleProps) {
	return (
		<div
			className={cn(
				"text-center",
				align === "left" && "md:text-left",
				className,
			)}
		>
			<h2
				id={id}
				className="font-diphylleia text-[clamp(3rem,10vw,40px)] font-normal not-italic leading-none tracking-normal text-luxinc-gold"
			>
				{title}
			</h2>
			{subtitle ? (
				<p className="mt-3 font-diphylleia text-[clamp(1rem,5vw,24px)] font-normal not-italic leading-none tracking-normal text-luxinc-text">
					{subtitle}
				</p>
			) : null}
		</div>
	);
}
