export function formatJourneyPrice(amountMinor: number, currency: string): string {
	const formatted = new Intl.NumberFormat("en-US", {
		maximumFractionDigits: 0,
	}).format(amountMinor);

	return `${formatted} ${currency}`;
}
