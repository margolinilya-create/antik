import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMakerBySlug, getBrandSlugs } from "@/lib/queries/makers";
import { searchItems } from "@/lib/queries/items";
import { ItemCard } from "@/components/catalog/ItemCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBrandJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getBrandSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const maker = await getMakerBySlug(slug);
  if (!maker) return { title: "Бренд не найден" };
  return {
    title: maker.seo_title ?? `${maker.name_ru} — антиквариат`,
    description:
      maker.seo_description ??
      maker.tagline_ru ??
      `Антиквариат бренда «${maker.name_ru}»: история, клейма, предметы в наличии.`,
    alternates: { canonical: `/maker/${slug}` },
  };
}

export default async function MakerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const maker = await getMakerBySlug(slug);
  if (!maker) notFound();

  const { items, total } = await searchItems({ maker: slug, limit: 48 });
  const meta = [maker.country, maker.founded && `Основан: ${maker.founded}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-16">
      <JsonLd data={buildBrandJsonLd(maker)} />
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Бренды", url: "/brands" },
          { name: maker.name_ru, url: `/maker/${slug}` },
        ]}
      />

      {/* Brand hero */}
      <header className="max-w-3xl">
        <p className="eyebrow text-accent">Бренд · мануфактура</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
          {maker.name_ru}
        </h1>
        {meta && (
          <p className="mt-4 text-[0.72rem] uppercase tracking-[0.16em] text-faint">
            {meta}
          </p>
        )}
        {maker.tagline_ru && (
          <p className="mt-6 text-lg font-light leading-relaxed text-muted">
            {maker.tagline_ru}
          </p>
        )}
      </header>

      {/* Brand story */}
      {maker.bio_ru && (
        <section className="max-w-3xl">
          <div className="gold-rule mb-6 w-16" />
          <div className="whitespace-pre-line text-[0.95rem] leading-[1.8] text-ink/85">
            {maker.bio_ru}
          </div>
        </section>
      )}

      {/* Items by this maker */}
      <section>
        <div className="mb-8 flex items-end justify-between border-b border-line pb-4">
          <h2 className="text-2xl font-light tracking-tight">
            Предметы бренда
          </h2>
          <span className="eyebrow">{total} в наличии</span>
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, i) => (
              <ItemCard key={item.id} item={item} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-line px-4 py-12 text-center text-sm text-muted">
            Сейчас предметов этого бренда нет в наличии.{" "}
            <Link href="/catalog" className="text-accent link-underline pb-0.5">
              Смотреть весь каталог
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
