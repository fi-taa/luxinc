import Image from "next/image";
import Link from "next/link";
import { navLinks, site } from "@/lib/landing-content";
import type { NavLink } from "@/lib/landing-content";
import { memberUser } from "@/lib/member-content";
import { cn } from "@/lib/utils";

interface MemberHeaderProps {
	activeHref?: string;
}

function resolveNavLinks(activeHref?: string): NavLink[] {
	return navLinks.map((link) => {
		const href = link.href.startsWith("#") ? `/${link.href}` : link.href;
		return {
			...link,
			href,
			isActive: activeHref ? href === activeHref : link.isActive,
		};
	});
}

export function MemberHeader({ activeHref = "/#destinations" }: MemberHeaderProps) {
	const resolvedLinks = resolveNavLinks(activeHref);

	return (
		<header className="relative z-50">
			<div className="mx-auto grid w-full max-w-[1280px] grid-cols-[auto_1fr_auto] items-center gap-4 px-6 py-6 md:px-10 md:py-8 lg:px-16">
				<Link
					href="/"
					className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-luxinc-bg"
				>
					<Image
						src="/images/logo.svg"
						alt={site.name}
						width={500}
						height={500}
						className="h-9 w-auto md:h-11"
						priority
					/>
				</Link>
				<nav
					className="hidden items-center justify-center gap-8 md:flex lg:gap-10"
					aria-label="Main navigation"
				>
					{resolvedLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className={
								link.isActive
									? "font-sans text-sm text-luxinc-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
									: "font-sans text-sm text-luxinc-text transition-colors hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
							}
						>
							{link.label}
						</Link>
					))}
				</nav>
				<div className="flex items-center justify-end gap-3 md:gap-4">
					<span className="hidden font-sans text-sm text-luxinc-text md:inline">
						{memberUser.name}
					</span>
					<div
						className={cn(
							"relative size-10 shrink-0 overflow-hidden rounded-full md:size-11",
							"ring-2 ring-luxinc-gold ring-offset-2 ring-offset-luxinc-bg",
						)}
					>
						<Image
							src={memberUser.avatarSrc}
							alt=""
							fill
							className="object-cover"
							sizes="44px"
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
