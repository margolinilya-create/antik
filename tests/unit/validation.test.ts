import { describe, it, expect } from "vitest";
import { itemSchema } from "@/lib/validation/item";
import { inquirySchema } from "@/lib/validation/inquiry";

describe("itemSchema", () => {
  it("requires a title of at least 2 chars", () => {
    expect(itemSchema.safeParse({ title_ru: "" }).success).toBe(false);
    expect(itemSchema.safeParse({ title_ru: "Самовар" }).success).toBe(true);
  });

  it("coerces empty numeric strings to null", () => {
    const r = itemSchema.parse({ title_ru: "Самовар", height_mm: "", price: "" });
    expect(r.height_mm).toBeNull();
    expect(r.price).toBeNull();
  });

  it("parses numeric strings", () => {
    const r = itemSchema.parse({ title_ru: "Самовар", height_mm: "450", price: "85000.50" });
    expect(r.height_mm).toBe(450);
    expect(r.price).toBe(85000.5);
  });

  it("defaults status to draft and currency to RUB", () => {
    const r = itemSchema.parse({ title_ru: "Самовар" });
    expect(r.status).toBe("draft");
    expect(r.currency).toBe("RUB");
    expect(r.material_ids).toEqual([]);
  });
});

describe("inquirySchema", () => {
  const base = { customer_name: "Иван" };

  it("requires at least one contact channel", () => {
    expect(inquirySchema.safeParse(base).success).toBe(false);
    expect(inquirySchema.safeParse({ ...base, phone: "+70000000000" }).success).toBe(true);
    expect(inquirySchema.safeParse({ ...base, telegram: "@ivan" }).success).toBe(true);
  });

  it("requires a name of at least 2 chars", () => {
    expect(inquirySchema.safeParse({ customer_name: "И", phone: "1" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      inquirySchema.safeParse({ ...base, email: "not-an-email" }).success,
    ).toBe(false);
    expect(
      inquirySchema.safeParse({ ...base, email: "ivan@example.com" }).success,
    ).toBe(true);
  });
});
