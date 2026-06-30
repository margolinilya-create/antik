import Image from "next/image";
import { imageUrl } from "@/lib/supabase/storage";
import { journalTheme, journalInitial } from "@/lib/journal-art";

interface CoverPost {
  slug: string;
  title_ru: string;
  cover_path: string | null;
}

/**
 * Article cover. Prefers a real uploaded photo (`cover_path`); otherwise
 * renders a deterministic, on-brand guilloché illustration themed by topic.
 */
export function JournalCover({
  post,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  showLabel = true,
}: {
  post: CoverPost;
  className?: string;
  sizes?: string;
  priority?: boolean;
  showLabel?: boolean;
}) {
  const theme = journalTheme(post);
  const initial = journalInitial(post);

  if (post.cover_path) {
    return (
      <div className={`relative overflow-hidden bg-surface ${className}`}>
        <Image
          src={imageUrl(post.cover_path, { width: 1200 })}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: theme.ground }}
      aria-hidden
    >
      {/* Guilloché: two offset circle families create a soft moiré rosette. */}
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <g stroke={theme.ink} fill="none" opacity="0.14">
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={`a${i}`} cx="600" cy="300" r={26 + i * 34} strokeWidth={1} />
          ))}
        </g>
        <g stroke={theme.ink} fill="none" opacity="0.10">
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={`b${i}`} cx="510" cy="300" r={26 + i * 34} strokeWidth={1} />
          ))}
        </g>
      </svg>

      {/* Thin bronze frame */}
      <div className="absolute inset-3 border" style={{ borderColor: "#80664540" }} />

      {/* Drop-cap initial */}
      <span
        className="absolute bottom-4 right-5 font-display leading-none"
        style={{ color: theme.ink, opacity: 0.9, fontSize: "clamp(3rem, 14vw, 7rem)" }}
      >
        {initial}
      </span>

      {/* Rubric label */}
      {showLabel && (
        <span
          className="absolute left-5 top-5 text-[0.62rem] font-medium uppercase tracking-[0.22em]"
          style={{ color: theme.ink }}
        >
          {theme.label}
        </span>
      )}
    </div>
  );
}
