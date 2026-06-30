import Link from "next/link";
import { searchItems } from "@/lib/queries/items";
import { listTestimonials, listJournalPosts } from "@/lib/queries/content";
import { ItemCard } from "@/components/catalog/ItemCard";
import { GuaranteesStrip } from "@/components/marketing/GuaranteesStrip";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Newsletter } from "@/components/marketing/Newsletter";

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
  const [{ items }, testimonials, posts] = await Promise.all([
    searchItems({ limit: 8, sort: "newest" }),
    listTestimonials(3),
    listJournalPosts(3),
  ]);

  return (
    <div className="space-y-24">
      {/* Hero */}
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

      {/* Trust */}
      <GuaranteesStrip />

      {/* Categories */}
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

      {/* Social proof */}
      <Testimonials items={testimonials} />

      {/* Journal teaser */}
      {posts.length > 0 && (
        <section>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow text-accent">Журнал</p>
              <h2 className="mt-2 text-2xl font-light tracking-tight sm:text-3xl">
                Гиды коллекционеру
              </h2>
            </div>
            <Link
              href="/journal"
              className="link-underline pb-1 text-xs font-medium uppercase tracking-[0.18em] text-muted hover:text-ink"
            >
              Все статьи →
            </Link>
          </div>
          <div className="grid gap-px border border-line bg-line md:grid-cols-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/journal/${p.slug}`}
                className="group bg-bg p-7 transition-colors hover:bg-surface"
              >
                <h3 className="text-lg font-light leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
                  {p.title_ru}
                </h3>
                {p.excerpt_ru && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                    {p.excerpt_ru}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="border border-line bg-surface p-8 sm:p-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-light tracking-tight">
              Новые поступления — первыми
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Подпишитесь, и мы сообщим о новых предметах в коллекции раньше
              остальных. Без спама — только стоящее.
            </p>
          </div>
          <Newsletter source="home" />
        </div>
      </section>
    </div>
  );
}
