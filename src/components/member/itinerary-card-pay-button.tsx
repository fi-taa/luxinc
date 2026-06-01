"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoldButton } from "@/components/landing/gold-button";
import { toErrorMessage } from "@/lib/errors/to-error-message";
import { formatJourneyPrice } from "@/lib/member/format-journey-price";
import type { UpcomingItinerary } from "@/lib/member-content";

interface ItineraryCardPayButtonProps {
	itinerary: UpcomingItinerary;
}

export function ItineraryCardPayButton({ itinerary }: ItineraryCardPayButtonProps) {
	const router = useRouter();
	const [isPaying, setIsPaying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const priceLabel = formatJourneyPrice(itinerary.amountMinor, itinerary.currency);
	const isPaid = itinerary.paymentStatus === "paid";

	async function handlePay() {
		setError(null);
		setIsPaying(true);

		try {
			const response = await fetch("/api/member/payments/chapa/initialize", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ upcomingJourneyId: itinerary.id }),
			});
			const payload = (await response.json()) as {
				checkoutUrl?: string;
				error?: string | Record<string, unknown>;
			};

			if (!response.ok || !payload.checkoutUrl) {
				throw new Error(toErrorMessage(payload.error, "Could not start payment."));
			}

			window.location.href = payload.checkoutUrl;
		} catch (e) {
			setError(e instanceof Error ? e.message : "Payment failed.");
			setIsPaying(false);
		}
	}

	if (isPaid) {
		return (
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<span className="inline-flex h-10 items-center justify-center rounded border border-luxinc-gold/60 px-6 font-sans text-xs font-semibold text-luxinc-gold">
					Journey confirmed
				</span>
				<Link
					href="/member/past-journeys"
					className="font-sans text-sm text-luxinc-gold underline-offset-2 hover:underline"
					onClick={() => router.refresh()}
				>
					View in Past journeys
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<GoldButton
				type="button"
				variant="solid"
				className="inline-flex items-center gap-2 px-6"
				onClick={handlePay}
			>
				{isPaying ? "Redirecting to payment…" : `Pay ${priceLabel} · Start My Journey`}
				{!isPaying ? <ArrowRight className="size-4" aria-hidden /> : null}
			</GoldButton>
			{error ? <p className="font-sans text-sm text-red-400">{error}</p> : null}
		</div>
	);
}
