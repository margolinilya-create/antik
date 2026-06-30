import Link from "next/link";
import { listAdminCollections } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const collections = await listAdminCollections();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Подборки</h1>
        <Link
          href="/admin/collections/new"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          + Добавить
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-left text-stone-500">
            <tr>
              <th className="px-4 py-2 font-medium">Подборка</th>
              <th className="px-4 py-2 font-medium">Предметов</th>
              <th className="px-4 py-2 font-medium">Статус</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {collections.map((c) => (
              <tr key={c.id} className="hover:bg-stone-50">
                <td className="px-4 py-2.5">
                  <Link
                    href={`/admin/collections/${c.id}/edit`}
                    className="font-medium hover:underline"
                  >
                    {c.title_ru}
                  </Link>
                  <span className="ml-2 text-xs text-stone-400">/{c.slug}</span>
                  {c.is_featured && (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700">
                      на главной
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-stone-600">{c.item_count}</td>
                <td className="px-4 py-2.5">
                  {c.published_at ? (
                    <span className="text-green-700">Опубликована</span>
                  ) : (
                    <span className="text-stone-400">Черновик</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/admin/collections/${c.id}/edit`}
                    className="text-stone-500 hover:text-stone-900"
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
            {collections.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-stone-500">
                  Пока нет подборок. Создайте первую.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
