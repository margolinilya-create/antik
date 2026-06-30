import type { Metadata } from "next";
import Link from "next/link";
import { searchItems, type SearchFilters } from "@/lib/queries/items";
import { ItemCard } from "@/components/catalog/ItemCard";
import { FacetSidebar } from "@/components/catalog/FacetSidebar";
import { SortSelect } from "@/components/catalog/SortSelect";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildItemListJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Каталог антиквариата",
  description:
    "Каталог антикварных предметов в наличии: фильтры по эпохе, материалу, мастеру и цене. Каждый предмет уникален.",
  alternates: { canonical: "/catalog" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const PAGE_SIZE = 24;

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(str(sp.page)) || 1);

  const filters: SearchFilters = {
    q: str(sp.q),
    category: str(sp.category),
    era: str(sp.era),
    maker: str(sp.maker),
    material: str(sp.material),
    condition: str(sp.condition),
    price_min: str(sp.price_min) ? Number(str(sp.price_min)) : undefined,
    price_max: str(sp.price_max) ? Number(str(sp.price_max)) : undefined,
    sort: (str(sp.sort) as SearchFilters["sort"]) ?? "newest",
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  };

  const { items, total, facets } = await searchItems(filters);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Flatten searchParams for the sidebar link builder.
  const flatParams: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(sp)) flatParams[k] = str(v);

  return (
    <div className="space-y-5">
      {items.length > 0 && <JsonLd data={buildItemListJsonLd(items)} />}
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
        ]}
      />
      <div className="flex items-baseline justify-between border-b border-line pb-4">
        <h1 className="font-display text-3xl font-medium tracking-tight">Каталог</h1>
        <span className="eyebrow">{total} предметов</span>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <FacetSidebar facets={facets} params={flatParams} />

        <div className="flex-1">
          {items.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-end">
                <SortSelect current={filters.sort ?? "newest"} params={flatParams} />
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
                {items.map((item, i) => (
                  <ItemCard key={item.id} item={item} priority={i < 4} />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} params={flatParams} />
              )}
            </>
          ) : (
            <div className="border border-dashed border-line bg-surface px-4 py-16 text-center">
              <p className="text-sm text-muted">По вашему запросу ничего не найдено.</p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs uppercase tracking-[0.16em]">
                <Link href="/catalog" className="link-underline pb-0.5 text-ink">
                  Сбросить фильтры
                </Link>
                <Link href="/sell" className="link-underline pb-0.5 text-accent">
                  Не нашли нужное? Закажите подбор →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  const href = (p: number) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== "page") next.set(k, v);
    if (p > 1) next.set("page", String(p));
    const qs = next.toString();
    return qs ? `/catalog?${qs}` : "/catalog";
  };
  return (
    <nav className="mt-8 flex items-center justify-center gap-2 text-sm">
      {page > 1 && (
        <a href={href(page - 1)} className="border border-line px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-ink">
          ← Назад
        </a>
      )}
      <span className="px-2 text-faint">
        Страница {page} из {totalPages}
      </span>
      {page < totalPages && (
        <a href={href(page + 1)} className="border border-line px-4 py-2 text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-ink">
          Вперёд →
        </a>
      )}
    </nav>
  );
}
