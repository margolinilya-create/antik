import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getPublishedSlugs } from "@/lib/queries/items";
import { getTaxonomySlugs } from "@/lib/queries/taxonomy";
import { getBrandSlugs } from "@/lib/queries/makers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl.replace(/\/$/, "");

  const [items, categories, eras, brands] = await Promise.all([
    getPublishedSlugs(),
    getTaxonomySlugs("categories"),
    getTaxonomySlugs("eras"),
    getBrandSlugs(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/catalog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/brands`, changeFrequency: "weekly", priority: 0.8 },
  ];

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

  return [...staticPages, ...itemPages, ...categoryPages, ...eraPages, ...brandPages];
}
