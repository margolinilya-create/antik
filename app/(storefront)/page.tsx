import Link from "next/link";
import { searchItems } from "@/lib/queries/items";
import { ItemCard } from "@/components/catalog/ItemCard";

export const revalidate = 3600;

const CATEGORIES = [
  { slug: "zhivopis", name: "Живопись" },
  { slug: "ikony", name: "Иконы" },
  { slug: "farfor", name: "Фарфор" },
  { slug: "mebel", name: "Мебель" },
  { slug: "samovary", name: "Самовары" },
  { slug: "monety", name: "Монеты" },
];

export default async function HomePage() {
  const { items } = await searchItems({ limit: 8, sort: "newest" });

  return (
    <div className="space-y-24">
      {/* Hero — austere, oversized, image-light */}
      <section className="pt-10 md:pt-20">
        <p className="eyebrow text-accent">Антикварная галерея · с 1999</p>
        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Предметы с историей —{" "}
          <span className="text-muted">отобранные с экспертизой</span>
        </h1>
        <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-3 bg-accent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-onaccent transition-colors hover:bg-accent-soft"
          >
            Смотреть коллекцию
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Курируемое собрание антиквариата. Каждый предмет уникален,
            атрибутирован и представлен в единственном экземпляре.
          </p>
        </div>
      </section>

      {/* Category navigation — editorial row */}
      <section>
        <div className="mb-8 flex items-center gap-6">
          <p className="eyebrow">Разделы коллекции</p>
          <div className="gold-rule flex-1" />
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/catalog?category=${c.slug}`}
              className="group bg-bg px-5 py-10 text-center transition-colors hover:bg-surface"
            >
              <span className="text-sm font-medium uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-accent">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest arrivals */}
      <section>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow text-accent">В наличии</p>
            <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
              Новые поступления
            </h2>
          </div>
          <Link
            href="/catalog"
            className="link-underline pb-1 text-xs font-medium uppercase tracking-[0.18em] text-muted hover:text-ink"
          >
            Весь каталог →
          </Link>
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((item, i) => (
              <ItemCard key={item.id} item={item} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
            Каталог пока пуст.
          </p>
        )}
      </section>
    </div>
  );
}
