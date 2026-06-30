import Link from "next/link";
import { Search } from "lucide-react";
import { CartLink } from "./CartLink";
import { FavoritesLink } from "./FavoritesLink";

const NAV = [
  { href: "/catalog?category=zhivopis", label: "Живопись" },
  { href: "/catalog?category=ikony", label: "Иконы" },
  { href: "/catalog?category=farfor", label: "Фарфор" },
  { href: "/brands", label: "Бренды" },
  { href: "/journal", label: "Журнал" },
  { href: "/catalog", label: "Каталог" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center gap-8 px-5 py-5">
        <Link
          href="/"
          aria-label="Антик — на главную"
          className="shrink-0 text-lg font-semibold uppercase tracking-[0.42em] text-ink transition-colors hover:text-accent"
        >
          Антик
        </Link>
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="link-underline py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-5">
          <form action="/search" className="relative hidden sm:block">
            <Search
              className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-faint"
              aria-hidden
            />
            <input
              name="q"
              type="search"
              placeholder="Поиск"
              aria-label="Поиск по каталогу"
              className="w-28 border-b border-line bg-transparent py-1.5 pl-6 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent focus:w-44"
            />
          </form>
          <FavoritesLink />
          <CartLink />
        </div>
      </div>
    </header>
  );
}
