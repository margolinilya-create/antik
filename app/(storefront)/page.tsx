import Link from "next/link";
import { searchItems } from "@/lib/queries/items";
import { ItemCard } from "@/components/catalog/ItemCard";

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
    <div className="space-y-16">
      {/* Hero — dark forest "gallery wall" */}
      <section className="relative overflow-hidden rounded-sm bg-forest px-6 py-20 text-center text-cream sm:px-12 sm:py-24">
        <p className="eyebrow !text-brass">Антикварный салонъ · с провенансом</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">
          Антиквариат, проверенный экспертизой и временем
        </h1>
        <div className="brass-rule mx-auto my-6 w-24" />
        <p className="mx-auto max-w-2xl text-cream/70">
          Курируемая коллекция предметов старины. Каждый предмет уникален,
          атрибутирован и представлен в единственном экземпляре.
        </p>
        <Link
          href="/catalog"
          className="mt-8 inline-block rounded-sm bg-accent px-7 py-3 text-sm font-medium uppercase tracking-[0.12em] text-cream transition-colors hover:bg-accent-deep"
        >
          Смотреть каталог
        </Link>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Категории</h2>
          <div className="brass-rule ml-6 hidden flex-1 sm:block" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog?category=${c.slug}`}
              className="group rounded-sm border border-line bg-surface px-4 py-7 text-center transition-all hover:border-brass hover:shadow-[0_2px_20px_-8px_rgba(33,28,22,0.25)]"
            >
              <span className="font-display text-lg text-ink transition-colors group-hover:text-accent">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest arrivals */}
      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Новые поступления</h2>
          <Link
            href="/catalog"
            className="eyebrow transition-colors hover:text-accent"
          >
            Весь каталог →
          </Link>
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, i) => (
              <ItemCard key={item.id} item={item} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="rounded-sm border border-dashed border-line bg-surface px-4 py-12 text-center text-sm text-muted">
            Каталог пока пуст. Подключите Supabase и примените миграции с сидами.
          </p>
        )}
      </section>
    </div>
  );
}
