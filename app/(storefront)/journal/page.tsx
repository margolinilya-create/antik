import type { Metadata } from "next";
import Link from "next/link";
import {
  listJournalPosts,
  listFeaturedJournalPosts,
} from "@/lib/queries/content";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JournalCard } from "@/components/journal/JournalCard";
import { JournalCover } from "@/components/journal/JournalCover";
import { JournalAvatar } from "@/components/journal/JournalAvatar";
import { journalTheme } from "@/lib/journal-art";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Журнал — гиды коллекционеру",
  description:
    "Журнал об антиквариате: как отличить подлинник, гиды по самоварам, фарфору, клеймам и атрибуции. Знания для коллекционеров.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const [featured, posts] = await Promise.all([
    listFeaturedJournalPosts(3),
    listJournalPosts(24),
  ]);

  const [lead, ...secondary] = featured;
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = posts.filter((p) => !featuredSlugs.has(p.slug));

  return (
    <div className="space-y-16">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Журнал", url: "/journal" },
        ]}
      />

      <header className="max-w-2xl">
        <p className="eyebrow text-accent">Журнал</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Гиды коллекционеру
        </h1>
        <p className="mt-5 leading-relaxed text-muted">
          Как отличить подлинник, на что смотреть при покупке, как читать клейма
          и атрибутировать предметы.
        </p>
      </header>

      {/* Топ журнала — editorial featured selection */}
      {lead && (
        <section>
          <div className="mb-6 flex items-center gap-6">
            <p className="eyebrow text-accent">Топ журнала</p>
            <div className="gold-rule flex-1" />
          </div>
          <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
            {/* Lead article */}
            <Link
              href={`/journal/${lead.slug}`}
              className="group flex flex-col bg-bg transition-colors hover:bg-surface"
            >
              <JournalCover
                post={lead}
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[16/10] w-full"
              />
              <div className="flex flex-1 flex-col p-7">
                <div className="flex items-center gap-2.5">
                  <JournalAvatar post={lead} size={32} />
                  <span className="text-[0.66rem] uppercase tracking-[0.18em] text-accent">
                    {journalTheme(lead).label}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight text-ink transition-colors group-hover:text-accent sm:text-3xl">
                  {lead.title_ru}
                </h2>
                {lead.excerpt_ru && (
                  <p className="mt-3 leading-relaxed text-muted">
                    {lead.excerpt_ru}
                  </p>
                )}
                <span className="mt-auto pt-6 text-[0.72rem] uppercase tracking-[0.16em] text-accent">
                  Читать →
                </span>
              </div>
            </Link>

            {/* Secondary featured — compact rows */}
            <div className="grid bg-line sm:grid-cols-2 lg:grid-cols-1">
              {secondary.map((p) => (
                <Link
                  key={p.slug}
                  href={`/journal/${p.slug}`}
                  className="group flex gap-4 bg-bg p-6 transition-colors hover:bg-surface"
                >
                  <JournalCover
                    post={p}
                    sizes="160px"
                    showLabel={false}
                    className="aspect-square w-24 shrink-0 sm:w-28"
                  />
                  <div className="flex flex-col">
                    <span className="text-[0.62rem] uppercase tracking-[0.18em] text-accent">
                      {journalTheme(p).label}
                    </span>
                    <h3 className="mt-2 text-base font-light leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
                      {p.title_ru}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Все статьи */}
      {rest.length > 0 && (
        <section>
          <div className="mb-6 flex items-center gap-6">
            <p className="eyebrow">Все статьи</p>
            <div className="gold-rule flex-1" />
          </div>
          <div className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <JournalCard key={p.slug} post={p} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      {featured.length === 0 && rest.length === 0 && (
        <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
          Статьи скоро появятся.
        </p>
      )}
    </div>
  );
}
