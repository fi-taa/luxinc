import { createSupabaseServerClient } from "@/lib/supabase/server";
import { toLandingImageUrl } from "@/lib/supabase/storage-url.server";
import { getContentDetail } from "@/lib/content-detail";
import type { ContentDetail } from "@/lib/content-detail";
import { mapArchitectToContentDetail } from "@/lib/cms/mappers";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isArchitectId(value: string): boolean {
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

export async function fetchArchitectIds(): Promise<string[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("architects").select("id");

  if (error) {
    console.error("[cms] architects ids fetch failed:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.id as string);
}

export async function fetchArchitectDetail(
  id: string
): Promise<ContentDetail | undefined> {
  if (!isArchitectId(id)) {
    return getContentDetail("architects", id);
  }

  const supabase = createSupabaseServerClient();
  const { data: row, error } = await supabase
    .from("architects")
    .select(
      "id,title,description,sub_title,short_description,image_url,updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[cms] architect detail fetch failed:", error.message);
  }

  if (!row) {
    return undefined;
  }

  const { data: related } = await supabase
    .from("architects")
    .select("id,title,sub_title,short_description,image_url")
    .neq("id", id)
    .order("updated_at", { ascending: true })
    .limit(4);

  return withLandingImages(mapArchitectToContentDetail(row, related ?? []));
}
