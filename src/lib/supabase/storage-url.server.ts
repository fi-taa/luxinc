import { existsSync } from "node:fs";
import path from "node:path";
import {
  getLocalPublicImageFallback,
  resolveStorageImageUrl,
} from "@/lib/supabase/storage-url";

/**
 * Prefer files in /public/images when Supabase Storage is missing or private.
 */
export function toLandingImageUrl(url: string | null | undefined): string {
  const resolved = resolveStorageImageUrl(url);
  if (!resolved) return "";

  const localPath = getLocalPublicImageFallback(resolved);
  if (localPath) {
    const absolute = path.join(process.cwd(), "public", localPath);
    if (existsSync(absolute)) return localPath;
  }

  return resolved;
}

export function toLandingImageUrls(urls: string[]): string[] {
  return urls.map((url) => toLandingImageUrl(url)).filter(Boolean);
}
