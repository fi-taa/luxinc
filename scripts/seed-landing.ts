/**
 * Seeds Supabase CMS tables from static UI content (src/lib/landing-content.ts).
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env for RLS bypass.
 *
 * Run: npm run seed:cms
 */
import { createClient } from "@supabase/supabase-js";
import * as fb from "../src/lib/cms/fallbacks";
import {
  getContentDetail,
  getContentDetailSlugs,
} from "../src/lib/content-detail";
import {
  mapBlackBookToRow,
  mapCommitmentToRow,
  mapDestinationToRow,
  mapArchitectToRow,
  mapCrownCollectionToRow,
  mapFooterToRow,
  mapHeroToRow,
  mapTeamToRow,
} from "../src/lib/cms/mappers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key in .env");
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "Warning: SUPABASE_SERVICE_ROLE_KEY not set — seed may fail on admin-only tables."
  );
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function fail(error: { message: string } | null) {
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
}

async function main() {
  fail((await supabase.from("hero_settings").upsert(mapHeroToRow(fb.hero))).error);
  fail((await supabase.from("commitment_settings").upsert(mapCommitmentToRow(fb.commitment))).error);
  await supabase.from("destinations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  fail(
    (
      await supabase.from("destinations").insert(
        fb.destinations.slides.map((s, i) => mapDestinationToRow(s, i))
      )
    ).error
  );

  await supabase.from("crown_collections").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  fail(
    (
      await supabase.from("crown_collections").insert(
        fb.crownCollection.cards.map((c, i) => mapCrownCollectionToRow(c, i))
      )
    ).error
  );

  await supabase.from("architects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  fail(
    (
      await supabase.from("architects").insert(
        fb.architects.members.map((m) => mapArchitectToRow(m))
      )
    ).error
  );

  await supabase.from("teams").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  fail(
    (
      await supabase.from("teams").insert(
        fb.team.members.map((m) => ({
          ...mapTeamToRow(m),
          status: "active",
          role: "member",
        }))
      )
    ).error
  );

  await supabase.from("journals").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  fail(
    (
      await supabase.from("journals").insert(
        fb.journal.highlights.map((h, index) => ({
          title: h.label,
          sub_title: h.label,
          short_description: h.body,
          description: null,
          image_url: null,
          order: index,
          is_published: true,
        }))
      )
    ).error
  );

  await supabase.from("feedback").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  fail(
    (
      await supabase.from("feedback").insert(
        fb.feedback.map((item, index) => ({
          full_name: item.fullName,
          description: item.description,
          is_featured: item.featured,
          order: index,
          is_published: true,
        }))
      )
    ).error
  );

  fail((await supabase.from("footer_settings").upsert(mapFooterToRow(fb.footer))).error);
  fail((await supabase.from("black_book_settings").upsert(mapBlackBookToRow(fb.blackBook))).error);

  for (const category of ["journal", "architects"] as const) {
    for (const slug of getContentDetailSlugs(category)) {
      const detail = getContentDetail(category, slug);
      if (!detail) continue;

      const { data: article, error } = await supabase
        .from("content_articles")
        .upsert(
          {
            slug: detail.slug,
            category: detail.category,
            date_label: detail.date,
            title: detail.title,
            image_url: detail.image,
            image_alt: detail.imageAlt,
            paragraphs: detail.paragraphs,
            is_published: true,
          },
          { onConflict: "category,slug" }
        )
        .select("id")
        .single();
      fail(error);
      if (!article) continue;

      await supabase.from("content_toc_items").delete().eq("article_id", article.id);
      if (detail.tableOfContents?.length) {
        fail(
          (
            await supabase.from("content_toc_items").insert(
              detail.tableOfContents.map((item, index) => ({
                article_id: article.id,
                item_id: item.id,
                label: item.label,
                sort_order: index,
              }))
            )
          ).error
        );
      }
    }
  }

  console.log("Landing CMS seed completed.");
}

main();
