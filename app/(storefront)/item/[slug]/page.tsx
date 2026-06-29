import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getItemBySlug, getPublishedSlugs } from "@/lib/queries/items";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Gallery } from "@/components/item/Gallery";
import { ReserveButton } from "@/components/item/ReserveButton";
import { buildProductJsonLd } from "@/lib/seo/jsonld";
import {
  formatPrice,
  formatDimensions,
  conditionLabel,
  statusLabel,
} from "@/lib/format";

// Pre-render published items + ISR; on-demand revalidate on DB change.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "Предмет не найден" };

  const title = item.seo_title ?? item.title_ru;
  const description =
    item.seo_description ??
    item.subtitle_ru ??
    item.description_ru?.slice(0, 160) ??
    "Антикварный предмет в наличии.";

  return {
    title,
    description,
    alternates: { canonical: `/item/${item.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/item/${item.slug}`,
    },
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  const dimensions = formatDimensions(item);
  const specs: { label: string; value: React.ReactNode }[] = [
    item.maker && {
      label: "Мастер / автор",
      value: <Link href={`/catalog?maker=${item.maker.slug}`} className="hover:underline">{item.maker.name_ru}</Link>,
    },
    item.era && {
      label: "Эпоха",
      value: <Link href={`/catalog?era=${item.era.slug}`} className="hover:underline">{item.era.name_ru}</Link>,
    },
    item.year_made_text && { label: "Год создания", value: item.year_made_text },
    item.materials.length > 0 && {
      label: "Материал",
      value: item.materials.map((m) => m.name_ru).join(", "),
    },
    item.techniques.length > 0 && {
      label: "Техника",
      value: item.techniques.map((t) => t.name_ru).join(", "),
    },
    item.condition && { label: "Состояние", value: conditionLabel[item.condition] },
    dimensions && { label: "Размеры", value: dimensions },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <article className="space-y-6">
      <JsonLd data={buildProductJsonLd(item)} />
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          ...(item.category
            ? [{ name: item.category.name_ru, url: `/category/${item.category.slug}` }]
            : []),
          { name: item.title_ru, url: `/item/${item.slug}` },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <Gallery images={item.images} title={item.title_ru} />

        <div className="space-y-5">
          <div>
            <h1 className="text-2xl font-semibold">{item.title_ru}</h1>
            {item.subtitle_ru && (
              <p className="mt-1 text-stone-500">{item.subtitle_ru}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(item.price, item.currency, item.price_on_request)}
            </span>
            {item.status !== "in_stock" && (
              <span className="rounded bg-stone-100 px-2 py-1 text-xs text-stone-600">
                {statusLabel[item.status]}
              </span>
            )}
          </div>

          <ReserveButton slug={item.slug} status={item.status} />

          {specs.length > 0 && (
            <dl className="divide-y divide-stone-200 rounded-lg border border-stone-200 bg-white text-sm">
              {specs.map((s, i) => (
                <div key={i} className="flex justify-between gap-4 px-4 py-2.5">
                  <dt className="text-stone-500">{s.label}</dt>
                  <dd className="text-right text-stone-900">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {item.description_ru && (
        <section className="max-w-3xl">
          <h2 className="mb-2 text-lg font-semibold">Описание</h2>
          <p className="whitespace-pre-line leading-relaxed text-stone-700">
            {item.description_ru}
          </p>
        </section>
      )}

      {item.provenance_ru && (
        <section className="max-w-3xl">
          <h2 className="mb-2 text-lg font-semibold">Провенанс</h2>
          <p className="leading-relaxed text-stone-700">{item.provenance_ru}</p>
        </section>
      )}
    </article>
  );
}
