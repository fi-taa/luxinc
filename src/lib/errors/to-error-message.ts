export function toErrorMessage(value: unknown, fallback = "Something went wrong."): string {
	if (value instanceof Error) {
		return value.message || fallback;
	}
	if (typeof value === "string") {
		return value;
	}
	if (value && typeof value === "object") {
		const record = value as Record<string, unknown>;
		if (typeof record.message === "string") {
			return record.message;
		}
		if (record.message !== undefined) {
			return flattenValidation(record.message);
		}
		if (record.error !== undefined) {
			return toErrorMessage(record.error, fallback);
		}
		return flattenValidation(value);
	}
	return fallback;
}

function flattenValidation(value: unknown): string {
	if (typeof value === "string") {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map(flattenValidation).filter(Boolean).join(", ");
	}
	if (value && typeof value === "object") {
		return Object.entries(value as Record<string, unknown>)
			.map(([key, nested]) => {
				const text = flattenValidation(nested);
				return text ? `${key}: ${text}` : key;
			})
			.filter(Boolean)
			.join("; ");
	}
	return "";
}
