import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { ItemStatus } from "@/types/database";

export interface AdminItemRow {
  id: string;
  slug: string;
  title_ru: string;
  status: ItemStatus;
  price: number | null;
  currency: string;
  updated_at: string;
}

export interface TaxonomyOption {
  id: string;
  slug: string;
  name_ru: string;
}

export interface AdminItemEdit {
  id: string;
  slug: string;
  title_ru: string;
  subtitle_ru: string | null;
  description_ru: string | null;
  category_id: string | null;
  era_id: string | null;
  maker_id: string | null;
  condition: string | null;
  condition_note_ru: string | null;
  provenance_ru: string | null;
  year_made_text: string | null;
  year_made_from: number | null;
  year_made_to: number | null;
  height_mm: number | null;
  width_mm: number | null;
  depth_mm: number | null;
  diameter_mm: number | null;
  weight_g: number | null;
  price: number | null;
  currency: string;
  price_on_request: boolean;
  status: ItemStatus;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  material_ids: string[];
  technique_ids: string[];
  images: {
    id: string;
    storage_path: string;
    alt_ru: string | null;
    sort_order: number;
    is_primary: boolean;
  }[];
}

export async function listAdminItems(status?: string): Promise<AdminItemRow[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  let query = supabase
    .from("items")
    .select("id, slug, title_ru, status, price, currency, updated_at")
    .order("updated_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return (data as AdminItemRow[]) ?? [];
}

export async function getItemForEdit(id: string): Promise<AdminItemEdit | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select(
      `*,
       material_ids:item_materials(material_id),
       technique_ids:item_techniques(technique_id),
       images:item_images(id, storage_path, alt_ru, sort_order, is_primary)`,
    )
    .eq("id", id)
    .single();
  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  return {
    ...(row as object),
    material_ids: ((row.material_ids as { material_id: string }[]) ?? []).map(
      (m) => m.material_id,
    ),
    technique_ids: ((row.technique_ids as { technique_id: string }[]) ?? []).map(
      (t) => t.technique_id,
    ),
    images: ((row.images as AdminItemEdit["images"]) ?? []).sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  } as AdminItemEdit;
}

export async function getTaxonomyOptions(): Promise<{
  categories: TaxonomyOption[];
  eras: TaxonomyOption[];
  makers: TaxonomyOption[];
  materials: TaxonomyOption[];
  techniques: TaxonomyOption[];
}> {
  const empty = { categories: [], eras: [], makers: [], materials: [], techniques: [] };
  if (!isSupabaseConfigured) return empty;
  const supabase = await createClient();
  const sel = "id, slug, name_ru";
  const [categories, eras, makers, materials, techniques] = await Promise.all([
    supabase.from("categories").select(sel).order("sort_order"),
    supabase.from("eras").select(sel).order("sort_order"),
    supabase.from("makers").select(sel).order("sort_order"),
    supabase.from("materials").select(sel).order("sort_order"),
    supabase.from("techniques").select(sel).order("sort_order"),
  ]);
  return {
    categories: (categories.data as TaxonomyOption[]) ?? [],
    eras: (eras.data as TaxonomyOption[]) ?? [],
    makers: (makers.data as TaxonomyOption[]) ?? [],
    materials: (materials.data as TaxonomyOption[]) ?? [],
    techniques: (techniques.data as TaxonomyOption[]) ?? [],
  };
}

export interface AdminInquiry {
  id: string;
  item_id: string | null;
  type: string;
  status: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  telegram: string | null;
  message_ru: string | null;
  created_at: string;
}

export async function listInquiries(): Promise<AdminInquiry[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select(
      "id, item_id, type, status, customer_name, phone, email, telegram, message_ru, created_at",
    )
    .order("created_at", { ascending: false });
  return (data as AdminInquiry[]) ?? [];
}

export async function getDashboardCounts(): Promise<{
  byStatus: Record<string, number>;
  newInquiries: number;
}> {
  if (!isSupabaseConfigured) return { byStatus: {}, newInquiries: 0 };
  const supabase = await createClient();
  const [items, inquiries] = await Promise.all([
    supabase.from("items").select("status"),
    supabase.from("inquiries").select("id").eq("status", "new"),
  ]);
  const byStatus: Record<string, number> = {};
  for (const r of (items.data as { status: string }[]) ?? []) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  }
  return { byStatus, newInquiries: (inquiries.data ?? []).length };
}
