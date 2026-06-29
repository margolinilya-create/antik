import Image from "next/image";
import Link from "next/link";
import { imageUrl } from "@/lib/supabase/storage";
import { formatPrice, statusLabel } from "@/lib/format";
import type { ItemListRow } from "@/types/database";

const badgeStyle: Record<string, string> = {
  reserved: "text-accent",
  sold: "text-faint",
};

export function ItemCard({ item, priority = false }: { item: ItemListRow; priority?: boolean }) {
  const sold = item.status === "sold";
  return (
    <Link href={`/item/${item.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Image
          src={imageUrl(item.image?.storage_path, { width: 700 })}
          alt={item.image?.alt_ru ?? item.title_ru}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        {/* hairline frame appears on hover */}
        <span className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-accent/40" />
        {item.status !== "in_stock" && (
          <span className="absolute left-3 top-3 bg-bg/80 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur">
            {statusLabel[item.status]}
          </span>
        )}
      </div>
      <div className="pt-4">
        {item.category && (
          <p className="text-[0.62rem] uppercase tracking-[0.2em] text-faint">
            {item.category}
          </p>
        )}
        <h3 className="mt-2 line-clamp-2 text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
          {item.title_ru}
        </h3>
        {item.maker && <p className="mt-1 text-sm text-muted">{item.maker}</p>}
        <p
          className={`mt-3 text-sm tracking-wide ${
            sold ? `${badgeStyle.sold} line-through` : "text-ink"
          }`}
        >
          {formatPrice(item.price, item.currency, item.price_on_request)}
        </p>
      </div>
    </Link>
  );
}
