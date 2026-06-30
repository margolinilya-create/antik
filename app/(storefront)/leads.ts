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
    customer_name: z.string().trim().min(2, "Укажите имя").max(120),
    phone: z.string().trim().max(40).optional(),
    email: z
      .string()
      .email("Некорректный email")
      .max(254)
      .optional()
      .or(z.literal("")),
    telegram: z.string().trim().max(80).optional(),
    message_ru: z.string().max(3000).optional(),
  })
  .refine((d) => d.phone || d.email || d.telegram, {
    message: "Укажите хотя бы один контакт",
    path: ["phone"],
  });

function notConfigured(): LeadState {
  return { error: "Сервер не настроен. Подключите Supabase." };
}

/** 152-ФЗ: a lead is only accepted with explicit personal-data consent. */
function hasConsent(formData: FormData): boolean {
  const v = formData.get("consent");
  return v === "1" || v === "on" || v === "true";
}
const CONSENT_ERROR = "Подтвердите согласие на обработку персональных данных";

/**
 * Parse a Russian-formatted money string into a number.
 * Handles spaces / NBSP / ₽ as noise, "1 000,50" (comma decimal),
 * and "1.000.000" (dot thousands). Returns NaN if unparseable.
 */
function parseRubAmount(raw: string): number {
  let s = raw.replace(/[^\d.,]/g, ""); // keep digits + separators only
  if (s.includes(",") && s.includes(".")) {
    // Mixed separators: the last one is the decimal point.
    s =
      s.lastIndexOf(",") > s.lastIndexOf(".")
        ? s.replace(/\./g, "").replace(",", ".")
        : s.replace(/,/g, "");
  } else if (s.includes(",")) {
    const parts = s.split(",");
    // One comma + ≤2 trailing digits = decimal; otherwise thousands grouping.
    s =
      parts.length === 2 && parts[1].length <= 2
        ? parts.join(".")
        : parts.join("");
  } else if ((s.match(/\./g)?.length ?? 0) > 1) {
    s = s.replace(/\./g, ""); // multiple dots = thousands grouping
  }
  return Number(s);
}

/** Newsletter / new-arrivals subscription. */
export async function subscribeNewsletter(
  _prev: LeadState,
  formData: FormData,
): Promise<LeadState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!z.string().email().max(254).safeParse(email).success) {
    return { error: "Введите корректный email" };
  }
  if (!hasConsent(formData)) return { error: CONSENT_ERROR };
  if (!isSupabaseConfigured) return notConfigured();
  const supabase = await createClient();
  const { error } = await supabase
    .from("subscribers")
    .insert({ email, source: String(formData.get("source") ?? "site") });
  // Unique-violation (Postgres 23505) = already subscribed → treat as success.
  const isDuplicate =
    error?.code === "23505" || /duplicate|unique/i.test(error?.message ?? "");
  if (error && !isDuplicate) {
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
  if (!hasConsent(formData)) return { error: CONSENT_ERROR };

  const amount = parseRubAmount(String(formData.get("offer_amount") ?? ""));
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
  if (!hasConsent(formData)) return { error: CONSENT_ERROR };
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
