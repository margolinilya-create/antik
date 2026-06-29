import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/supabase/storage";
import { formatPrice, statusLabel } from "@/lib/format";
import type { ItemListRow } from "@/types/database";

export function ItemCard({ item, priority = false }: { item: ItemListRow; priority?: boolean }) {
  const sold = item.status === "sold";
  return (
    <Link
      href={`/item/${item.slug}`}
      className="group block overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <Image
          src={imageUrl(item.image?.storage_path, { width: 600 })}
          alt={item.image?.alt_ru ?? item.title_ru}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover transition group-hover:scale-[1.02]"
        />
        {item.status !== "in_stock" && (
          <span className="absolute left-2 top-2 rounded bg-stone-900/80 px-2 py-0.5 text-xs text-white">
            {statusLabel[item.status]}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-stone-900">
          {item.title_ru}
        </h3>
        {item.maker && (
          <p className="mt-0.5 text-xs text-stone-500">{item.maker}</p>
        )}
        <p className={`mt-2 text-sm font-semibold ${sold ? "text-stone-400 line-through" : "text-stone-900"}`}>
          {formatPrice(item.price, item.currency, item.price_on_request)}
        </p>
      </div>
    </Link>
  );
}
