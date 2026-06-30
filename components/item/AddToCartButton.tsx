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
        className="w-full border border-ink/25 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-bg"
      >
        В подборке — перейти →
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(item)}
      className="w-full border border-ink/25 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-bg"
    >
      Добавить в подборку
    </button>
  );
}
