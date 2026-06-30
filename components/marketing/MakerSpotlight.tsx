import Link from "next/link";
import type { BrandListItem } from "@/lib/queries/makers";

/**
 * «Имена и мастера» — designer/maker spotlight (à la Puces «Icons of Design»).
 * Editorial authority block: short profile cards linking to the maker page.
 */
export function MakerSpotlight({ makers }: { makers: BrandListItem[] }) {
  if (makers.length === 0) return null;
  return (
    <section>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow text-accent">Имена и мастера</p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Мануфактуры и авторы
          </h2>
        </div>
        <Link
          href="/brands"
          className="link-underline pb-1 text-xs font-medium uppercase tracking-[0.18em] text-muted hover:text-ink"
        >
          Все имена →
        </Link>
      </div>
      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {makers.map((m) => (
          <Link
            key={m.slug}
            href={`/maker/${m.slug}`}
            className="group flex flex-col bg-bg p-7 transition-colors hover:bg-surface"
          >
            <h3 className="font-display text-lg font-medium text-ink transition-colors group-hover:text-accent">
              {m.name_ru}
            </h3>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.14em] text-faint">
              {[m.country, m.founded].filter(Boolean).join(" · ")}
            </p>
            {m.tagline_ru && (
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                {m.tagline_ru}
              </p>
            )}
            <span className="mt-4 text-[0.7rem] uppercase tracking-[0.14em] text-accent">
              {m.item_count > 0 ? `${m.item_count} предметов →` : "Подробнее →"}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
