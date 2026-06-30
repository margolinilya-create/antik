"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setItemStatus } from "@/app/(admin)/admin/actions";
import type { ItemStatus } from "@/types/database";

const STATUSES: [ItemStatus, string][] = [
  ["draft", "Черновик"],
  ["in_stock", "В наличии"],
  ["reserved", "В резерве"],
  ["sold", "Продано"],
  ["archived", "Архив"],
];

export function ItemStatusQuickSelect({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: ItemStatus;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        start(async () => {
          await setItemStatus(id, slug, e.target.value as ItemStatus);
          router.refresh();
        })
      }
      className="rounded-md border border-stone-300 bg-white px-2 py-1 text-xs outline-none focus:border-stone-500 disabled:opacity-50"
    >
      {STATUSES.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}
