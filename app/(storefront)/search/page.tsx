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
      <h1 className="text-2xl font-semibold">
        {q ? `Результаты поиска: «${q}»` : "Поиск"}
      </h1>
      {q && <p className="text-sm text-stone-500">Найдено: {total}</p>}

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-stone-300 bg-white px-4 py-16 text-center text-sm text-stone-500">
          {q ? "Ничего не найдено. Попробуйте другой запрос." : "Введите запрос для поиска."}
        </p>
      )}
    </div>
  );
}
