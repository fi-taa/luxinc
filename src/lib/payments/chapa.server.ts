import { toErrorMessage } from "@/lib/errors/to-error-message";

interface ChapaConfig {
	secretKey: string;
	appUrl: string;
	webhookSecret: string | null;
}

interface ChapaInitializeInput {
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	txRef: string;
	amount: string;
	currency: string;
	title: string;
	description: string;
	returnUrl: string;
	callbackUrl: string;
}

interface ChapaInitializeResponse {
	status: string;
	message: string | Record<string, unknown>;
	data?: {
		checkout_url?: string;
	};
}

interface ChapaVerifyResponse {
	status: string;
	message: string;
	data?: {
		status?: string;
		reference?: string;
		amount?: number;
		currency?: string;
	};
}

export interface ChapaVerifyResult {
	status: "success" | "failed" | "pending";
	refId: string | null;
	amount: number | null;
	currency: string | null;
	raw: Record<string, unknown>;
}

export function getChapaConfig(): ChapaConfig {
	const secretKey = process.env.CHAPA_SECRET_KEY?.trim();
	const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

	if (!secretKey) {
		throw new Error("CHAPA_SECRET_KEY is not configured.");
	}
	if (!appUrl) {
		throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
	}

	return {
		secretKey,
		appUrl,
		webhookSecret: process.env.CHAPA_WEBHOOK_SECRET?.trim() || null,
	};
}

export function normalizeChapaPhone(phone: string | null | undefined): string {
	const digits = (phone ?? "").replace(/\D/g, "");

	if (digits.length >= 12 && digits.startsWith("251")) {
		return `0${digits.slice(3, 12)}`;
	}
	if (digits.length === 10 && digits.startsWith("09")) {
		return digits;
	}
	if (digits.length === 9 && (digits.startsWith("9") || digits.startsWith("7"))) {
		return `0${digits}`;
	}

	throw new Error(
		"Add a valid Ethiopian mobile number to your profile (e.g. 0912345678) before paying.",
	);
}

function parseChapaInitializeFailure(payload: ChapaInitializeResponse, status: number): string {
	const fromMessage = toErrorMessage(
		typeof payload.message === "object" ? payload.message : { message: payload.message },
		"",
	);
	if (fromMessage) {
		return fromMessage;
	}
	return `Chapa initialize failed (HTTP ${status}).`;
}

const CHAPA_CUSTOMIZATION_DISALLOWED = /[^a-zA-Z0-9\-_\s.]/g;
const CHAPA_CUSTOMIZATION_TITLE_MAX = 16;

export function sanitizeChapaCustomizationText(value: string): string {
	return value
		.replace(/[—–]/g, "-")
		.replace(/&/g, " and ")
		.replace(CHAPA_CUSTOMIZATION_DISALLOWED, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function formatChapaCustomizationTitle(value: string): string {
	const sanitized = sanitizeChapaCustomizationText(value);
	if (!sanitized) {
		return "Luxinc Journey";
	}
	if (sanitized.length <= CHAPA_CUSTOMIZATION_TITLE_MAX) {
		return sanitized;
	}
	return sanitized.slice(0, CHAPA_CUSTOMIZATION_TITLE_MAX).trim();
}

export function formatChapaCustomizationDescription(value: string): string {
	const sanitized = sanitizeChapaCustomizationText(value);
	return sanitized || "Luxinc upcoming journey";
}

export function generateChapaTxRef(profileId: string, upcomingJourneyId: string): string {
	const stamp = Date.now().toString(36);
	const profilePart = profileId.replace(/-/g, "").slice(0, 8);
	const journeyPart = upcomingJourneyId.replace(/-/g, "").slice(0, 8);
	return `lux-${profilePart}-${journeyPart}-${stamp}`;
}

export async function initializeChapaPayment(
	input: ChapaInitializeInput,
): Promise<{ checkoutUrl: string }> {
	const { secretKey } = getChapaConfig();

	const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${secretKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			amount: input.amount,
			currency: input.currency,
			email: input.email,
			first_name: input.firstName,
			last_name: input.lastName,
			phone_number: input.phone,
			tx_ref: input.txRef,
			callback_url: input.callbackUrl,
			return_url: input.returnUrl,
			customization: {
				title: formatChapaCustomizationTitle(input.title),
				description: formatChapaCustomizationDescription(input.description),
			},
		}),
	});

	const payload = (await response.json()) as ChapaInitializeResponse;
	if (!response.ok || payload.status !== "success" || !payload.data?.checkout_url) {
		throw new Error(parseChapaInitializeFailure(payload, response.status));
	}

	return { checkoutUrl: payload.data.checkout_url };
}

function parseChapaTransactionStatus(
	payload: ChapaVerifyResponse,
	httpOk: boolean,
): ChapaVerifyResult["status"] {
	if (!httpOk) {
		return "pending";
	}

	const rootStatus = payload.status?.toLowerCase() ?? "";
	if (rootStatus === "failed" && !payload.data) {
		return "failed";
	}

	const data = payload.data as Record<string, unknown> | undefined;
	const transactionStatus = String(data?.status ?? data?.payment_status ?? "")
		.toLowerCase()
		.trim();

	if (["success", "successful", "paid", "completed"].includes(transactionStatus)) {
		return "success";
	}
	if (["failed", "cancelled", "canceled", "declined"].includes(transactionStatus)) {
		return "failed";
	}

	return "pending";
}

export async function verifyChapaPayment(txRef: string): Promise<ChapaVerifyResult> {
	const { secretKey } = getChapaConfig();

	const response = await fetch(
		`https://api.chapa.co/v1/transaction/verify/${encodeURIComponent(txRef)}`,
		{
			headers: { Authorization: `Bearer ${secretKey}` },
		},
	);

	const payload = (await response.json()) as ChapaVerifyResponse;
	const raw = payload as unknown as Record<string, unknown>;

	if (!response.ok && response.status !== 404) {
		const message =
			typeof payload.message === "string" && payload.message
				? payload.message
				: `Chapa verify failed (HTTP ${response.status}).`;
		throw new Error(message);
	}

	const status = parseChapaTransactionStatus(payload, response.ok);
	const data = payload.data as Record<string, unknown> | undefined;
	const amountRaw = data?.amount;
	const amount =
		typeof amountRaw === "number"
			? amountRaw
			: typeof amountRaw === "string"
				? Number.parseFloat(amountRaw)
				: null;

	return {
		status,
		refId: typeof data?.reference === "string" ? data.reference : null,
		amount: amount !== null && !Number.isNaN(amount) ? amount : null,
		currency: typeof data?.currency === "string" ? data.currency : null,
		raw,
	};
}

export function verifyChapaWebhookSignature(
	payload: string,
	signatureHeader: string | null,
): boolean {
	const { webhookSecret } = getChapaConfig();
	if (!webhookSecret) {
		return true;
	}
	if (!signatureHeader) {
		return false;
	}
	return signatureHeader === webhookSecret;
}
