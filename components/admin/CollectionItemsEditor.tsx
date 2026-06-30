"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { imageUrl } from "@/lib/supabase/storage";
import { setCollectionItems } from "@/app/(admin)/admin/actions";
import { statusLabel } from "@/lib/format";
import type { SelectableItem } from "@/lib/queries/admin";
import type { ItemStatus } from "@/types/database";

export function CollectionItemsEditor({
  collectionId,
  candidates,
  initial,
}: {
  collectionId: string;
  candidates: SelectableItem[];
  initial: string[];
}) {
  const router = useRouter();
  const byId = useMemo(
    () => new Map(candidates.map((c) => [c.id, c])),
    [candidates],
  );
  // Keep only ids that still resolve to a candidate (item could be archived).
  const [selected, setSelected] = useState<string[]>(
    initial.filter((id) => byId.has(id)),
  );
  const [toAdd, setToAdd] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const remaining = candidates.filter((c) => !selected.includes(c.id));

  function move(idx: number, dir: -1 | 1) {
    const next = [...selected];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setSelected(next);
    setSaved(false);
  }

  function save() {
    setError(null);
    start(async () => {
      const res = await setCollectionItems(collectionId, selected);
      if (res.error) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-4">
      {selected.length === 0 ? (
        <p className="text-sm text-stone-400">Предметы не выбраны.</p>
      ) : (
        <ol className="space-y-2">
          {selected.map((id, i) => {
            const it = byId.get(id);
            if (!it) return null;
            return (
              <li
                key={id}
                className="flex items-center gap-3 rounded-md border border-stone-200 bg-white p-2"
              >
                <span className="w-5 shrink-0 text-center text-xs text-stone-400">
                  {i + 1}
                </span>
                <div className="relative size-10 shrink-0 overflow-hidden rounded bg-stone-100">
                  {it.image && (
                    <Image
                      src={imageUrl(it.image, { width: 80 })}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  )}
                </div>
                <span className="min-w-0 flex-1 truncate text-sm">{it.title_ru}</span>
                {it.status !== "in_stock" && (
                  <span className="shrink-0 rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
                    {statusLabel[it.status as ItemStatus]}
                  </span>
                )}
                <div className="flex shrink-0 gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded border border-stone-200 px-1.5 hover:bg-stone-50 disabled:opacity-30"
                    title="Выше"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === selected.length - 1}
                    className="rounded border border-stone-200 px-1.5 hover:bg-stone-50 disabled:opacity-30"
                    title="Ниже"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(selected.filter((s) => s !== id));
                      setSaved(false);
                    }}
                    className="rounded border border-stone-200 px-1.5 text-red-500 hover:bg-red-50"
                    title="Убрать"
                  >
                    ✕
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={toAdd}
          onChange={(e) => setToAdd(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-stone-300 px-2 py-1.5 text-sm outline-none focus:border-stone-500"
        >
          <option value="">+ Добавить предмет…</option>
          {remaining.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title_ru}
              {c.status !== "in_stock" ? ` (${statusLabel[c.status as ItemStatus]})` : ""}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!toAdd}
          onClick={() => {
            if (toAdd && !selected.includes(toAdd)) setSelected([...selected, toAdd]);
            setToAdd("");
            setSaved(false);
          }}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-50 disabled:opacity-40"
        >
          Добавить
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
        >
          {pending ? "Сохранение…" : "Сохранить состав"}
        </button>
        {saved && <span className="text-sm text-green-600">Сохранено.</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </div>
  );
}
