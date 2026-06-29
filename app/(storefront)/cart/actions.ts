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

  let snapshot: SnapshotItem[] = [];
  try {
    snapshot = JSON.parse(String(formData.get("snapshot") ?? "[]"));
  } catch {
    snapshot = [];
  }
  if (snapshot.length === 0) return { error: "Подборка пуста" };

  if (!isSupabaseConfigured) {
    return { error: "Сервер не настроен. Подключите Supabase." };
  }

  const total = snapshot.reduce((sum, i) => sum + (i.price ?? 0), 0);
  const supabase = await createClient();
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
