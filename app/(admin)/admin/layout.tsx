import Link from "next/link";
import { requireAdmin, getAdminUser } from "@/lib/supabase/auth";
import { signOut } from "./actions";

const NAV = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/items", label: "Предметы" },
  { href: "/admin/inquiries", label: "Заявки" },
  { href: "/admin/taxonomy", label: "Справочники" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const admin = await getAdminUser();

  return (
    <div className="flex min-h-screen bg-stone-100">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-stone-200 bg-white p-4 md:flex">
        <Link href="/admin" className="text-lg font-semibold">
          RELIQUA · админ
        </Link>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-stone-200 pt-4 text-xs text-stone-500">
          <p className="truncate">{admin?.email}</p>
          <p className="mb-2 text-stone-400">Роль: {admin?.role}</p>
          <div className="flex gap-3">
            <Link href="/" className="hover:text-stone-900">
              ← На сайт
            </Link>
            <form action={signOut}>
              <button type="submit" className="hover:text-stone-900">
                Выйти
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto p-6">{children}</main>
    </div>
  );
}
