"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { notifyNewInquiry } from "@/lib/notify";

export interface LeadState {
  ok?: boolean;
  error?: string;
}

const contact = z
  .object({
    customer_name: z.string().trim().min(2, "Укажите имя"),
    phone: z.string().trim().optional(),
    email: z.string().email("Некорректный email").optional().or(z.literal("")),
    telegram: z.string().trim().optional(),
    message_ru: z.string().max(3000).optional(),
  })
  .refine((d) => d.phone || d.email || d.telegram, {
    message: "Укажите хотя бы один контакт",
    path: ["phone"],
  });

function notConfigured(): LeadState {
  return { error: "Сервер не настроен. Подключите Supabase." };
}

/** Newsletter / new-arrivals subscription. */
export async function subscribeNewsletter(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!z.string().email().safeParse(email).success) {
    return { error: "Введите корректный email" };
  }
  if (!isSupabaseConfigured) return notConfigured();
  const supabase = await createClient();
  const { error } = await supabase
    .from("subscribers")
    .insert({ email, source: String(formData.get("source") ?? "site") });
  // Unique-violation = already subscribed → treat as success.
  if (error && !/duplicate|unique/i.test(error.message)) {
    return { error: "Не удалось подписаться. Попробуйте позже." };
  }
  return { ok: true };
}

/** "Сделать предложение" — a price offer on a specific item. */
export async function makeOffer(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const parsed = contact.safeParse({
    customer_name: formData.get("customer_name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    telegram: formData.get("telegram") || undefined,
    message_ru: formData.get("message_ru") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Проверьте поля" };

  const amount = Number(String(formData.get("offer_amount") ?? "").replace(/\s/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Укажите сумму предложения" };
  }
  if (!isSupabaseConfigured) return notConfigured();

  const supabase = await createClient();
  const itemSlug = String(formData.get("item_slug") ?? "") || null;
  let itemId: string | null = null;
  if (itemSlug) {
    const { data } = await supabase.from("items").select("id").eq("slug", itemSlug).single();
    itemId = (data as { id: string } | null)?.id ?? null;
  }

  const { error } = await supabase.from("inquiries").insert({
    item_id: itemId,
    type: "offer",
    customer_name: parsed.data.customer_name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    telegram: parsed.data.telegram,
    message_ru: parsed.data.message_ru,
    offer_amount: amount,
    source: "make_offer",
  });
  if (error) return { error: "Не удалось отправить предложение." };

  await notifyNewInquiry({
    name: parsed.data.customer_name,
    contact: parsed.data.phone ?? parsed.data.email ?? parsed.data.telegram ?? "",
    item: `предложение ${amount.toLocaleString("ru-RU")} ₽ · ${itemSlug ?? ""}`,
  });
  return { ok: true };
}

/** "Продать / оценка" — consignment & valuation request. */
export async function sellRequest(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const parsed = contact.safeParse({
    customer_name: formData.get("customer_name"),
    phone: formData.get("phone") || undefined,
    email: formData.get("email") || undefined,
    telegram: formData.get("telegram") || undefined,
    message_ru: formData.get("message_ru") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Проверьте поля" };
  if (!isSupabaseConfigured) return notConfigured();

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    type: "sell",
    customer_name: parsed.data.customer_name,
    phone: parsed.data.phone,
    email: parsed.data.email,
    telegram: parsed.data.telegram,
    message_ru: parsed.data.message_ru,
    source: "sell",
  });
  if (error) return { error: "Не удалось отправить заявку." };

  await notifyNewInquiry({
    name: parsed.data.customer_name,
    contact: parsed.data.phone ?? parsed.data.email ?? parsed.data.telegram ?? "",
    item: "продать / оценка",
  });
  return { ok: true };
}
