"use client";

import { useEffect, useState } from "react";
import { ItemCard } from "@/components/catalog/ItemCard";
import type { ItemListRow } from "@/types/database";

const KEY = "antik-recent";
const MAX = 8;

/** Records the current item to localStorage and renders previously-viewed ones. */
export function RecentlyViewed({ current }: { current: ItemListRow }) {
  const [items, setItems] = useState<ItemListRow[]>([]);

  useEffect(() => {
    let prev: ItemListRow[] = [];
    try {
      prev = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    } catch {
      prev = [];
    }
    // Render the others BEFORE adding the current one (client-only localStorage
    // read on mount — intentionally setState in effect to avoid hydration drift).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(prev.filter((i) => i.slug !== current.slug).slice(0, 4));
    const next = [current, ...prev.filter((i) => i.slug !== current.slug)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    // record once per item view
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.slug]);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-8 flex items-center gap-6">
        <h2 className="text-lg font-light tracking-tight">Вы недавно смотрели</h2>
        <div className="gold-rule flex-1" />
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <ItemCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
