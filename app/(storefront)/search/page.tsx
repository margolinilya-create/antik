import type { Metadata } from "next";
import { searchItems } from "@/lib/queries/items";
import { ItemCard } from "@/components/catalog/ItemCard";

export const metadata: Metadata = {
  title: "Поиск по каталогу",
  robots: { index: false, follow: true },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "";
  const { items, total } = q
    ? await searchItems({ q, sort: "relevance", limit: 48 })
    : { items: [], total: 0 };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-light tracking-tight">
        {q ? `Результаты поиска: «${q}»` : "Поиск"}
      </h1>
      {q && <p className="eyebrow">Найдено: {total}</p>}

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-16 text-center text-sm text-muted">
          {q ? "Ничего не найдено. Попробуйте другой запрос." : "Введите запрос для поиска."}
        </p>
      )}
    </div>
  );
}
