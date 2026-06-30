"use client";

import { useState, useTransition } from "react";
import { updateInquiryNote } from "@/app/(admin)/admin/actions";

export function InquiryNote({ id, note }: { id: string; note: string | null }) {
  const [value, setValue] = useState(note ?? "");
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="mt-3 border-t border-stone-100 pt-3">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setSaved(false);
        }}
        rows={2}
        placeholder="Внутренняя заметка (видна только в админке)…"
        className="w-full rounded-md border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-sm outline-none focus:border-stone-500"
      />
      <div className="mt-1 flex items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              await updateInquiryNote(id, value);
              setSaved(true);
            })
          }
          className="rounded-md bg-stone-900 px-3 py-1 text-xs text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {pending ? "Сохранение…" : "Сохранить заметку"}
        </button>
        {saved && <span className="text-xs text-green-600">Сохранено</span>}
      </div>
    </div>
  );
}
