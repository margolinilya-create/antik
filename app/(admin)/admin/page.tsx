import Link from "next/link";
import { getDashboardCounts } from "@/lib/queries/admin";
import { statusLabel } from "@/lib/format";
import type { ItemStatus } from "@/types/database";

export const dynamic = "force-dynamic";

const STATUSES: ItemStatus[] = ["draft", "in_stock", "reserved", "sold", "archived"];

export default async function AdminDashboard() {
  const { byStatus, newInquiries } = await getDashboardCounts();
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Дашборд</h1>
        <Link
          href="/admin/items/new"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          + Добавить предмет
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card label="Всего предметов" value={total} href="/admin/items" />
        {STATUSES.map((s) => (
          <Card
            key={s}
            label={statusLabel[s]}
            value={byStatus[s] ?? 0}
            href={`/admin/items?status=${s}`}
          />
        ))}
      </div>

      <Link
        href="/admin/inquiries"
        className="block rounded-lg border border-stone-200 bg-white p-4 hover:border-stone-400"
      >
        <p className="text-sm text-stone-500">Новые заявки</p>
        <p className="mt-1 text-3xl font-semibold">{newInquiries}</p>
      </Link>
    </div>
  );
}

function Card({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-stone-400"
    >
      <p className="text-xs text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </Link>
  );
}
