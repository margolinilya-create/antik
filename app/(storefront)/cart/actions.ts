"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { inquirySchema } from "@/lib/validation/inquiry";
import { notifyNewInquiry } from "@/lib/notify";

export interface CartInquiryState {
  ok?: boolean;
  error?: string;
}

interface SnapshotItem {
  slug: string;
  title: string;
  price: number | null;
}

const MAX_CART = 50;

function parseSlugs(raw: unknown): string[] {
  try {
    const arr = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(arr)) return [];
    return arr
      .map((i) => (i && typeof i.slug === "string" ? i.slug : null))
      .filter((s): s is string => Boolean(s))
      .slice(0, MAX_CART);
  } catch {
    return [];
  }
}

/** Multi-item lead from the cart ("подборка"). */
export async function submitCartInquiry(
  _prev: CartInquiryState,
  formData: FormData,
): Promise<CartInquiryState> {
  const parsed = inquirySchema.safeParse({
    type: "reserve",
    customer_name: formData.get("customer_name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    telegram: formData.get("telegram") || undefined,
    message_ru: formData.get("message_ru") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  // 152-ФЗ personal-data consent is required.
  if (formData.get("consent") !== "1") {
    return { error: "Подтвердите согласие на обработку персональных данных" };
  }

  const slugs = parseSlugs(formData.get("snapshot"));
  if (slugs.length === 0) return { error: "Подборка пуста" };

  if (!isSupabaseConfigured) {
    return { error: "Сервер не настроен. Подключите Supabase." };
  }

  const supabase = await createClient();

  // Re-resolve items from the DB — never trust client-supplied titles/prices.
  // Only publicly-sellable items are accepted (RLS also enforces this).
  const { data: rows } = await supabase
    .from("items")
    .select("slug, title_ru, price, price_on_request, status")
    .in("slug", slugs)
    .in("status", ["in_stock", "reserved"]);

  const snapshot: SnapshotItem[] = ((rows as {
    slug: string;
    title_ru: string;
    price: number | null;
    price_on_request: boolean;
  }[]) ?? []).map((r) => ({
    slug: r.slug,
    title: r.title_ru,
    price: r.price_on_request ? null : r.price,
  }));

  if (snapshot.length === 0) {
    return { error: "Выбранные предметы недоступны." };
  }

  const total = snapshot.reduce((sum, i) => sum + (i.price ?? 0), 0);
  const { error } = await supabase.from("inquiries").insert({
    type: "reserve",
    customer_name: parsed.data.customer_name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    telegram: parsed.data.telegram,
    message_ru: parsed.data.message_ru,
    items_snapshot: snapshot,
    total_estimate: total || null,
    source: "cart",
  });
  if (error) return { error: "Не удалось отправить заявку. Попробуйте позже." };

  await notifyNewInquiry({
    name: parsed.data.customer_name,
    contact: parsed.data.phone ?? parsed.data.email ?? parsed.data.telegram ?? "",
    item: `подборка: ${snapshot.length} предм.`,
  });

  return { ok: true };
}
