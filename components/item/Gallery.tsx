"use client";

import { useState } from "react";
import Image from "next/image";
import { imageUrl } from "@/lib/supabase/storage";
import type { ItemImage } from "@/types/database";

export function Gallery({ images, title }: { images: ItemImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const cover = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={imageUrl(cover?.storage_path, { width: 1200 })}
          alt={cover?.alt_ru ?? title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 600px"
          // Contain (not crop) so the full artifact + its condition is visible.
          className="object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.storage_path}
              onClick={() => setActive(i)}
              aria-label={`Фото ${i + 1}`}
              className={`relative aspect-square overflow-hidden transition-colors ${
                i === active
                  ? "border-2 border-accent"
                  : "border border-line hover:border-muted"
              }`}
            >
              <Image
                src={imageUrl(img.storage_path, { width: 160 })}
                alt={img.alt_ru ?? `${title} — фото ${i + 1}`}
                fill
                sizes="120px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
