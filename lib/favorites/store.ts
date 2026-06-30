"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ItemListRow } from "@/types/database";

interface FavState {
  items: ItemListRow[];
  toggle: (item: ItemListRow) => void;
  remove: (slug: string) => void;
  has: (slug: string) => boolean;
}

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) =>
        set((s) =>
          s.items.some((i) => i.slug === item.slug)
            ? { items: s.items.filter((i) => i.slug !== item.slug) }
            : { items: [item, ...s.items] },
        ),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      has: (slug) => get().items.some((i) => i.slug === slug),
    }),
    { name: "antik-favorites" },
  ),
);
