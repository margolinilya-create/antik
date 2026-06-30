import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getItemBySlug, getPublishedSlugs } from "@/lib/queries/items";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Gallery } from "@/components/item/Gallery";
import { ReserveButton } from "@/components/item/ReserveButton";
import { AddToCartButton } from "@/components/item/AddToCartButton";
import { MakeOffer } from "@/components/item/MakeOffer";
import { FavoriteButton } from "@/components/item/FavoriteButton";
import { RelatedItems } from "@/components/item/RelatedItems";
import { RecentlyViewed } from "@/components/item/RecentlyViewed";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { imageUrl } from "@/lib/supabase/storage";
import { listRelatedItems } from "@/lib/queries/content";
import { buildProductJsonLd } from "@/lib/seo/jsonld";
import type { ItemListRow } from "@/types/database";
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
      locale: "ru_RU",
      siteName: "RELIQUA",
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

  const related = await listRelatedItems(item.category?.slug ?? null, item.slug, 4);

  // Compact list-row view of this item for favorites / recently-viewed.
  const row: ItemListRow = {
    id: item.id,
    slug: item.slug,
    title_ru: item.title_ru,
    subtitle_ru: item.subtitle_ru,
    price: item.price,
    currency: item.currency,
    price_on_request: item.price_on_request,
    status: item.status,
    category: item.category?.name_ru ?? null,
    era: item.era?.name_ru ?? null,
    maker: item.maker?.name_ru ?? null,
    image: item.images[0]
      ? {
          storage_path: item.images[0].storage_path,
          alt_ru: item.images[0].alt_ru,
          width: item.images[0].width,
          height: item.images[0].height,
          blurhash: item.images[0].blurhash,
        }
      : null,
  };

  const dimensions = formatDimensions(item);
  const specs: { label: string; value: React.ReactNode }[] = [
    item.maker && {
      label: "Мастер / автор",
      value: <Link href={`/maker/${item.maker.slug}`} className="text-accent transition-colors hover:text-accent-soft">{item.maker.name_ru}</Link>,
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
    <article className="space-y-16">
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

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        <Gallery images={item.images} title={item.title_ru} />

        <div className="space-y-6 md:pt-4">
          <div>
            {item.category && <p className="eyebrow mb-3 text-accent">{item.category.name_ru}</p>}
            <h1 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
              {item.title_ru}
            </h1>
            {item.subtitle_ru && (
              <p className="mt-3 text-muted">{item.subtitle_ru}</p>
            )}
            {item.status === "in_stock" && (
              <p className="mt-4 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-accent">
                <span aria-hidden>✦</span> Единственный экземпляр
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 border-y border-line py-5">
            <span className="font-display text-2xl font-medium tracking-wide text-ink">
              {formatPrice(item.price, item.currency, item.price_on_request)}
            </span>
            {item.status === "in_stock" ? (
              <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted">
                <span className="size-1.5 rounded-full bg-green-700" aria-hidden /> В наличии
              </span>
            ) : (
              <span className="border border-line px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-accent">
                {statusLabel[item.status]}
              </span>
            )}
          </div>

          {/* CTA hierarchy: one solid primary, then secondary actions grouped. */}
          <div className="space-y-2.5">
            <ReserveButton slug={item.slug} status={item.status} />
            {item.status !== "sold" ? (
              <>
                <MakeOffer slug={item.slug} />
                <div className="grid grid-cols-2 gap-2.5">
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
                  <FavoriteButton item={row} variant="full" />
                </div>
              </>
            ) : (
              <FavoriteButton item={row} variant="full" />
            )}
          </div>

          <TrustBadges />

          {specs.length > 0 && (
            <dl className="divide-y divide-line border border-line bg-surface text-sm">
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
          <h2 className="mb-3 font-display text-xl font-medium tracking-tight">Описание</h2>
          <div className="gold-rule mb-4 w-16" />
          <p className="whitespace-pre-line leading-relaxed text-ink/80">
            {item.description_ru}
          </p>
        </section>
      )}

      {item.provenance_ru && (
        <section className="max-w-3xl">
          <h2 className="mb-3 font-display text-xl font-medium tracking-tight">Провенанс</h2>
          <div className="gold-rule mb-4 w-16" />
          <p className="leading-relaxed text-ink/80">{item.provenance_ru}</p>
        </section>
      )}

      <RelatedItems items={related} />
      <RecentlyViewed current={row} />
    </article>
  );
}
