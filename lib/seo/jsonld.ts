import { env } from "@/lib/env";
import { imageUrl } from "@/lib/supabase/storage";
import type { ItemDetail, ItemStatus } from "@/types/database";

const SITE_NAME = "Антик — антикварный магазин";

/** Map our status to a schema.org availability URL. */
function availability(status: ItemStatus): string {
  switch (status) {
    case "in_stock":
      return "https://schema.org/InStock";
    case "reserved":
      // A unique antique on hold is unavailable for purchase, not a pre-order.
      return "https://schema.org/OutOfStock";
    case "sold":
      return "https://schema.org/SoldOut";
    default:
      return "https://schema.org/OutOfStock";
  }
}

/** Product + Offer JSON-LD for a unique antique item. */
export function buildProductJsonLd(item: ItemDetail) {
  const url = `${env.siteUrl}/item/${item.slug}`;
  const hasPrice = !item.price_on_request && item.price != null;

  // Google requires `price` (or priceSpecification) on an Offer. For
  // "цена по запросу" items we omit the Offer entirely rather than emit an
  // invalid price-less Offer — the Product stays valid, just without a price.
  const offers = hasPrice
    ? {
        "@type": "Offer",
        url,
        price: item.price,
        priceCurrency: item.currency,
        availability: availability(item.status),
        itemCondition:
          item.condition === "restored"
            ? "https://schema.org/RefurbishedCondition"
            : "https://schema.org/UsedCondition",
      }
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title_ru,
    description: item.seo_description ?? item.subtitle_ru ?? item.description_ru ?? "",
    image: item.images.map((img) => imageUrl(img.storage_path, { width: 1200 })),
    sku: item.id,
    category: item.category?.name_ru,
    material: item.materials.map((m) => m.name_ru).join(", ") || undefined,
    ...(item.maker
      ? { brand: { "@type": "Brand", name: item.maker.name_ru } }
      : {}),
    ...(item.year_made_text ? { releaseDate: item.year_made_text } : {}),
    ...(offers ? { offers } : {}),
  };
}

export function buildBreadcrumbJsonLd(
  crumbs: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${env.siteUrl}${c.url}`,
    })),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE_NAME,
    url: env.siteUrl,
  };
}
