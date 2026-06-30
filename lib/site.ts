import { env } from "@/lib/env";

/**
 * Central site / brand constants (NAP — name, address, phone). Used by the
 * footer, contact components and Organization/LocalBusiness JSON-LD.
 * Placeholder contact details — replace with the gallery's real data.
 */
export const site = {
  name: "RELIQUA",
  legalName: "Антикварная галерея RELIQUA",
  /** Latin tagline shown under the wordmark (matches the gallery reference). */
  wordmarkTagline: "FINE ANTIQUES & CURATED OBJECTS",
  get url() {
    return env.siteUrl;
  },
  tagline: "Антиквариат с провенансом и экспертизой",
  // Placeholder contact details — replace with the gallery's real data.
  phone: "+7 (495) 120-00-00",
  phoneHref: "tel:+74951200000",
  email: "info@reliqua.gallery",
  emailHref: "mailto:info@reliqua.gallery",
  telegram: "reliqua_gallery",
  telegramHref: "https://t.me/reliqua_gallery",
  whatsappHref: "https://wa.me/74951200000",
  address: {
    region: "Москва",
    city: "Москва",
    street: "Кутузовский проспект, 12",
    postalCode: "121248",
    country: "RU",
  },
  hours: "Ежедневно, 11:00–20:00",
  /**
   * Legal requisites for 152-ФЗ / public offer. PLACEHOLDERS — replace with the
   * gallery's real registration data before going live (verify with a lawyer).
   */
  legal: {
    entity: "ИП Фамилия Имя Отчество",
    inn: "000000000000",
    ogrn: "000000000000000",
    legalAddress: "121248, г. Москва, Кутузовский проспект, 12",
    dataController: "Антикварная галерея RELIQUA",
  },
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
