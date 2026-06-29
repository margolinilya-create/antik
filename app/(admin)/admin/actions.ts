"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/auth";
import { itemSchema } from "@/lib/validation/item";
import { slugify } from "@/lib/utils";
import type { ItemStatus } from "@/types/database";

export interface ActionState {
  ok?: boolean;
  error?: string;
}

/** Revalidate the public surfaces affected by an item change. */
function revalidatePublic(slug?: string) {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/item/${slug}`);
}

async function ensureAdmin() {
  const admin = await getAdminUser();
  if (!admin) throw new Error("forbidden");
  return admin;
}

/** Create or update an item. Hidden `id` decides which. */
export async function saveItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await ensureAdmin();
  } catch {
    return { error: "Нет доступа" };
  }

  const id = (formData.get("id") as string) || null;
  const parsed = itemSchema.safeParse({
    title_ru: formData.get("title_ru"),
    slug: formData.get("slug"),
    subtitle_ru: formData.get("subtitle_ru"),
    description_ru: formData.get("description_ru"),
    category_id: formData.get("category_id"),
    era_id: formData.get("era_id"),
    maker_id: formData.get("maker_id"),
    condition: formData.get("condition"),
    condition_note_ru: formData.get("condition_note_ru"),
    provenance_ru: formData.get("provenance_ru"),
    year_made_text: formData.get("year_made_text"),
    year_made_from: formData.get("year_made_from"),
    year_made_to: formData.get("year_made_to"),
    height_mm: formData.get("height_mm"),
    width_mm: formData.get("width_mm"),
    depth_mm: formData.get("depth_mm"),
    diameter_mm: formData.get("diameter_mm"),
    weight_g: formData.get("weight_g"),
    price: formData.get("price"),
    currency: formData.get("currency") || "RUB",
    price_on_request: formData.get("price_on_request") === "on",
    status: formData.get("status") || "draft",
    is_featured: formData.get("is_featured") === "on",
    seo_title: formData.get("seo_title"),
    seo_description: formData.get("seo_description"),
    material_ids: formData.getAll("material_ids") as string[],
    technique_ids: formData.getAll("technique_ids") as string[],
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля" };
  }
  const d = parsed.data;
  const supabase = await createClient();

  const slug = d.slug || slugify(d.title_ru);
  const { material_ids, technique_ids, ...itemFields } = d;

  const record: Record<string, unknown> = { ...itemFields, slug };
  // Stamp lifecycle timestamps on transitions.
  if (d.status === "in_stock") record.published_at = new Date().toISOString();
  if (d.status === "sold") record.sold_at = new Date().toISOString();

  let itemId = id;
  if (id) {
    const { error } = await supabase.from("items").update(record).eq("id", id);
    if (error) return { error: slugError(error.message) };
  } else {
    const { data, error } = await supabase
      .from("items")
      .insert(record)
      .select("id")
      .single();
    if (error) return { error: slugError(error.message) };
    itemId = (data as { id: string }).id;
  }

  if (!itemId) return { error: "Не удалось сохранить" };

  // Sync M2M (replace).
  await supabase.from("item_materials").delete().eq("item_id", itemId);
  if (material_ids.length > 0) {
    await supabase
      .from("item_materials")
      .insert(material_ids.map((m) => ({ item_id: itemId, material_id: m })));
  }
  await supabase.from("item_techniques").delete().eq("item_id", itemId);
  if (technique_ids.length > 0) {
    await supabase
      .from("item_techniques")
      .insert(technique_ids.map((t) => ({ item_id: itemId, technique_id: t })));
  }

  revalidatePublic(slug);

  if (!id) redirect(`/admin/items/${itemId}/edit`);
  return { ok: true };
}

function slugError(msg: string): string {
  if (msg.includes("duplicate") || msg.includes("unique")) {
    return "Такой slug уже занят — измените название или укажите свой slug.";
  }
  return "Ошибка сохранения. Проверьте поля.";
}

export async function deleteItem(id: string, slug: string): Promise<void> {
  await ensureAdmin();
  const supabase = await createClient();
  await supabase.from("items").delete().eq("id", id);
  revalidatePublic(slug);
  redirect("/admin/items");
}

export async function setItemStatus(
  id: string,
  slug: string,
  status: ItemStatus,
): Promise<void> {
  await ensureAdmin();
  const supabase = await createClient();
  const patch: Record<string, unknown> = { status };
  if (status === "sold") patch.sold_at = new Date().toISOString();
  if (status === "in_stock") patch.published_at = new Date().toISOString();
  await supabase.from("items").update(patch).eq("id", id);
  revalidatePublic(slug);
  revalidatePath("/admin/items");
}

/** Register an uploaded image (file already in Storage via the browser client). */
export async function addItemImage(input: {
  item_id: string;
  storage_path: string;
  alt_ru?: string | null;
  width?: number | null;
  height?: number | null;
}): Promise<ActionState> {
  try {
    await ensureAdmin();
  } catch {
    return { error: "Нет доступа" };
  }
  const supabase = await createClient();

  // First image becomes primary.
  const { count } = await supabase
    .from("item_images")
    .select("id", { count: "exact", head: true })
    .eq("item_id", input.item_id);

  const { error } = await supabase.from("item_images").insert({
    item_id: input.item_id,
    storage_path: input.storage_path,
    alt_ru: input.alt_ru ?? null,
    width: input.width ?? null,
    height: input.height ?? null,
    sort_order: count ?? 0,
    is_primary: (count ?? 0) === 0,
  });
  if (error) return { error: "Не удалось сохранить изображение" };
  revalidatePath("/admin/items");
  return { ok: true };
}

export async function deleteItemImage(
  id: string,
  storagePath: string,
): Promise<void> {
  await ensureAdmin();
  const supabase = await createClient();
  await supabase.storage.from("item-images").remove([storagePath]);
  await supabase.from("item_images").delete().eq("id", id);
  revalidatePath("/admin/items");
}

export async function setPrimaryImage(
  itemId: string,
  imageId: string,
): Promise<void> {
  await ensureAdmin();
  const supabase = await createClient();
  await supabase
    .from("item_images")
    .update({ is_primary: false })
    .eq("item_id", itemId);
  await supabase.from("item_images").update({ is_primary: true }).eq("id", imageId);
  revalidatePath("/admin/items");
}

export async function updateInquiryStatus(
  id: string,
  status: string,
): Promise<void> {
  await ensureAdmin();
  const supabase = await createClient();
  await supabase.from("inquiries").update({ status }).eq("id", id);
  revalidatePath("/admin/inquiries");
}

export async function createTaxonomyTerm(
  table: "categories" | "eras" | "materials" | "techniques" | "makers",
  values: { name_ru: string; slug?: string },
): Promise<ActionState> {
  try {
    await ensureAdmin();
  } catch {
    return { error: "Нет доступа" };
  }
  const name = values.name_ru.trim();
  if (name.length < 2) return { error: "Укажите название" };
  const supabase = await createClient();
  const { error } = await supabase
    .from(table)
    .insert({ name_ru: name, slug: values.slug || slugify(name) });
  if (error) return { error: "Не удалось создать (возможно, дубль slug)" };
  revalidatePath("/admin/taxonomy");
  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
