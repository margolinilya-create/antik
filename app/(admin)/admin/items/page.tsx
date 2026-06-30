import Link from "next/link";
import Image from "next/image";
import { listAdminItems } from "@/lib/queries/admin";
import { imageUrl } from "@/lib/supabase/storage";
import { formatPrice, statusLabel } from "@/lib/format";
import { ItemStatusQuickSelect } from "@/components/admin/ItemStatusQuickSelect";
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
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const items = await listAdminItems(status, q);

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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-sm">
          {FILTERS.map((f) => {
            const active = (status ?? "") === f.value;
            const params = new URLSearchParams();
            if (f.value) params.set("status", f.value);
            if (q) params.set("q", q);
            const qs = params.toString();
            return (
              <Link
                key={f.value}
                href={qs ? `/admin/items?${qs}` : "/admin/items"}
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
        <form className="flex gap-2">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Поиск по названию…"
            className="w-44 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-stone-500"
          />
          <button
            type="submit"
            className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-600 hover:border-stone-400"
          >
            Найти
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-2 font-medium">Предмет</th>
              <th className="px-4 py-2 font-medium">Статус</th>
              <th className="px-4 py-2 font-medium">Цена</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((it) => (
              <tr key={it.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
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
                    <div className="min-w-0">
                      <Link
                        href={`/admin/items/${it.id}/edit`}
                        className="font-medium hover:underline"
                      >
                        {it.title_ru}
                      </Link>
                      <span className="ml-2 text-xs text-stone-400">/{it.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <ItemStatusQuickSelect
                    id={it.id}
                    slug={it.slug}
                    status={it.status as ItemStatus}
                  />
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
                  {q
                    ? `Ничего не найдено по запросу «${q}».`
                    : status
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
