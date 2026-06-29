"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/types/database";

export interface CartItem {
  slug: string;
  title: string;
  price: number | null;
  currency: Currency;
  price_on_request: boolean;
  image?: string | null;
}

interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) =>
          s.items.some((i) => i.slug === item.slug)
            ? s
            : { items: [...s.items, item] },
        ),
      remove: (slug) =>
        set((s) => ({ items: s.items.filter((i) => i.slug !== slug) })),
      clear: () => set({ items: [] }),
      has: (slug) => get().items.some((i) => i.slug === slug),
    }),
    { name: "antik-cart" },
  ),
);
