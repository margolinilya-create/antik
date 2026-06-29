import "server-only";
import { createStaticClient } from "@/lib/supabase/static";
import { isSupabaseConfigured } from "@/lib/env";
import type {
  ItemDetail,
  ItemListRow,
  SearchResult,
  Facets,
} from "@/types/database";

const EMPTY_FACETS: Facets = {
  categories: [],
  eras: [],
  makers: [],
  materials: [],
  price: null,
};

export interface SearchFilters {
  q?: string;
  category?: string;
  era?: string;
  maker?: string;
  material?: string;
  condition?: string;
  price_min?: number;
  price_max?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "relevance";
  limit?: number;
  offset?: number;
}

/** Faceted search via the single `search_items` RPC. */
export async function searchItems(filters: SearchFilters): Promise<SearchResult> {
  if (!isSupabaseConfigured) {
    return { items: [], total: 0, facets: EMPTY_FACETS };
  }
  const supabase = createStaticClient();
  const { data, error } = await supabase.rpc("search_items", { filters });
  if (error || !data) {
    return { items: [], total: 0, facets: EMPTY_FACETS };
  }
  return data as unknown as SearchResult;
}

/** All published slugs for generateStaticParams / sitemap. */
export async function getPublishedSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("items")
    .select("slug, updated_at")
    .in("status", ["in_stock", "reserved", "sold"]);
  return data ?? [];
}

/** Single item detail by slug, with joined taxonomy + images. */
export async function getItemBySlug(slug: string): Promise<ItemDetail | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createStaticClient();
  const { data, error } = await supabase
    .from("items")
    .select(
      `id, slug, title_ru, subtitle_ru, description_ru, condition, condition_note_ru,
       provenance_ru, year_made_text, height_mm, width_mm, depth_mm, diameter_mm,
       weight_g, price, currency, price_on_request, status, seo_title, seo_description,
       updated_at,
       category:categories(slug, name_ru),
       era:eras(slug, name_ru),
       maker:makers(slug, name_ru),
       materials:item_materials(materials(slug, name_ru)),
       techniques:item_techniques(techniques(slug, name_ru)),
       images:item_images(storage_path, alt_ru, width, height, blurhash)`,
    )
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  // Flatten Supabase's nested join shape into our ItemDetail.
  const row = data as Record<string, unknown>;
  return {
    ...(row as object),
    category: pickOne(row.category),
    era: pickOne(row.era),
    maker: pickOne(row.maker),
    materials: flattenJoin(row.materials, "materials"),
    techniques: flattenJoin(row.techniques, "techniques"),
    images: (row.images as ItemDetail["images"]) ?? [],
  } as ItemDetail;
}

function pickOne<T>(value: unknown): T | null {
  if (!value) return null;
  return (Array.isArray(value) ? (value[0] ?? null) : value) as T;
}

function flattenJoin<T>(value: unknown, key: string): T[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => (entry as Record<string, unknown>)[key])
    .filter(Boolean) as T[];
}

export type { ItemListRow };
