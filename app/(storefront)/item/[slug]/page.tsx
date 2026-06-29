import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getItemBySlug, getPublishedSlugs } from "@/lib/queries/items";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Gallery } from "@/components/item/Gallery";
import { ReserveButton } from "@/components/item/ReserveButton";
import { AddToCartButton } from "@/components/item/AddToCartButton";
import { imageUrl } from "@/lib/supabase/storage";
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
            {item.category && <p className="eyebrow mb-2">{item.category.name_ru}</p>}
            <h1 className="font-display text-3xl font-semibold leading-tight">
              {item.title_ru}
            </h1>
            {item.subtitle_ru && (
              <p className="mt-2 text-muted">{item.subtitle_ru}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-semibold text-accent">
              {formatPrice(item.price, item.currency, item.price_on_request)}
            </span>
            {item.status !== "in_stock" && (
              <span className="rounded-sm bg-canvas px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted">
                {statusLabel[item.status]}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <ReserveButton slug={item.slug} status={item.status} />
            {item.status !== "sold" && (
              <AddToCartButton
                item={{
                  slug: item.slug,
                  title: item.title_ru,
                  price: item.price,
                  currency: item.currency,
                  price_on_request: item.price_on_request,
                  image: item.images[0]
                    ? imageUrl(item.images[0].storage_path, { width: 200 })
                    : null,
                }}
              />
            )}
          </div>

          {specs.length > 0 && (
            <dl className="divide-y divide-line rounded-sm border border-line bg-surface text-sm">
              {specs.map((s, i) => (
                <div key={i} className="flex justify-between gap-4 px-4 py-3">
                  <dt className="text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                    {s.label}
                  </dt>
                  <dd className="text-right font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {item.description_ru && (
        <section className="max-w-3xl">
          <h2 className="mb-3 font-display text-xl font-semibold">Описание</h2>
          <div className="brass-rule mb-4 w-16" />
          <p className="whitespace-pre-line leading-relaxed text-ink/80">
            {item.description_ru}
          </p>
        </section>
      )}

      {item.provenance_ru && (
        <section className="max-w-3xl">
          <h2 className="mb-3 font-display text-xl font-semibold">Провенанс</h2>
          <div className="brass-rule mb-4 w-16" />
          <p className="leading-relaxed text-ink/80">{item.provenance_ru}</p>
        </section>
      )}
    </article>
  );
}
