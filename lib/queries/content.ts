import "server-only";
import { createStaticClient } from "@/lib/supabase/static";
import { isSupabaseConfigured } from "@/lib/env";
import type { ItemListRow } from "@/types/database";

export interface Testimonial {
  id: string;
  author_name: string;
  author_role: string | null;
  text_ru: string;
  rating: number;
}

export interface JournalPost {
  id: string;
  slug: string;
  title_ru: string;
  excerpt_ru: string | null;
  body_ru: string | null;
  cover_path: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  updated_at: string | null;
}

export async function listTestimonials(limit = 6): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, author_name, author_role, text_ru, rating")
    .eq("is_published", true)
    .order("sort_order")
    .limit(limit);
  return (data as Testimonial[]) ?? [];
}

export async function listJournalPosts(limit = 12): Promise<JournalPost[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("journal_posts")
    .select("id, slug, title_ru, excerpt_ru, cover_path, published_at")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as JournalPost[]) ?? [];
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("journal_posts")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .single();
  return (data as JournalPost | null) ?? null;
}

export async function getJournalSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("journal_posts")
    .select("slug")
    .not("published_at", "is", null);
  return ((data as { slug: string }[]) ?? []).map((r) => r.slug);
}

/** Other in-stock items from the same category, for "Похожие предметы". */
export async function listRelatedItems(
  categorySlug: string | null,
  excludeSlug: string,
  limit = 4,
): Promise<ItemListRow[]> {
  if (!isSupabaseConfigured || !categorySlug) return [];
  const supabase = createStaticClient();
  // search_items returns in_stock | reserved | sold; over-fetch then keep only
  // in-stock so "Похожие предметы" never links to dead-end sold/reserved pages.
  const { data } = await supabase.rpc("search_items", {
    filters: { category: categorySlug, limit: limit + 8, sort: "newest" },
  });
  const result = (data as { items: ItemListRow[] } | null)?.items ?? [];
  return result
    .filter((i) => i.slug !== excludeSlug && i.status === "in_stock")
    .slice(0, limit);
}
