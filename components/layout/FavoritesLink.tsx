"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites/store";
import { useMounted } from "@/lib/hooks/useMounted";

export function FavoritesLink() {
  const count = useFavorites((s) => s.items.length);
  const mounted = useMounted();

  return (
    <Link
      href="/favorites"
      aria-label="Избранное"
      className="relative flex items-center text-muted transition-colors hover:text-ink"
    >
      <Heart className="size-5" aria-hidden />
      {mounted && count > 0 && (
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-onaccent">
          {count}
        </span>
      )}
    </Link>
  );
}
