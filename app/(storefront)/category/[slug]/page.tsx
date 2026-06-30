import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { searchItems } from "@/lib/queries/items";
import { getTaxonomyTerm, getTaxonomySlugs } from "@/lib/queries/taxonomy";
import { ItemCard } from "@/components/catalog/ItemCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getTaxonomySlugs("categories");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTaxonomyTerm("categories", slug);
  if (!term) return { title: "Категория не найдена" };
  return {
    title: term.seo_title ?? `${term.name_ru} — купить антиквариат`,
    description:
      term.seo_description ??
      `Антикварные предметы категории «${term.name_ru}» в наличии. Подбор и продажа с провенансом.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = await getTaxonomyTerm("categories", slug);
  if (!term) notFound();

  const { items, total } = await searchItems({ category: slug, limit: 48 });

  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          { name: term.name_ru, url: `/category/${slug}` },
        ]}
      />
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl font-medium tracking-tight">{term.name_ru}</h1>
        <span className="eyebrow">{total} предметов</span>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <ItemCard key={item.id} item={item} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
          В этой категории пока нет предметов.
        </p>
      )}
    </div>
  );
}
