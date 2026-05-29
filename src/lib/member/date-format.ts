export function todayIsoDate(): string {
	const date = new Date();
	return toIsoDate(date);
}

export function toIsoDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

export function isoDateToTravelLabel(iso: string): string {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
	if (!match) {
		return iso.trim();
	}

	const year = Number(match[1]);
	const month = Number(match[2]) - 1;
	const day = Number(match[3]);
	const date = new Date(year, month, day);

	if (Number.isNaN(date.getTime())) {
		return iso.trim();
	}

	return date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export function travelLabelToIsoDate(label: string): string {
	const trimmed = label.trim();
	if (!trimmed) {
		return "";
	}

	const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
	if (isoMatch) {
		return trimmed;
	}

	const parsed = Date.parse(trimmed);
	if (Number.isNaN(parsed)) {
		return "";
	}

	return toIsoDate(new Date(parsed));
}

export function timeValueToStopLabel(value: string): string {
	const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
	if (!match) {
		return value.trim();
	}

	const hours = Number(match[1]);
	const minutes = Number(match[2]);
	const date = new Date();
	date.setHours(hours, minutes, 0, 0);

	return date.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

export function stopLabelToTimeValue(label: string): string {
	const trimmed = label.trim();
	if (!trimmed) {
		return "";
	}

	const twentyFourHour = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
	if (twentyFourHour) {
		const hours = Number(twentyFourHour[1]);
		const minutes = Number(twentyFourHour[2]);
		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
	}

	const parsed = Date.parse(`1970-01-01 ${trimmed}`);
	if (Number.isNaN(parsed)) {
		return "";
	}

	const date = new Date(parsed);
	return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
