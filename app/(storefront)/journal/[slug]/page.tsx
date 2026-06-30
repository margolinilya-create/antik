import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJournalPost, getJournalSlugs } from "@/lib/queries/content";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getJournalSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) return { title: "Статья не найдена" };
  return {
    title: post.seo_title ?? post.title_ru,
    description: post.seo_description ?? post.excerpt_ru ?? undefined,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: { title: post.title_ru, description: post.excerpt_ru ?? undefined, type: "article" },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) notFound();

  const paragraphs = (post.body_ru ?? "").split(/\n\n+/).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <JsonLd data={buildArticleJsonLd(post)} />
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Журнал", url: "/journal" },
          { name: post.title_ru, url: `/journal/${slug}` },
        ]}
      />

      <header>
        {post.published_at && (
          <time className="eyebrow">
            {new Date(post.published_at).toLocaleDateString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          {post.title_ru}
        </h1>
        {post.excerpt_ru && (
          <p className="mt-5 text-lg leading-relaxed text-ink/80">
            {post.excerpt_ru}
          </p>
        )}
        <div className="gold-rule mt-8 w-16" />
      </header>

      <div className="space-y-5 text-[1.02rem] leading-[1.85] text-ink/85">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <footer className="border-t border-line pt-8">
        <Link href="/journal" className="text-xs uppercase tracking-[0.16em] text-accent link-underline pb-0.5">
          ← Все статьи
        </Link>
      </footer>
    </article>
  );
}
