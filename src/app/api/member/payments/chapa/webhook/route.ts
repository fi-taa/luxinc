import { NextResponse } from "next/server";
import { verifyChapaWebhookSignature } from "@/lib/payments/chapa.server";
import { handleChapaWebhook } from "@/lib/member/payments.server";

interface ChapaWebhookBody {
	tx_ref?: string;
	trx_ref?: string;
	reference?: string;
}

export async function POST(request: Request) {
	const rawBody = await request.text();
	const signature = request.headers.get("x-chapa-signature");

	if (!verifyChapaWebhookSignature(rawBody, signature)) {
		return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
	}

	let body: ChapaWebhookBody = {};
	try {
		body = JSON.parse(rawBody) as ChapaWebhookBody;
	} catch {
		return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
	}

	const txRef = body.tx_ref?.trim() || body.trx_ref?.trim() || body.reference?.trim() || "";

	if (!txRef) {
		return NextResponse.json({ error: "tx_ref missing." }, { status: 400 });
	}

	try {
		await handleChapaWebhook(txRef);
		return NextResponse.json({ ok: true });
	} catch {
		return NextResponse.json({ ok: true });
	}
}
