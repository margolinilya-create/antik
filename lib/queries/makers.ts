import "server-only";
import { createStaticClient } from "@/lib/supabase/static";
import { isSupabaseConfigured } from "@/lib/env";

export interface Maker {
  id: string;
  slug: string;
  name_ru: string;
  name_en: string | null;
  country: string | null;
  founded: string | null;
  tagline_ru: string | null;
  bio_ru: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_featured: boolean;
}

export interface BrandListItem extends Maker {
  item_count: number;
}

const SELECT =
  "id, slug, name_ru, name_en, country, founded, tagline_ru, bio_ru, seo_title, seo_description, is_featured";

/** All brand makers (those with a written profile), with visible-item counts. */
export async function listBrands(): Promise<BrandListItem[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const [{ data: makers }, { data: items }] = await Promise.all([
    supabase
      .from("makers")
      .select(SELECT)
      .not("bio_ru", "is", null)
      .order("is_featured", { ascending: false })
      .order("name_ru"),
    supabase
      .from("items")
      .select("maker_id")
      .in("status", ["in_stock", "reserved", "sold"])
      .not("maker_id", "is", null),
  ]);

  const counts = new Map<string, number>();
  for (const r of (items as { maker_id: string }[]) ?? []) {
    counts.set(r.maker_id, (counts.get(r.maker_id) ?? 0) + 1);
  }
  return ((makers as Maker[]) ?? []).map((m) => ({
    ...m,
    item_count: counts.get(m.id) ?? 0,
  }));
}

export async function getMakerBySlug(slug: string): Promise<Maker | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("makers")
    .select(SELECT)
    .eq("slug", slug)
    .single();
  return (data as Maker | null) ?? null;
}

/** Brand slugs (with a profile) for generateStaticParams / sitemap. */
export async function getBrandSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("makers")
    .select("slug")
    .not("bio_ru", "is", null);
  return ((data as { slug: string }[]) ?? []).map((r) => r.slug);
}
