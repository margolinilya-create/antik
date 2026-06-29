import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/supabase/storage";
import { formatPrice, statusLabel } from "@/lib/format";
import type { ItemListRow } from "@/types/database";

const badgeStyle: Record<string, string> = {
  reserved: "bg-brass/90 text-cream",
  sold: "bg-forest/90 text-cream",
};

export function ItemCard({ item, priority = false }: { item: ItemListRow; priority?: boolean }) {
  const sold = item.status === "sold";
  return (
    <Link
      href={`/item/${item.slug}`}
      className="group block overflow-hidden rounded-sm border border-line bg-surface transition-all duration-300 hover:border-brass hover:shadow-[0_4px_28px_-10px_rgba(33,28,22,0.3)]"
    >
      <div className="relative aspect-square overflow-hidden bg-canvas">
        <Image
          src={imageUrl(item.image?.storage_path, { width: 600 })}
          alt={item.image?.alt_ru ?? item.title_ru}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {item.status !== "in_stock" && (
          <span
            className={`absolute left-0 top-3 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] ${badgeStyle[item.status] ?? "bg-ink/80 text-cream"}`}
          >
            {statusLabel[item.status]}
          </span>
        )}
      </div>
      <div className="p-4">
        {item.category && <p className="eyebrow mb-1">{item.category}</p>}
        <h3 className="line-clamp-2 font-display text-lg leading-snug text-ink transition-colors group-hover:text-accent">
          {item.title_ru}
        </h3>
        {item.maker && <p className="mt-1 text-sm text-muted">{item.maker}</p>}
        <p
          className={`mt-3 font-display text-base font-semibold ${sold ? "text-muted line-through" : "text-accent"}`}
        >
          {formatPrice(item.price, item.currency, item.price_on_request)}
        </p>
      </div>
    </Link>
  );
}
