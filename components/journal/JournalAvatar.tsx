import { journalTheme, journalInitial } from "@/lib/journal-art";

/**
 * Small round monogram emblem for an article — themed by topic.
 * Used in lists and the article byline as the article's "avatar".
 */
export function JournalAvatar({
  post,
  size = 40,
  className = "",
}: {
  post: { slug: string; title_ru: string };
  size?: number;
  className?: string;
}) {
  const theme = journalTheme(post);
  const initial = journalInitial(post);
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-display ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: theme.ground,
        color: theme.ink,
        border: `1px solid ${theme.ink}55`,
        fontSize: size * 0.42,
        lineHeight: 1,
      }}
    >
      {initial}
    </span>
  );
}
