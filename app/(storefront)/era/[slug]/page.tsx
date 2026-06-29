import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { searchItems } from "@/lib/queries/items";
import { getTaxonomyTerm, getTaxonomySlugs } from "@/lib/queries/taxonomy";
import { ItemCard } from "@/components/catalog/ItemCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getTaxonomySlugs("eras");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTaxonomyTerm("eras", slug);
  if (!term) return { title: "Эпоха не найдена" };
  return {
    title: term.seo_title ?? `Антиквариат эпохи «${term.name_ru}»`,
    description:
      term.seo_description ??
      `Антикварные предметы эпохи «${term.name_ru}» в наличии. Подбор и продажа с экспертизой.`,
    alternates: { canonical: `/era/${slug}` },
  };
}

export default async function EraPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = await getTaxonomyTerm("eras", slug);
  if (!term) notFound();

  const { items, total } = await searchItems({ era: slug, limit: 48 });

  return (
    <div className="space-y-5">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          { name: term.name_ru, url: `/era/${slug}` },
        ]}
      />
      <div className="flex items-baseline justify-between">
        <h1 className="text-3xl font-light tracking-tight">{term.name_ru}</h1>
        <span className="eyebrow">{total} предметов</span>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, i) => (
            <ItemCard key={item.id} item={item} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
          Для этой эпохи пока нет предметов.
        </p>
      )}
    </div>
  );
}
