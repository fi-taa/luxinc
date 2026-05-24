"use client";

import { Copy, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ReferralActionsProps {
	referralLink: string;
	className?: string;
}

const outlineActionStyles =
	"inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-luxinc-gold bg-transparent font-diphylleia text-sm font-normal text-luxinc-gold transition-colors hover:bg-luxinc-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]";

const primaryActionStyles =
	"inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-md border border-luxinc-gold bg-luxinc-gold font-diphylleia text-sm font-normal text-luxinc-bg transition-colors hover:border-luxinc-gold-muted hover:bg-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]";

export function ReferralActions({ referralLink, className }: ReferralActionsProps) {
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(referralLink);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}

	async function handleShare() {
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Luxinc Referral",
					text: "Join me on Luxinc",
					url: referralLink,
				});
			} catch {
				return;
			}
			return;
		}
		await handleCopy();
	}

	return (
		<div className={cn("flex w-full flex-col gap-3", className)}>
			<button type="button" onClick={handleCopy} className={outlineActionStyles}>
				<Copy className="size-4 shrink-0" aria-hidden />
				{copied ? "Copied" : "Copy Referral Link"}
			</button>
			<button type="button" onClick={handleShare} className={outlineActionStyles}>
				<Share2 className="size-4 shrink-0" aria-hidden />
				Share Now
			</button>
			<button type="button" className={primaryActionStyles}>
				<Mail className="size-4 shrink-0" aria-hidden />
				Invite Friends
			</button>
		</div>
	);
}
