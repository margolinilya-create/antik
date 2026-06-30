"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { imageUrl } from "@/lib/supabase/storage";
import {
  addItemImage,
  deleteItemImage,
  setPrimaryImage,
  updateItemImageAlt,
  moveItemImage,
} from "@/app/(admin)/admin/actions";

/** Per-image alt-text field. Saves on blur when changed. */
function AltField({ id, alt }: { id: string; alt: string | null }) {
  const [value, setValue] = useState(alt ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();
  return (
    <input
      value={value}
      disabled={pending}
      onChange={(e) => {
        setValue(e.target.value);
        setSaved(false);
      }}
      onBlur={() => {
        if (value.trim() !== (alt ?? "").trim()) {
          start(async () => {
            await updateItemImageAlt(id, value);
            setSaved(true);
          });
        }
      }}
      placeholder="alt-текст"
      title="Описание изображения (alt) — для SEO и доступности"
      className={`w-full rounded border px-1.5 py-0.5 text-[11px] outline-none focus:border-stone-500 ${
        saved ? "border-green-400" : "border-stone-200"
      }`}
    />
  );
}

interface ExistingImage {
  id: string;
  storage_path: string;
  alt_ru: string | null;
  is_primary: boolean;
}

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export function ImageUploader({
  itemId,
  images,
}: {
  itemId: string;
  images: ExistingImage[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();

    for (const file of files) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `items/${itemId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("item-images")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (upErr) {
        setError("Ошибка загрузки. Проверьте доступ и формат файла.");
        continue;
      }
      const { width, height } = await readDimensions(file);
      const res = await addItemImage({
        item_id: itemId,
        storage_path: path,
        width: width || null,
        height: height || null,
      });
      if (res.error) setError(res.error);
    }

    setBusy(false);
    e.target.value = "";
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {images.map((img, i) => (
          <div key={img.id} className="space-y-1">
            <div className="relative aspect-square overflow-hidden rounded-md border border-stone-200 bg-stone-100">
              <Image
                src={imageUrl(img.storage_path, { width: 300 })}
                alt={img.alt_ru ?? ""}
                fill
                sizes="160px"
                className="object-cover"
              />
              {img.is_primary && (
                <span className="absolute left-1 top-1 rounded bg-stone-900/80 px-1.5 py-0.5 text-[10px] text-white">
                  Обложка
                </span>
              )}
              <div className="absolute right-1 top-1 flex gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={async () => {
                    await moveItemImage(itemId, img.id, "up");
                    router.refresh();
                  }}
                  title="Левее"
                  className="rounded bg-white/85 px-1 text-[11px] leading-5 text-stone-700 hover:bg-white disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  disabled={i === images.length - 1}
                  onClick={async () => {
                    await moveItemImage(itemId, img.id, "down");
                    router.refresh();
                  }}
                  title="Правее"
                  className="rounded bg-white/85 px-1 text-[11px] leading-5 text-stone-700 hover:bg-white disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              {!img.is_primary && (
                <button
                  type="button"
                  onClick={async () => {
                    await setPrimaryImage(itemId, img.id);
                    router.refresh();
                  }}
                  className="text-stone-500 hover:text-stone-900"
                >
                  Обложка
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  await deleteItemImage(img.id);
                  router.refresh();
                }}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                Удалить
              </button>
            </div>
            <AltField id={img.id} alt={img.alt_ru} />
          </div>
        ))}
      </div>

      <label className="inline-block cursor-pointer rounded-md border border-dashed border-stone-400 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50">
        {busy ? "Загрузка…" : "+ Добавить фото"}
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={onFiles}
          className="hidden"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
