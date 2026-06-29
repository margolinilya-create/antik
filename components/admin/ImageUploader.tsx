"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { imageUrl } from "@/lib/supabase/storage";
import {
  addItemImage,
  deleteItemImage,
  setPrimaryImage,
} from "@/app/(admin)/admin/actions";

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
        {images.map((img) => (
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
                  await deleteItemImage(img.id, img.storage_path);
                  router.refresh();
                }}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                Удалить
              </button>
            </div>
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
