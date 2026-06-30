import Link from "next/link";
import Image from "next/image";
import { Sparkles, Landmark, KeyRound } from "lucide-react";
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

const MARKERS = [
  { Icon: Sparkles, title: "Кураторский отбор" },
  { Icon: Landmark, title: "Европейское наследие" },
  { Icon: KeyRound, title: "Предметы с историей" },
];

export default async function HomePage() {
  const [{ items }, testimonials, posts] = await Promise.all([
    searchItems({ limit: 8, sort: "newest" }),
    listTestimonials(3),
    listJournalPosts(3),
  ]);

  return (
    <div className="space-y-24">
      {/* Hero — full-bleed photograph (breaks out of the 1280px container) */}
      <section className="relative -mt-10 ml-[calc(50%-50vw)] flex h-[80vh] min-h-[520px] w-screen items-center justify-center overflow-hidden md:-mt-14">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />
        <div className="relative z-10 mx-auto max-w-2xl px-5 text-center text-[#f6f2ea]">
          <p className="text-[0.6rem] uppercase tracking-[0.34em] text-[#e7dcc6]">
            Антикварная галерея · с 1999
          </p>
          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-wide sm:text-6xl">
            Предметы с историей
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#ece4d4] sm:text-base">
            Курируемое собрание антиквариата — каждый предмет уникален,
            атрибутирован и представлен в единственном экземпляре.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/catalog"
              className="border border-[#f6f2ea]/55 px-9 py-3.5 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[#f6f2ea] transition-colors hover:bg-[#f6f2ea] hover:text-ink"
            >
              Смотреть коллекцию
            </Link>
          </div>
        </div>
      </section>

      {/* Intro — gallery statement + line-icon trust markers */}
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            RELIQUA — галерея и источник исключительного антиквариата и предметов
            с историей, отобранных за красоту, мастерство и непреходящую ценность.
          </p>
          <Link
            href="/about"
            className="link-underline mt-6 inline-block pb-1 text-xs font-medium uppercase tracking-[0.2em] text-ink"
          >
            О RELIQUA
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {MARKERS.map(({ Icon, title }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <Icon className="size-7 text-ink" strokeWidth={1} aria-hidden />
              <p className="mt-4 text-[0.62rem] uppercase leading-relaxed tracking-[0.18em] text-muted">
                {title}
              </p>
            </div>
          ))}
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
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">
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
              <h2 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">
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
            <h2 className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
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
