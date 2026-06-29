import { z } from "zod";

export const inquirySchema = z
  .object({
    item_slug: z.string().optional(),
    type: z.enum(["reserve", "buy", "question"]).default("reserve"),
    customer_name: z.string().min(2, "Укажите имя"),
    phone: z.string().trim().optional(),
    email: z.string().email("Некорректный email").optional().or(z.literal("")),
    telegram: z.string().trim().optional(),
    message_ru: z.string().max(2000).optional(),
  })
  .refine((d) => d.phone || d.email || d.telegram, {
    message: "Укажите хотя бы один контакт: телефон, email или Telegram",
    path: ["phone"],
  });

export type InquiryInput = z.infer<typeof inquirySchema>;
