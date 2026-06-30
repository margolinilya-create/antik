import { z } from "zod";

const optStr = z
  .union([z.string(), z.null()])
  .optional()
  .transform((v) => {
    const s = (v ?? "").toString().trim();
    return s === "" ? null : s;
  });

const optInt = z
  .union([z.string(), z.number(), z.null()])
  .optional()
  .transform((v) => {
    if (v === "" || v == null) return 0;
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : 0;
  });

export const collectionSchema = z.object({
  title_ru: z.string().trim().min(2, "Укажите название"),
  slug: optStr,
  subtitle_ru: optStr,
  intro_ru: optStr,
  seo_title: optStr,
  seo_description: optStr,
  is_featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(false),
  sort_order: optInt,
});

export type CollectionInput = z.infer<typeof collectionSchema>;
