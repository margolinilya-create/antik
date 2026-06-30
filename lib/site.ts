import { env } from "@/lib/env";

/**
 * Central site / brand constants (NAP — name, address, phone). Used by the
 * footer, contact components and Organization/LocalBusiness JSON-LD.
 * Placeholder contact details — replace with the gallery's real data.
 */
export const site = {
  name: "Антик",
  legalName: "Антикварная галерея «Антик»",
  get url() {
    return env.siteUrl;
  },
  tagline: "Антиквариат с провенансом и экспертизой",
  founded: "1999",
  phone: "+7 (495) 120-00-00",
  phoneHref: "tel:+74951200000",
  email: "info@antik-gallery.ru",
  emailHref: "mailto:info@antik-gallery.ru",
  telegram: "antik_gallery",
  telegramHref: "https://t.me/antik_gallery",
  whatsappHref: "https://wa.me/74951200000",
  address: {
    region: "Москва",
    city: "Москва",
    street: "Кутузовский проспект, 12",
    postalCode: "121248",
    country: "RU",
  },
  hours: "Ежедневно, 11:00–20:00",
} as const;

export const guarantees = [
  {
    title: "Гарантия подлинности",
    text: "Каждый предмет проходит атрибуцию. Экспертное заключение — по запросу.",
  },
  {
    title: "Экспертиза и провенанс",
    text: "Прозрачная история, клейма и состояние описаны честно.",
  },
  {
    title: "Страховка и доставка",
    text: "Музейная упаковка, страхование на всю стоимость, доставка по РФ и миру.",
  },
  {
    title: "Возврат 14 дней",
    text: "Если предмет не соответствует описанию — вернём деньги.",
  },
] as const;
