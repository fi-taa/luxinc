export function deriveReportingPeriod(travelDateLabel: string): string {
	const trimmed = travelDateLabel.trim();
	if (!trimmed) {
		return reportingPeriodForDate(new Date());
	}

	if (/^for\s/i.test(trimmed)) {
		return trimmed;
	}

	const parsed = Date.parse(trimmed);
	if (!Number.isNaN(parsed)) {
		return reportingPeriodForDate(new Date(parsed));
	}

	return `for ${trimmed}`;
}

function reportingPeriodForDate(date: Date): string {
	const label = date.toLocaleString("en-US", { month: "long", year: "numeric" });
	return `for ${label}`;
}
