"use client";

import {
	Archive,
	CalendarDays,
	Dna,
	Gift,
	MessageCircle,
	User,
	type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MemberNavItem } from "@/lib/member-content";
import { memberNavItems } from "@/lib/member-content";
import { cn } from "@/lib/utils";

const iconBySection: Record<MemberNavItem["id"], LucideIcon> = {
	upcoming: CalendarDays,
	"travel-dna": Dna,
	concierge: MessageCircle,
	referrals: Gift,
	"past-journeys": Archive,
	profile: User,
};

interface MemberSidebarProps {
	className?: string;
}

export function MemberSidebar({ className }: MemberSidebarProps) {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Member navigation"
			className={cn(
				"border border-luxinc-gold/35 bg-luxinc-panel/90",
				className,
			)}
		>
			<ul className="flex flex-col">
				{memberNavItems.map((item) => {
					const Icon = iconBySection[item.id];
					const isActive =
						pathname === item.href ||
						(item.id === "upcoming" && pathname === "/member");

					return (
						<li key={item.id}>
							<Link
								href={item.href}
								className={cn(
									"flex items-center gap-3 px-5 py-4 font-sans text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-luxinc-gold",
									isActive
										? "bg-white/8 text-luxinc-text"
										: "text-luxinc-text-muted hover:bg-white/5 hover:text-luxinc-text",
								)}
							>
								<Icon className="size-5 shrink-0 stroke-[1.5]" aria-hidden />
								{item.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
