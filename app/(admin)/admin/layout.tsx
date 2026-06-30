import Link from "next/link";
import { requireAdmin, getAdminUser } from "@/lib/supabase/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { signOut } from "./actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const admin = await getAdminUser();

  return (
    <div className="flex min-h-screen flex-col bg-stone-100 md:flex-row">
      {/* Mobile top bar */}
      <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-3 md:hidden">
        <Link href="/admin" className="font-semibold">
          RELIQUA
        </Link>
        <div className="ml-auto">
          <AdminNav orientation="top" />
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-stone-200 bg-white p-4 md:flex">
        <Link href="/admin" className="text-lg font-semibold">
          RELIQUA · админ
        </Link>
        <AdminNav orientation="side" />
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

      <main className="flex-1 overflow-x-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
