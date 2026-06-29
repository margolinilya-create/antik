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
      className="relative flex items-center text-muted transition-colors hover:text-ink"
    >
      <ShoppingBag className="size-5" aria-hidden />
      {mounted && count > 0 && (
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-onaccent">
          {count}
        </span>
      )}
    </Link>
  );
}
