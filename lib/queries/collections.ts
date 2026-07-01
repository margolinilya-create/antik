import "server-only";
import { createStaticClient } from "@/lib/supabase/static";
import { isSupabaseConfigured } from "@/lib/env";
import type { ItemDetail, ItemListRow } from "@/types/database";

export interface CollectionSummary {
  slug: string;
  title_ru: string;
  subtitle_ru: string | null;
  cover_path: string | null;
}

export interface Collection extends CollectionSummary {
  id: string;
  intro_ru: string | null;
  seo_title: string | null;
  seo_description: string | null;
}

const SUMMARY = "slug, title_ru, subtitle_ru, cover_path";

/**
 * Featured collections for the homepage «В подборках» block.
 * Falls back to the latest published collections when none are flagged.
 */
export async function listFeaturedCollections(
  limit = 4,
): Promise<CollectionSummary[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("collections")
    .select(SUMMARY)
    .not("published_at", "is", null)
    .eq("is_featured", true)
    .order("sort_order")
    .limit(limit);
  const featured = (data as CollectionSummary[]) ?? [];
  if (featured.length > 0) return featured;
  const { data: latest } = await supabase
    .from("collections")
    .select(SUMMARY)
    .not("published_at", "is", null)
    .order("sort_order")
    .limit(limit);
  return (latest as CollectionSummary[]) ?? [];
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("collections")
    .select(`id, ${SUMMARY}, intro_ru, seo_title, seo_description`)
    .eq("slug", slug)
    .not("published_at", "is", null)
    .single();
  return (data as Collection | null) ?? null;
}

/**
 * Items of a collection in the CURATED order (collection_items.sort_order).
 * Items hidden by RLS (draft/archived) come back null and are dropped, so the
 * landing never links to a dead-end page.
 */
export async function listCollectionItems(
  collectionId: string,
): Promise<ItemListRow[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("collection_items")
    .select(
      `sort_order,
       item:items(
         id, slug, title_ru, subtitle_ru, price, currency, price_on_request, status,
         category:categories(name_ru), era:eras(name_ru), maker:makers(name_ru),
         images:item_images(storage_path, alt_ru, width, height, blurhash, is_primary, sort_order)
       )`,
    )
    .eq("collection_id", collectionId)
    .order("sort_order");

  const one = (v: unknown) =>
    (Array.isArray(v) ? v[0] : v) as { name_ru: string } | null;

  return ((data as Record<string, unknown>[]) ?? [])
    .map((row) => (Array.isArray(row.item) ? row.item[0] : row.item))
    .filter(Boolean)
    .map((it) => {
      const item = it as Record<string, unknown>;
      const imgs =
        (item.images as (ItemDetail["images"][number] & {
          is_primary?: boolean;
          sort_order?: number;
        })[]) ?? [];
      const cover = [...imgs].sort(
        (a, b) =>
          Number(b.is_primary) - Number(a.is_primary) ||
          (a.sort_order ?? 0) - (b.sort_order ?? 0),
      )[0];
      return {
        id: item.id,
        slug: item.slug,
        title_ru: item.title_ru,
        subtitle_ru: item.subtitle_ru ?? null,
        price: item.price ?? null,
        currency: item.currency,
        price_on_request: item.price_on_request,
        status: item.status,
        category: one(item.category)?.name_ru ?? null,
        era: one(item.era)?.name_ru ?? null,
        maker: one(item.maker)?.name_ru ?? null,
        image: cover
          ? {
              storage_path: cover.storage_path,
              alt_ru: cover.alt_ru,
              width: cover.width,
              height: cover.height,
              blurhash: cover.blurhash,
            }
          : null,
      } as ItemListRow;
    });
}

/** Published collection slugs for generateStaticParams / sitemap. */
export async function getCollectionSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("collections")
    .select("slug")
    .not("published_at", "is", null);
  return ((data as { slug: string }[]) ?? []).map((r) => r.slug);
}
