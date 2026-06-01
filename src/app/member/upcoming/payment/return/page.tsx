import Link from "next/link";
import {
	pickTxRefFromReturnSearchParams,
	resolvePaymentTxRefForMember,
	verifyMemberChapaPayment,
} from "@/lib/member/payments.server";
import { requireActiveMember } from "@/lib/member/require-member-auth";

interface ReturnPageProps {
	searchParams: Promise<{
		tx_ref?: string;
		trx_ref?: string;
		tnx_ref?: string;
		upcomingJourneyId?: string;
	}>;
}

export default async function UpcomingPaymentReturnPage({ searchParams }: ReturnPageProps) {
	const params = await searchParams;
	let status: "success" | "failed" | "pending" | "unknown" = "unknown";
	let message = "We could not confirm your payment.";

	const auth = await requireActiveMember();
	if (auth.error || !auth.userId) {
		message = "Please sign in to confirm your payment.";
	} else {
		try {
			const txRef = await resolvePaymentTxRefForMember(auth.userId, {
				txRefFromUrl: pickTxRefFromReturnSearchParams(params),
				upcomingJourneyId: params.upcomingJourneyId,
			});

			if (!txRef) {
				message =
					"We could not find a payment to verify. Return to Upcoming journeys and try again, or contact support if you were charged.";
			} else {
				const result = await verifyMemberChapaPayment(txRef, auth.userId);
				if (result.status === "success") {
					status = "success";
					message =
						"Payment confirmed. Your journey is saved under Past journeys.";
				} else if (result.status === "failed") {
					status = "failed";
					message =
						"Payment was not completed. You can try again from Upcoming journeys.";
				} else {
					status = "pending";
					message =
						"Payment is still processing. Refresh this page in a moment.";
				}
			}
		} catch (e) {
			message = e instanceof Error ? e.message : message;
		}
	}

	return (
		<section className="mx-auto max-w-lg py-12 text-center">
			<h1 className="font-diphylleia text-2xl text-luxinc-gold">
				{status === "success" ? "Thank you" : "Payment status"}
			</h1>
			<p className="mt-4 font-sans text-sm text-luxinc-text">{message}</p>
			<div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
				<Link
					href="/member/past-journeys"
					className="font-sans text-sm font-semibold text-luxinc-gold underline-offset-2 hover:underline"
				>
					Past journeys
				</Link>
				<Link
					href="/member/upcoming"
					className="font-sans text-sm text-luxinc-text-muted underline-offset-2 hover:underline"
				>
					Upcoming journeys
				</Link>
			</div>
		</section>
	);
}
