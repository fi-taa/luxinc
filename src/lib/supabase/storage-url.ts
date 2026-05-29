const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

export const DEFAULT_MEMBER_AVATAR_SRC = "/images/a1.png";

/**
 * Supabase dashboard often copies signed URLs (`/object/sign/...?token=`).
 * Those expire and break next/image. Use permanent public URLs for CMS assets.
 */
export function resolveStorageImageUrl(
  url: string | null | undefined,
): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (!parsed.hostname.endsWith(".supabase.co")) {
      return trimmed;
    }

    const objectMatch = parsed.pathname.match(
      /^\/storage\/v1\/object\/(sign|public|authenticated)\/([^/]+)\/(.+)$/
    );
    if (objectMatch) {
      const bucket = objectMatch[2];
      const objectPath = objectMatch[3];
      parsed.pathname = `/storage/v1/object/public/${bucket}/${objectPath}`;
      parsed.search = "";
      parsed.hash = "";
      return parsed.toString();
    }
  } catch {
    // not a URL
  }

  if (SUPABASE_URL && !trimmed.includes("://")) {
    const path = trimmed.replace(/^\//, "");
    return `${SUPABASE_URL}/storage/v1/object/public/${path}`;
  }

  return trimmed;
}

export function resolveStorageImageUrlOrFallback(
  url: string | null | undefined,
  fallback: string = DEFAULT_MEMBER_AVATAR_SRC,
): string {
  return resolveStorageImageUrl(url) ?? fallback;
}

export function ensureImageSrc(
  src: string | null | undefined,
  fallback: string = DEFAULT_MEMBER_AVATAR_SRC,
): string {
  const trimmed = src?.trim();
  if (!trimmed) return fallback;
  return resolveStorageImageUrl(trimmed) ?? trimmed;
}

export function resolveStorageImageUrls(urls: string[]): string[] {
  return urls
    .map((url) => resolveStorageImageUrl(url))
    .filter((url): url is string => Boolean(url));
}

/** e.g. Supabase …/architects/a1.png → /images/a1.png */
export function getLocalPublicImageFallback(url: string): string | null {
  if (!url.includes(".supabase.co/storage/")) return null;
  const file = url.split("/").pop()?.split("?")[0];
  return file ? `/images/${file}` : null;
}
