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

/** Standard article card with a themed cover, avatar and rubric. */
export function JournalCard({
  post,
  priority = false,
}: {
  post: JournalPost;
  priority?: boolean;
}) {
  const theme = journalTheme(post);
  const date = formatDate(post.published_at);

  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group flex flex-col bg-bg transition-colors hover:bg-surface"
    >
      <JournalCover
        post={post}
        priority={priority}
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2.5">
          <span className="text-[0.62rem] uppercase tracking-[0.18em] text-accent">
            {theme.label}
          </span>
          {date && (
            <span className="ml-auto text-[0.62rem] uppercase tracking-[0.14em] text-faint">
              {date}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-light leading-snug tracking-tight text-ink transition-colors group-hover:text-accent">
          {post.title_ru}
        </h3>
        {post.excerpt_ru && (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
            {post.excerpt_ru}
          </p>
        )}
      </div>
    </Link>
  );
}
