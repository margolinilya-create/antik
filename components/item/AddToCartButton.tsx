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
        className="w-full rounded-md border border-stone-900 px-5 py-3 text-sm font-medium text-stone-900 hover:bg-stone-100"
      >
        В подборке — перейти →
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(item)}
      className="w-full rounded-md border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-100"
    >
      Добавить в подборку
    </button>
  );
}
