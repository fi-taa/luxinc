import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ContentCategory, ContentDetail } from "@/lib/content-detail";
import { getContentDetail, getContentDetailSlugs } from "@/lib/cms/fallbacks";
import { mapContentArticle } from "@/lib/cms/mappers";
import { toLandingImageUrl } from "@/lib/supabase/storage-url.server";

export async function fetchContentDetail(
  category: ContentCategory,
  slug: string
): Promise<ContentDetail | undefined> {
  const supabase = createSupabaseServerClient();
  const { data: article } = await supabase
    .from("content_articles")
    .select("id,slug,category,date_label,title,image_url,image_alt,paragraphs")
    .eq("category", category)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!article) {
    return getContentDetail(category, slug);
  }

  const [{ data: toc }, { data: related }] = await Promise.all([
    supabase
      .from("content_toc_items")
      .select("item_id,label")
      .eq("article_id", article.id)
      .order("sort_order"),
    supabase
      .from("content_related")
      .select(
        "related_slug,related_category,title,subtitle,image_url,image_alt"
      )
      .eq("article_id", article.id)
      .order("sort_order"),
  ]);

  const detail = mapContentArticle(article, toc ?? [], related ?? []);
  detail.image = toLandingImageUrl(detail.image);
  detail.related = detail.related.map((item) => ({
    ...item,
    image: toLandingImageUrl(item.image),
  }));
  if (!detail.related.length) {
    const fallbackDetail = getContentDetail(category, slug);
    if (fallbackDetail) detail.related = fallbackDetail.related;
  }
  return detail;
}

export async function fetchContentSlugs(
  category: ContentCategory
): Promise<string[]> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("content_articles")
    .select("slug")
    .eq("category", category)
    .eq("is_published", true);

  if (data?.length) return data.map((row) => row.slug);
  return getContentDetailSlugs(category);
}
