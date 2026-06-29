import Link from "next/link";
import { searchItems } from "@/lib/queries/items";
import { ItemCard } from "@/components/catalog/ItemCard";

// Home is ISR-cached; new items appear via on-demand revalidation.
export const revalidate = 3600;

const CATEGORIES = [
  { slug: "samovary", name: "Самовары" },
  { slug: "ikony", name: "Иконы" },
  { slug: "farfor", name: "Фарфор" },
  { slug: "mebel", name: "Мебель" },
  { slug: "monety", name: "Монеты" },
  { slug: "zhivopis", name: "Живопись" },
];

export default async function HomePage() {
  const { items } = await searchItems({ limit: 8, sort: "newest" });

  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white sm:px-12">
        <h1 className="text-balance text-3xl font-semibold sm:text-4xl">
          Антиквариат с провенансом и экспертизой
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-stone-300">
          Курируемая коллекция предметов старины. Каждый предмет уникален,
          проверен и представлен в единственном экземпляре.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-block rounded-md bg-white px-5 py-2.5 text-sm font-medium text-stone-900 hover:bg-stone-100"
        >
          Смотреть каталог
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Категории</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog?category=${c.slug}`}
              className="rounded-lg border border-stone-200 bg-white px-4 py-6 text-center text-sm font-medium transition hover:border-stone-400 hover:shadow-sm"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Новые поступления</h2>
          <Link href="/catalog" className="text-sm text-stone-500 hover:text-stone-900">
            Весь каталог →
          </Link>
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, i) => (
              <ItemCard key={item.id} item={item} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-stone-300 bg-white px-4 py-10 text-center text-sm text-stone-500">
            Каталог пока пуст. Подключите Supabase и примените миграции с сидами,
            чтобы увидеть предметы.
          </p>
        )}
      </section>
    </div>
  );
}
