"use client";

import Link from "next/link";
import { useFavorites } from "@/lib/favorites/store";
import { useMounted } from "@/lib/hooks/useMounted";
import { ItemCard } from "@/components/catalog/ItemCard";

export function FavoritesView() {
  const items = useFavorites((s) => s.items);
  const mounted = useMounted();

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <p className="border border-dashed border-line px-4 py-16 text-center text-sm text-muted">
        В избранном пока пусто. Отмечайте понравившиеся предметы значком ♡.{" "}
        <Link href="/catalog" className="text-accent link-underline pb-0.5">
          Перейти в каталог
        </Link>
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
