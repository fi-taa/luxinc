"use client";

import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { site } from "@/lib/landing-content";
import { useAppSelector } from "@/store/hooks";
import { selectAuth } from "@/store/slices/auth-slice";

interface AdminHeaderProps {
	title?: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
	const { profile } = useAppSelector(selectAuth);
	const operatorName = profile?.full_name ?? "Admin";

	return (
		<header className="sticky top-0 z-30 border-b border-luxinc-border/50 bg-[#0c0c0c]">
			<div className="flex h-12 items-center justify-between gap-3 px-4 lg:px-5">
				<div className="flex min-w-0 items-center gap-3">
					<Link
						href="/admin/dashboard"
						className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
					>
						<Image
							src="/images/logo.svg"
							alt={site.name}
							width={500}
							height={500}
							className="h-6 w-auto"
						/>
						<span className="rounded border border-luxinc-gold/40 bg-luxinc-gold/10 px-1.5 py-0.5 font-sans text-[10px] font-semibold tracking-wider text-luxinc-gold uppercase">
							Admin
						</span>
					</Link>
					{title ? (
						<>
							<span
								className="hidden text-luxinc-text-muted sm:inline"
								aria-hidden
							>
								/
							</span>
							<span className="hidden truncate font-sans text-sm text-luxinc-text sm:inline">
								{title}
							</span>
						</>
					) : null}
				</div>
				<div className="flex items-center gap-3 sm:gap-4">
					<span className="hidden max-w-[140px] truncate font-sans text-xs text-luxinc-text-muted sm:inline md:max-w-none md:text-sm">
						{operatorName}
					</span>
					<SignOutButton
						redirectTo="/admin/login"
						className="font-sans text-xs text-luxinc-gold transition-colors hover:text-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold sm:text-sm"
					/>
				</div>
			</div>
		</header>
	);
}
