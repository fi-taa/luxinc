import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
interface DetailBackLinkProps {
	href: string;
	className?: string;
}

export function DetailBackLink({ href, className }: DetailBackLinkProps) {
	return (
		<Link
			href={href}
			className={cn(
				"flex items-center gap-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg",
				className,
			)}
		>
			<Image
				src="/images/back.svg"
				alt="Back"
				width={99}
				height={40}
				className="h-7 w-auto md:h-10"
			/>
			<span className="font-sans text-sm font-medium uppercase leading-snug tracking-[0.12em] text-luxinc-text hidden md:block hover:underline">
				Back
			</span>
		</Link>
	);
}
