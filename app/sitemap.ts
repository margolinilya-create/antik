import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getPublishedSlugs } from "@/lib/queries/items";
import { getTaxonomySlugs } from "@/lib/queries/taxonomy";
import { getBrandSlugs } from "@/lib/queries/makers";
import { getJournalSlugs } from "@/lib/queries/content";
import { getCollectionSlugs } from "@/lib/queries/collections";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl.replace(/\/$/, "");

  const [items, categories, eras, brands, journal, collections] =
    await Promise.all([
      getPublishedSlugs(),
      getTaxonomySlugs("categories"),
      getTaxonomySlugs("eras"),
      getBrandSlugs(),
      getJournalSlugs(),
      getCollectionSlugs(),
    ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/catalog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/brands`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/journal`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/prodano`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/guarantees`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/concierge`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sell`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/politika-konfidencialnosti`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/oferta`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const journalPages: MetadataRoute.Sitemap = journal.map((slug) => ({
    url: `${base}/journal/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const brandPages: MetadataRoute.Sitemap = brands.map((slug) => ({
    url: `${base}/maker/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const itemPages: MetadataRoute.Sitemap = items.map((i) => ({
    url: `${base}/item/${i.slug}`,
    lastModified: new Date(i.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((slug) => ({
    url: `${base}/category/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eraPages: MetadataRoute.Sitemap = eras.map((slug) => ({
    url: `${base}/era/${slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const collectionPages: MetadataRoute.Sitemap = collections.map((slug) => ({
    url: `${base}/collection/${slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...itemPages,
    ...categoryPages,
    ...eraPages,
    ...collectionPages,
    ...brandPages,
    ...journalPages,
  ];
}
