import "server-only";
import { createStaticClient } from "@/lib/supabase/static";
import { isSupabaseConfigured } from "@/lib/env";

export interface TaxonomyTerm {
  slug: string;
  name_ru: string;
  seo_title: string | null;
  seo_description: string | null;
  intro_ru: string | null;
  body_ru: string | null;
}

type TaxonomyTable = "categories" | "eras" | "makers";

/** `body_ru` exists only on the landing taxonomies (categories / eras). */
const TABLES_WITH_BODY: TaxonomyTable[] = ["categories", "eras"];

export async function getTaxonomyTerm(
  table: TaxonomyTable,
  slug: string,
): Promise<TaxonomyTerm | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createStaticClient();
  const cols = TABLES_WITH_BODY.includes(table)
    ? "slug, name_ru, seo_title, seo_description, intro_ru, body_ru"
    : "slug, name_ru, seo_title, seo_description, intro_ru";
  const { data } = await supabase.from(table).select(cols).eq("slug", slug).single();
  const term = (data as Record<string, unknown> | null) ?? null;
  if (!term) return null;
  return {
    slug: term.slug as string,
    name_ru: term.name_ru as string,
    seo_title: (term.seo_title as string | null) ?? null,
    seo_description: (term.seo_description as string | null) ?? null,
    intro_ru: (term.intro_ru as string | null) ?? null,
    body_ru: (term.body_ru as string | null) ?? null,
  };
}

export async function getTaxonomySlugs(table: TaxonomyTable): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase.from(table).select("slug");
  return (data ?? []).map((r) => (r as { slug: string }).slug);
}

export interface TaxonomyLink {
  slug: string;
  name_ru: string;
}

/** Ordered taxonomy terms (slug + name) for nav grids, e.g. «Магазин по эпохам». */
export async function listTaxonomyTerms(
  table: TaxonomyTable,
): Promise<TaxonomyLink[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from(table)
    .select("slug, name_ru")
    .order("sort_order");
  return (data as TaxonomyLink[]) ?? [];
}
