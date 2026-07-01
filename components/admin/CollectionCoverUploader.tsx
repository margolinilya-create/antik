"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { imageUrl } from "@/lib/supabase/storage";
import { setCollectionCover } from "@/app/(admin)/admin/actions";

export function CollectionCoverUploader({
  collectionId,
  coverPath,
}: {
  collectionId: string;
  coverPath: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `collections/${collectionId}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("item-images")
      .upload(path, file, { cacheControl: "31536000", upsert: false });
    if (upErr) {
      setError("Ошибка загрузки. Проверьте доступ и формат файла.");
      setBusy(false);
      return;
    }
    const res = await setCollectionCover(collectionId, path);
    if (res.error) setError(res.error);
    setBusy(false);
    e.target.value = "";
    router.refresh();
  }

  async function remove() {
    setBusy(true);
    await setCollectionCover(collectionId, null);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {coverPath && (
        <div className="relative aspect-[21/9] w-full max-w-md overflow-hidden rounded-md border border-stone-200 bg-stone-100">
          <Image
            src={imageUrl(coverPath, { width: 800 })}
            alt=""
            fill
            sizes="448px"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex items-center gap-3">
        <label className="inline-block cursor-pointer rounded-md border border-dashed border-stone-400 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50">
          {busy ? "Загрузка…" : coverPath ? "Заменить обложку" : "+ Загрузить обложку"}
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={onFile}
            className="hidden"
          />
        </label>
        {coverPath && (
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            Удалить
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
