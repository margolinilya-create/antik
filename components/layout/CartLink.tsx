"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/store";
import { useMounted } from "@/lib/hooks/useMounted";

export function CartLink() {
  const count = useCart((s) => s.items.length);
  const mounted = useMounted();

  return (
    <Link
      href="/cart"
      aria-label="Подборка"
      className="relative flex items-center text-stone-600 hover:text-stone-900"
    >
      <ShoppingBag className="size-5" aria-hidden />
      {mounted && count > 0 && (
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-stone-900 text-[10px] font-medium text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
