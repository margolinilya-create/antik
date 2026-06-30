import type { Metadata } from "next";
import Link from "next/link";
import { listJournalPosts } from "@/lib/queries/content";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Журнал — гиды коллекционеру",
  description:
    "Журнал об антиквариате: как отличить подлинник, гиды по самоварам, фарфору, клеймам и атрибуции. Знания для коллекционеров.",
  alternates: { canonical: "/journal" },
};

export default async function JournalPage() {
  const posts = await listJournalPosts(24);

  return (
    <div className="space-y-10">
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

      {posts.length > 0 ? (
        <div className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/journal/${p.slug}`}
              className="group flex flex-col bg-bg p-7 transition-colors hover:bg-surface"
            >
              {p.published_at && (
                <time className="text-[0.7rem] uppercase tracking-[0.14em] text-faint">
                  {new Date(p.published_at).toLocaleDateString("ru-RU", {
                    year: "numeric",
                    month: "long",
                  })}
                </time>
              )}
              <h2 className="mt-3 text-xl font-light leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
                {p.title_ru}
              </h2>
              {p.excerpt_ru && (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
                  {p.excerpt_ru}
                </p>
              )}
              <span className="mt-auto pt-6 text-[0.72rem] uppercase tracking-[0.16em] text-accent opacity-0 transition-opacity group-hover:opacity-100">
                Читать →
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
          Статьи скоро появятся.
        </p>
      )}
    </div>
  );
}
