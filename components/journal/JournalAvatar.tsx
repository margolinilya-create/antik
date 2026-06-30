import Image from "next/image";
import { imageUrl } from "@/lib/supabase/storage";
import { coverFor } from "@/lib/journal-covers";

/**
 * Small round thumbnail for an article — a circular crop of its cover photo.
 * Renders nothing when no image is available (never a letter monogram).
 */
export function JournalAvatar({
  post,
  size = 40,
  className = "",
}: {
  post: { slug: string; title_ru: string; cover_path?: string | null };
  size?: number;
  className?: string;
}) {
  const src = post.cover_path
    ? imageUrl(post.cover_path, { width: 120 })
    : coverFor(post.slug)?.src ?? null;
  if (!src) return null;

  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full border border-line ${className}`}
      style={{ width: size, height: size }}
    >
      <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
    </span>
  );
}
