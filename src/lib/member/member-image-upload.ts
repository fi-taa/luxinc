export const MEMBER_PORTAL_BUCKET = "member-portal";

export const MEMBER_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const MEMBER_IMAGE_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
] as const;

export type MemberImageScope = "itineraries" | "referrals";

export function isMemberImageScope(value: string): value is MemberImageScope {
	return value === "itineraries" || value === "referrals";
}

export function buildMemberImageObjectPath(
	profileId: string,
	scope: MemberImageScope,
	extension: string,
): string {
	const safeExtension = extension.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
	return `${profileId}/${scope}/${crypto.randomUUID()}.${safeExtension}`;
}

export function extensionFromMimeType(mimeType: string): string {
	switch (mimeType) {
		case "image/png":
			return "png";
		case "image/webp":
			return "webp";
		case "image/gif":
			return "gif";
		default:
			return "jpg";
	}
}

export function storagePathToPublicReference(objectPath: string): string {
	return `${MEMBER_PORTAL_BUCKET}/${objectPath}`;
}
