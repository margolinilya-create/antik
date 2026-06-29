"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { inquirySchema } from "@/lib/validation/inquiry";
import { notifyNewInquiry } from "@/lib/notify";

export interface InquiryState {
  ok?: boolean;
  error?: string;
}

/** Public lead submission. RLS allows anonymous INSERT into `inquiries`. */
export async function submitInquiry(
  _prev: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const parsed = inquirySchema.safeParse({
    item_slug: formData.get("item_slug") || undefined,
    type: formData.get("type") || "reserve",
    customer_name: formData.get("customer_name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    telegram: formData.get("telegram") || undefined,
    message_ru: formData.get("message_ru") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Проверьте поля формы" };
  }

  if (!isSupabaseConfigured) {
    return { error: "Сервер не настроен. Подключите Supabase, чтобы принимать заявки." };
  }

  const supabase = await createClient();

  // Resolve the item id from slug (if any) for the FK.
  let itemId: string | null = null;
  if (parsed.data.item_slug) {
    const { data } = await supabase
      .from("items")
      .select("id")
      .eq("slug", parsed.data.item_slug)
      .single();
    itemId = (data as { id: string } | null)?.id ?? null;
  }

  const { error } = await supabase.from("inquiries").insert({
    item_id: itemId,
    type: parsed.data.type,
    customer_name: parsed.data.customer_name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    telegram: parsed.data.telegram,
    message_ru: parsed.data.message_ru,
    source: "checkout",
  });

  if (error) return { error: "Не удалось отправить заявку. Попробуйте позже." };

  await notifyNewInquiry({
    name: parsed.data.customer_name,
    contact: parsed.data.phone ?? parsed.data.email ?? parsed.data.telegram ?? "",
    item: parsed.data.item_slug,
  });

  return { ok: true };
}
