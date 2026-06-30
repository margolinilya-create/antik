import type { Metadata } from "next";
import {
  listJournalPosts,
  listFeaturedJournalPosts,
} from "@/lib/queries/content";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JournalRow } from "@/components/journal/JournalRow";

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

  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const rest = posts.filter((p) => !featuredSlugs.has(p.slug));

  return (
    <div className="space-y-12">
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

      {/* Топ журнала — editorial rows */}
      {featured.length > 0 && (
        <section>
          <div className="mb-2 flex items-center gap-6">
            <p className="eyebrow text-accent">Топ журнала</p>
            <div className="gold-rule flex-1" />
          </div>
          {featured.map((p, i) => (
            <JournalRow key={p.slug} post={p} index={i} priority={i === 0} />
          ))}
        </section>
      )}

      {/* Все статьи */}
      {rest.length > 0 && (
        <section>
          <div className="mb-2 flex items-center gap-6">
            <p className="eyebrow">Все статьи</p>
            <div className="gold-rule flex-1" />
          </div>
          {rest.map((p, i) => (
            <JournalRow key={p.slug} post={p} index={featured.length + i} />
          ))}
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
