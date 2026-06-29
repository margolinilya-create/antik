"use client";

import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/lib/cart/store";

export function AddToCartButton({ item }: { item: CartItem }) {
  const router = useRouter();
  const inCart = useCart((s) => s.items.some((i) => i.slug === item.slug));
  const add = useCart((s) => s.add);

  if (inCart) {
    return (
      <button
        type="button"
        onClick={() => router.push("/cart")}
        className="w-full rounded-sm border border-accent px-5 py-3 text-sm font-medium uppercase tracking-[0.1em] text-accent transition-colors hover:bg-accent/5"
      >
        В подборке — перейти →
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(item)}
      className="w-full rounded-sm border border-line px-5 py-3 text-sm font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:border-brass hover:text-ink"
    >
      Добавить в подборку
    </button>
  );
}
