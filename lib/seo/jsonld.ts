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
      return "https://schema.org/PreOrder";
    case "sold":
      return "https://schema.org/SoldOut";
    default:
      return "https://schema.org/OutOfStock";
  }
}

/** Product + Offer JSON-LD for a unique antique item. */
export function buildProductJsonLd(item: ItemDetail) {
  const url = `${env.siteUrl}/item/${item.slug}`;
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url,
    priceCurrency: item.currency,
    availability: availability(item.status),
    itemCondition:
      item.condition === "restored"
        ? "https://schema.org/RefurbishedCondition"
        : "https://schema.org/UsedCondition",
  };
  // Omit price entirely when "по запросу" — required props stay valid.
  if (!item.price_on_request && item.price != null) {
    offer.price = item.price;
  }

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
    offers: offer,
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
