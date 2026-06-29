import "server-only";
import { createStaticClient } from "@/lib/supabase/static";
import { isSupabaseConfigured } from "@/lib/env";

export interface TaxonomyTerm {
  slug: string;
  name_ru: string;
  seo_title: string | null;
  seo_description: string | null;
}

type TaxonomyTable = "categories" | "eras" | "makers";

export async function getTaxonomyTerm(
  table: TaxonomyTable,
  slug: string,
): Promise<TaxonomyTerm | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createStaticClient();
  const { data } = await supabase
    .from(table)
    .select("slug, name_ru, seo_title, seo_description")
    .eq("slug", slug)
    .single();
  return (data as TaxonomyTerm | null) ?? null;
}

export async function getTaxonomySlugs(table: TaxonomyTable): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase.from(table).select("slug");
  return (data ?? []).map((r) => (r as { slug: string }).slug);
}
