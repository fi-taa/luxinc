"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { NavLink } from "@/lib/landing-content";
import { AuthCtaButton } from "@/components/auth/auth-cta-button";
import { cn } from "@/lib/utils";

interface MobileNavProps {
	links: NavLink[];
	ctaLabel: string;
	ctaAction: "sign-in" | "sign-up";
}

export function MobileNav({ links, ctaLabel, ctaAction }: MobileNavProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="md:hidden">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				aria-expanded={isOpen}
				aria-label={isOpen ? "Close menu" : "Open menu"}
				className="flex h-10 w-10 items-center justify-center text-luxinc-text transition-colors hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
			>
				{isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
			</button>
			<nav
				className={cn(
					"absolute right-0 top-full mt-2 min-w-[240px] border border-luxinc-border bg-luxinc-bg/98 backdrop-blur-md transition-all duration-200",
					isOpen
						? "visible opacity-100"
						: "invisible pointer-events-none opacity-0",
				)}
				aria-hidden={!isOpen}
			>
				<ul className="flex flex-col py-2">
					{links.map((link) => (
						<li key={link.href}>
							<Link
								href={link.href}
								onClick={() => setIsOpen(false)}
								className={
									link.isActive
										? "block px-6 py-3 font-sans text-sm text-luxinc-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
										: "block px-6 py-3 font-sans text-sm text-luxinc-text transition-colors hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
								}
							>
								{link.label}
							</Link>
						</li>
					))}
				</ul>
				<div className="border-t border-luxinc-border px-6 py-4">
					<AuthCtaButton
						action={ctaAction}
						variant="soft"
						className="w-full"
						onActivate={() => setIsOpen(false)}
					>
						{ctaLabel}
					</AuthCtaButton>
				</div>
			</nav>
		</div>
	);
}
