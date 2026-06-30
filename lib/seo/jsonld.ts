import { env } from "@/lib/env";
import { imageUrl } from "@/lib/supabase/storage";
import { site } from "@/lib/site";
import type { ItemDetail, ItemStatus } from "@/types/database";

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

export function buildBrandJsonLd(maker: {
  slug: string;
  name_ru: string;
  name_en: string | null;
  country: string | null;
  founded: string | null;
  bio_ru: string | null;
  seo_description: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    name: maker.name_ru,
    alternateName: maker.name_en ?? undefined,
    url: `${env.siteUrl}/maker/${maker.slug}`,
    description: maker.seo_description ?? maker.bio_ru ?? undefined,
    foundingDate: maker.founded ?? undefined,
    ...(maker.country ? { areaServed: maker.country } : {}),
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${site.url}/#store`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    image: `${site.url}/opengraph-image`,
    description: site.tagline,
    foundingDate: site.founded,
    telephone: site.phone,
    email: site.email,
    priceRange: "₽₽₽",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: ["ru"],
    },
    sameAs: [site.telegramHref],
  };
}

export function buildFaqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function buildArticleJsonLd(post: {
  slug: string;
  title_ru: string;
  excerpt_ru: string | null;
  seo_description: string | null;
  cover_path?: string | null;
  published_at: string | null;
  updated_at?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title_ru,
    description: post.seo_description ?? post.excerpt_ru ?? undefined,
    ...(post.cover_path
      ? { image: [imageUrl(post.cover_path, { width: 1200 })] }
      : {}),
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    url: `${site.url}/journal/${post.slug}`,
    author: { "@type": "Organization", name: site.legalName },
    publisher: { "@type": "Organization", name: site.legalName },
  };
}
