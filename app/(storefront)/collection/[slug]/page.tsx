import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getCollectionBySlug,
  getCollectionSlugs,
  listCollectionItems,
} from "@/lib/queries/collections";
import { imageUrl } from "@/lib/supabase/storage";
import { ItemCard } from "@/components/catalog/ItemCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Подборка не найдена" };
  return {
    title: collection.seo_title
      ? { absolute: collection.seo_title }
      : `${collection.title_ru} — подборка`,
    description:
      collection.seo_description ??
      collection.subtitle_ru ??
      `Кураторская подборка «${collection.title_ru}» — антиквариат в наличии.`,
    alternates: { canonical: `/collection/${slug}` },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const items = await listCollectionItems(collection.id);

  return (
    <div className="space-y-10">
      {items.length > 0 && <JsonLd data={buildItemListJsonLd(items)} />}
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          { name: collection.title_ru, url: `/collection/${slug}` },
        ]}
      />

      {/* Atmospheric cover — not an item photo, so object-cover is allowed. */}
      {collection.cover_path && (
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-surface">
          <Image
            src={imageUrl(collection.cover_path, { width: 1600 })}
            alt={collection.title_ru}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      )}

      <header className="max-w-3xl">
        <p className="eyebrow text-accent">Подборка</p>
        <h1 className="mt-3 font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          {collection.title_ru}
        </h1>
        {collection.subtitle_ru && (
          <p className="mt-3 text-lg text-muted">{collection.subtitle_ru}</p>
        )}
        {collection.intro_ru && (
          <p className="mt-5 text-sm leading-relaxed text-muted">
            {collection.intro_ru}
          </p>
        )}
      </header>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <ItemCard key={item.id} item={item} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
          В этой подборке пока нет предметов.
        </p>
      )}
    </div>
  );
}
