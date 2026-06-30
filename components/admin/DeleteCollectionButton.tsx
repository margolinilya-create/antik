"use client";

import { useState } from "react";
import { deleteCollection } from "@/app/(admin)/admin/actions";

export function DeleteCollectionButton({ id, slug }: { id: string; slug: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm text-red-600 hover:bg-red-100"
      >
        Удалить подборку
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-red-700">Точно удалить?</span>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          await deleteCollection(id, slug);
        }}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "Удаление…" : "Да, удалить"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-sm text-stone-500 hover:text-stone-900"
      >
        Отмена
      </button>
    </div>
  );
}
