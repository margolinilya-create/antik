import { statusLabel } from "@/lib/format";
import type { ItemStatus } from "@/types/database";

const styles: Record<ItemStatus, string> = {
  draft: "bg-stone-100 text-stone-600",
  in_stock: "bg-green-100 text-green-700",
  reserved: "bg-amber-100 text-amber-700",
  sold: "bg-stone-800 text-white",
  archived: "bg-stone-200 text-stone-500",
};

export function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${styles[status]}`}>
      {statusLabel[status]}
    </span>
  );
}
