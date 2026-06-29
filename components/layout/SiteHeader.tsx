import Link from "next/link";
import { Search } from "lucide-react";

const NAV = [
  { href: "/catalog?category=samovary", label: "Самовары" },
  { href: "/catalog?category=ikony", label: "Иконы" },
  { href: "/catalog?category=farfor", label: "Фарфор" },
  { href: "/catalog?category=zhivopis", label: "Живопись" },
  { href: "/catalog", label: "Весь каталог" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Антик
        </Link>
        <nav className="hidden flex-1 items-center gap-5 text-sm text-stone-600 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-stone-900">
              {n.label}
            </Link>
          ))}
        </nav>
        <form action="/search" className="ml-auto flex items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-stone-400"
              aria-hidden
            />
            <input
              name="q"
              type="search"
              placeholder="Поиск по каталогу…"
              aria-label="Поиск по каталогу"
              className="w-44 rounded-md border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-sm outline-none focus:border-stone-500 sm:w-64"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
