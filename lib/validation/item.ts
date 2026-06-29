import { z } from "zod";

const optInt = z
  .union([z.string(), z.number(), z.null()])
  .optional()
  .transform((v) => {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : null;
  });

const optNum = z
  .union([z.string(), z.number(), z.null()])
  .optional()
  .transform((v) => {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  });

const optStr = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    const s = (v ?? "").toString().trim();
    return s === "" ? null : s;
  });

export const itemSchema = z.object({
  title_ru: z.string().trim().min(2, "Укажите название"),
  slug: optStr,
  subtitle_ru: optStr,
  description_ru: optStr,
  category_id: optStr,
  era_id: optStr,
  maker_id: optStr,
  condition: z
    .enum(["mint", "excellent", "good", "fair", "restored", "as_is"])
    .nullish()
    .or(z.literal("").transform(() => null)),
  condition_note_ru: optStr,
  provenance_ru: optStr,
  year_made_text: optStr,
  year_made_from: optInt,
  year_made_to: optInt,
  height_mm: optInt,
  width_mm: optInt,
  depth_mm: optInt,
  diameter_mm: optInt,
  weight_g: optInt,
  price: optNum,
  currency: z.enum(["RUB", "USD", "EUR"]).default("RUB"),
  price_on_request: z.coerce.boolean().default(false),
  status: z
    .enum(["draft", "in_stock", "reserved", "sold", "archived"])
    .default("draft"),
  is_featured: z.coerce.boolean().default(false),
  seo_title: optStr,
  seo_description: optStr,
  material_ids: z.array(z.string()).default([]),
  technique_ids: z.array(z.string()).default([]),
});

export type ItemInput = z.infer<typeof itemSchema>;
