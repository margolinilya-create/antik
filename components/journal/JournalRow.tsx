import Link from "next/link";
import { JournalCover } from "./JournalCover";
import { journalTheme } from "@/lib/journal-art";
import type { JournalPost } from "@/lib/queries/content";

function formatDate(value: string | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
  });
}

/**
 * Editorial article row: full-bleed photo (kept whole — object-contain) on one
 * side, text on the other; image side alternates by row index. The photo sits
 * on the page background, so contain-margins are invisible (no letterbox bands).
 */
export function JournalRow({
  post,
  index = 0,
  priority = false,
}: {
  post: JournalPost;
  index?: number;
  priority?: boolean;
}) {
  const theme = journalTheme(post);
  const date = formatDate(post.published_at);
  const imageRight = index % 2 === 1;

  return (
    <article className="grid items-center gap-7 border-t border-line py-10 first:border-t-0 md:grid-cols-2 md:gap-12 md:py-14">
      <Link
        href={`/journal/${post.slug}`}
        aria-label={post.title_ru}
        className={`group block ${imageRight ? "md:order-2" : ""}`}
      >
        <JournalCover
          post={post}
          priority={priority}
          sizes="(min-width: 768px) 46vw, 100vw"
          className="h-64 w-full sm:h-80 lg:h-[26rem]"
        />
      </Link>

      <div className={imageRight ? "md:order-1" : ""}>
        <p className="eyebrow text-accent">{theme.label}</p>
        <h2 className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight sm:text-3xl">
          <Link
            href={`/journal/${post.slug}`}
            className="transition-colors hover:text-accent"
          >
            {post.title_ru}
          </Link>
        </h2>
        {post.excerpt_ru && (
          <p className="mt-4 leading-relaxed text-muted">{post.excerpt_ru}</p>
        )}
        <div className="mt-6 flex items-center gap-4">
          <Link
            href={`/journal/${post.slug}`}
            className="text-[0.72rem] uppercase tracking-[0.18em] text-accent link-underline pb-0.5"
          >
            Читать →
          </Link>
          {date && (
            <span className="text-[0.66rem] uppercase tracking-[0.14em] text-faint">
              {date}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
