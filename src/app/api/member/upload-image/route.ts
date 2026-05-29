import { NextResponse } from "next/server";
import {
	extensionFromMimeType,
	buildMemberImageObjectPath,
	isMemberImageScope,
	MEMBER_IMAGE_MAX_BYTES,
	MEMBER_IMAGE_MIME_TYPES,
	MEMBER_PORTAL_BUCKET,
	storagePathToPublicReference,
} from "@/lib/member/member-image-upload";
import { requireActiveMember } from "@/lib/member/require-member-auth";

export async function POST(request: Request) {
	const auth = await requireActiveMember();
	if (auth.error) {
		return NextResponse.json({ error: auth.error }, { status: auth.status });
	}

	if (!auth.userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const formData = await request.formData();
	const file = formData.get("file");
	const scopeValue = String(formData.get("scope") ?? "");

	if (!(file instanceof File)) {
		return NextResponse.json({ error: "Image file is required." }, { status: 400 });
	}

	if (!isMemberImageScope(scopeValue)) {
		return NextResponse.json({ error: "Invalid upload scope." }, { status: 400 });
	}

	if (!MEMBER_IMAGE_MIME_TYPES.includes(file.type as (typeof MEMBER_IMAGE_MIME_TYPES)[number])) {
		return NextResponse.json(
			{ error: "Use a JPEG, PNG, WebP, or GIF image." },
			{ status: 400 },
		);
	}

	if (file.size > MEMBER_IMAGE_MAX_BYTES) {
		return NextResponse.json({ error: "Image must be 5 MB or smaller." }, { status: 400 });
	}

	const extension = extensionFromMimeType(file.type);
	const objectPath = buildMemberImageObjectPath(auth.userId, scopeValue, extension);
	const bytes = new Uint8Array(await file.arrayBuffer());

	const { error: uploadError } = await auth.supabase.storage
		.from(MEMBER_PORTAL_BUCKET)
		.upload(objectPath, bytes, {
			contentType: file.type,
			upsert: false,
		});

	if (uploadError) {
		return NextResponse.json(
			{
				error: uploadError.message.includes("Bucket not found")
					? "Image storage is not configured. Run supabase/member-storage.sql in Supabase."
					: uploadError.message,
			},
			{ status: 400 },
		);
	}

	const imageUrl = storagePathToPublicReference(objectPath);

	return NextResponse.json({ imageUrl }, { status: 201 });
}
