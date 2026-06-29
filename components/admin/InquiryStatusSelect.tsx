"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryStatus } from "@/app/(admin)/admin/actions";

const STATUSES = [
  ["new", "Новая"],
  ["in_progress", "В работе"],
  ["won", "Сделка"],
  ["lost", "Отказ"],
] as const;

export function InquiryStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const value = e.target.value;
        startTransition(async () => {
          await updateInquiryStatus(id, value);
          router.refresh();
        });
      }}
      className="rounded-md border border-stone-300 bg-white px-2 py-1 text-sm outline-none focus:border-stone-500"
    >
      {STATUSES.map(([v, l]) => (
        <option key={v} value={v}>{l}</option>
      ))}
    </select>
  );
}
