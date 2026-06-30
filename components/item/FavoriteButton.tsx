"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites/store";
import { useMounted } from "@/lib/hooks/useMounted";
import type { ItemListRow } from "@/types/database";

export function FavoriteButton({
  item,
  variant = "icon",
}: {
  item: ItemListRow;
  variant?: "icon" | "full";
}) {
  const mounted = useMounted();
  const active = useFavorites((s) => s.items.some((i) => i.slug === item.slug));
  const toggle = useFavorites((s) => s.toggle);
  const on = mounted && active;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(item)}
        aria-pressed={on}
        className="flex w-full items-center justify-center gap-2 border border-line px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:border-accent hover:text-ink"
      >
        <Heart className={`size-4 ${on ? "fill-accent text-accent" : ""}`} strokeWidth={1.6} aria-hidden />
        {on ? "В избранном" : "В избранное"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(item);
      }}
      aria-label={on ? "Убрать из избранного" : "В избранное"}
      aria-pressed={on}
      className="absolute right-2 top-2 z-20 flex size-9 items-center justify-center bg-bg/70 backdrop-blur transition-colors hover:bg-bg"
    >
      <Heart
        className={`size-4 ${on ? "fill-accent text-accent" : "text-ink"}`}
        strokeWidth={1.6}
        aria-hidden
      />
    </button>
  );
}
