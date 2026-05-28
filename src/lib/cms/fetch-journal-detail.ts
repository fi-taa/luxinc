import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toLandingImageUrl } from "@/lib/supabase/storage-url.server";
import { getContentDetail } from "@/lib/content-detail";
import type { ContentDetail } from "@/lib/content-detail";
import { mapJournalToContentDetail } from "@/lib/cms/mappers";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isJournalId(value: string): boolean {
  return UUID_RE.test(value);
}

function withLandingImages(detail: ContentDetail): ContentDetail {
  return {
    ...detail,
    image: toLandingImageUrl(detail.image),
    related: detail.related.map((item) => ({
      ...item,
      image: toLandingImageUrl(item.image),
    })),
  };
}

export async function fetchJournalIds(): Promise<string[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("journals")
    .select("id")
    .eq("is_published", true);

  if (error) {
    console.error("[cms] journals ids fetch failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.id as string);
}

export async function fetchJournalDetail(
  slug: string
): Promise<ContentDetail | undefined> {
  if (!isJournalId(slug)) {
    return getContentDetail("journal", slug);
  }

  const supabase = createSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("journals")
    .select(
      "id,title,sub_title,short_description,description,image_url,updated_at"
    )
    .eq("id", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("[cms] journal detail fetch failed:", error.message);
  }

  if (!row) {
    return undefined;
  }

  const { data: related } = await supabase
    .from("journals")
    .select("id,title,sub_title,short_description,image_url")
    .eq("is_published", true)
    .neq("id", slug)
    .order("order", { ascending: true })
    .limit(4);

  return withLandingImages(mapJournalToContentDetail(row, related ?? []));
}
