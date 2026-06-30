import Image from "next/image";
import { imageUrl } from "@/lib/supabase/storage";
import { coverFor } from "@/lib/journal-covers";
import { journalTheme } from "@/lib/journal-art";

interface CoverPost {
  slug: string;
  title_ru: string;
  cover_path: string | null;
}

/**
 * Article cover photo. Resolution order:
 *   1. real uploaded photo (`cover_path`, Supabase) — future-proof override
 *   2. curated editorial photo (`public/journal/<slug>.jpg`)
 *   3. quiet tinted fallback with just the rubric label (no letters/art)
 */
export function JournalCover({
  post,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: {
  post: CoverPost;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = post.cover_path
    ? imageUrl(post.cover_path, { width: 1200 })
    : coverFor(post.slug)?.src ?? null;

  if (src) {
    return (
      <div className={`relative overflow-hidden bg-surface ${className}`}>
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          // Contain (never crop): the full object stays visible on a calm mat.
          className="object-contain"
        />
      </div>
    );
  }

  // Fallback: no image available — a calm tinted panel with the rubric only.
  const theme = journalTheme(post);
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: theme.ground }}
      aria-hidden
    >
      <span
        className="text-[0.7rem] font-medium uppercase tracking-[0.24em]"
        style={{ color: theme.ink }}
      >
        {theme.label}
      </span>
    </div>
  );
}
