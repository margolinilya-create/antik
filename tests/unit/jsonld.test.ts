import { describe, it, expect } from "vitest";
import {
  buildProductJsonLd,
  buildBrandJsonLd,
  buildBreadcrumbJsonLd,
} from "@/lib/seo/jsonld";
import type { ItemDetail, ItemStatus } from "@/types/database";

function makeItem(over: Partial<ItemDetail> = {}): ItemDetail {
  return {
    id: "id-1",
    slug: "test-item",
    title_ru: "Тестовый предмет",
    subtitle_ru: "подзаголовок",
    description_ru: "описание",
    condition: "excellent",
    condition_note_ru: null,
    provenance_ru: null,
    year_made_text: "около 1890",
    height_mm: null,
    width_mm: null,
    depth_mm: null,
    diameter_mm: null,
    weight_g: null,
    price: 85000,
    currency: "RUB",
    price_on_request: false,
    status: "in_stock",
    seo_title: null,
    seo_description: null,
    updated_at: "2026-01-01T00:00:00Z",
    category: { slug: "samovary", name_ru: "Самовары" },
    era: null,
    maker: { slug: "batashev", name_ru: "Баташёвъ" },
    materials: [{ slug: "latun", name_ru: "Латунь" }],
    techniques: [],
    images: [{ storage_path: "items/x/a.jpg", alt_ru: null, width: 1, height: 1, blurhash: null }],
    ...over,
  } as ItemDetail;
}

describe("buildProductJsonLd", () => {
  it("emits a Product with an Offer when priced", () => {
    const ld = buildProductJsonLd(makeItem()) as Record<string, any>;
    expect(ld["@type"]).toBe("Product");
    expect(ld.name).toBe("Тестовый предмет");
    expect(Array.isArray(ld.image)).toBe(true);
    expect(ld.offers).toBeDefined();
    expect(ld.offers.price).toBe(85000);
    expect(ld.offers.priceCurrency).toBe("RUB");
    expect(ld.offers.availability).toBe("https://schema.org/InStock");
    expect(ld.brand.name).toBe("Баташёвъ");
  });

  it("omits the Offer entirely for price-on-request", () => {
    const ld = buildProductJsonLd(
      makeItem({ price_on_request: true, price: null }),
    ) as Record<string, any>;
    expect(ld["@type"]).toBe("Product");
    expect(ld.offers).toBeUndefined();
  });

  it("maps reserved -> OutOfStock and sold -> SoldOut", () => {
    const av = (status: ItemStatus) =>
      (buildProductJsonLd(makeItem({ status })) as Record<string, any>).offers
        .availability;
    expect(av("reserved")).toBe("https://schema.org/OutOfStock");
    expect(av("sold")).toBe("https://schema.org/SoldOut");
  });

  it("maps restored condition to RefurbishedCondition", () => {
    const ld = buildProductJsonLd(makeItem({ condition: "restored" })) as Record<string, any>;
    expect(ld.offers.itemCondition).toBe("https://schema.org/RefurbishedCondition");
  });
});

describe("buildBrandJsonLd", () => {
  it("emits a Brand with name and founding date", () => {
    const ld = buildBrandJsonLd({
      slug: "faberge",
      name_ru: "Фаберже",
      name_en: "Fabergé",
      country: "Россия",
      founded: "1842",
      bio_ru: "история",
      seo_description: "описание",
    }) as Record<string, any>;
    expect(ld["@type"]).toBe("Brand");
    expect(ld.name).toBe("Фаберже");
    expect(ld.foundingDate).toBe("1842");
    expect(ld.url).toContain("/maker/faberge");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers positions from 1", () => {
    const ld = buildBreadcrumbJsonLd([
      { name: "Главная", url: "/" },
      { name: "Каталог", url: "/catalog" },
    ]) as Record<string, any>;
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].position).toBe(2);
  });
});
