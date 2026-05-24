"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavGroups } from "@/lib/admin/admin-nav";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
	className?: string;
}

function isActive(pathname: string, href: string): boolean {
	if (href === "/admin/dashboard") {
		return pathname === "/admin/dashboard";
	}
	if (href === "/admin/users") {
		return pathname === "/admin/users";
	}
	if (href === "/admin/landing") {
		return pathname === "/admin/landing";
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ className }: AdminSidebarProps) {
	const pathname = usePathname();

	return (
		<nav aria-label="Admin navigation" className={cn(className)}>
			<div className="md:max-h-[calc(100vh-3rem)] md:overflow-y-auto md:py-2">
				{adminNavGroups.map((group) => (
					<div
						key={group.id}
						className="border-b border-luxinc-border/30 last:border-0 md:border-0"
					>
						<p className="px-3 pt-3 pb-1 font-sans text-[10px] font-semibold tracking-wider text-luxinc-text-muted uppercase md:px-3 md:pt-4">
							{group.label}
						</p>
						<ul className="flex gap-0 overflow-x-auto md:flex-col md:overflow-visible">
							{group.items.map((item) => {
								const active = isActive(pathname, item.href);
								return (
									<li key={item.href} className="shrink-0 md:shrink">
										<Link
											href={item.href}
											className={cn(
												"block whitespace-nowrap px-3 py-2 font-sans text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-luxinc-gold md:py-1.5",
												active
													? "bg-luxinc-gold/15 text-luxinc-text md:border-r-2 md:border-luxinc-gold md:bg-luxinc-gold/10"
													: "text-luxinc-text-muted hover:bg-white/5 hover:text-luxinc-text",
											)}
										>
											{item.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				))}
			</div>
		</nav>
	);
}
