import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/supabase/storage";
import type { CollectionSummary } from "@/lib/queries/collections";

/**
 * Homepage «В подборках» card. The cover is an atmospheric/editorial image
 * (not an item photo), so object-cover is allowed here.
 */
export function CollectionCard({ collection }: { collection: CollectionSummary }) {
  return (
    <Link
      href={`/collection/${collection.slug}`}
      className="group relative block overflow-hidden bg-surface"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imageUrl(collection.cover_path, { width: 800 })}
          alt={collection.title_ru}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-[#f6f2ea]">
        <p className="text-[0.6rem] uppercase tracking-[0.24em] text-[#e7dcc6]">
          Подборка
        </p>
        <h3 className="mt-1.5 font-display text-xl font-medium leading-snug">
          {collection.title_ru}
        </h3>
        {collection.subtitle_ru && (
          <p className="mt-1 text-sm text-[#ece4d4]">{collection.subtitle_ru}</p>
        )}
      </div>
    </Link>
  );
}
