const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

/**
 * Supabase dashboard often copies signed URLs (`/object/sign/...?token=`).
 * Those expire and break next/image. Use permanent public URLs for CMS assets.
 */
export function resolveStorageImageUrl(url: string | null | undefined): string {
  if (!url?.trim()) return "";
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

export function resolveStorageImageUrls(urls: string[]): string[] {
  return urls.map((url) => resolveStorageImageUrl(url)).filter(Boolean);
}

/** e.g. Supabase …/architects/a1.png → /images/a1.png */
export function getLocalPublicImageFallback(url: string): string | null {
  if (!url.includes(".supabase.co/storage/")) return null;
  const file = url.split("/").pop()?.split("?")[0];
  return file ? `/images/${file}` : null;
}
