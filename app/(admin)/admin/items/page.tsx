import Link from "next/link";
import { listAdminItems } from "@/lib/queries/admin";
import { formatPrice, statusLabel } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { Currency, ItemStatus } from "@/types/database";

export const dynamic = "force-dynamic";

const FILTERS: { value: string; label: string }[] = [
  { value: "", label: "Все" },
  { value: "draft", label: "Черновики" },
  { value: "in_stock", label: "В наличии" },
  { value: "reserved", label: "В резерве" },
  { value: "sold", label: "Продано" },
];

export default async function AdminItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const items = await listAdminItems(status);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Предметы</h1>
        <Link
          href="/admin/items/new"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          + Добавить
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {FILTERS.map((f) => {
          const active = (status ?? "") === f.value;
          return (
            <Link
              key={f.value}
              href={f.value ? `/admin/items?status=${f.value}` : "/admin/items"}
              className={`rounded-full border px-3 py-1 ${
                active
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-2 font-medium">Название</th>
              <th className="px-4 py-2 font-medium">Статус</th>
              <th className="px-4 py-2 font-medium">Цена</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5">
                  <Link href={`/admin/items/${it.id}/edit`} className="font-medium hover:underline">
                    {it.title_ru}
                  </Link>
                  <span className="ml-2 text-xs text-stone-400">/{it.slug}</span>
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={it.status as ItemStatus} />
                </td>
                <td className="px-4 py-2.5">
                  {formatPrice(it.price, it.currency as Currency)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/admin/items/${it.id}/edit`}
                    className="text-stone-500 hover:text-stone-900"
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-stone-500">
                  {status
                    ? `Нет предметов со статусом «${statusLabel[status as ItemStatus] ?? status}».`
                    : "Пока нет предметов. Добавьте первый."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
