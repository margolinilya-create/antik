import Link from "next/link";
import { Search } from "lucide-react";
import { CartLink } from "./CartLink";

const NAV = [
  { href: "/catalog?category=samovary", label: "Самовары" },
  { href: "/catalog?category=ikony", label: "Иконы" },
  { href: "/catalog?category=farfor", label: "Фарфор" },
  { href: "/catalog?category=zhivopis", label: "Живопись" },
  { href: "/catalog", label: "Весь каталог" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-4">
        <Link href="/" className="group shrink-0 leading-none">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">
            Антикъ
          </span>
          <span className="mt-1 block h-px w-full bg-brass transition-all group-hover:bg-accent" />
        </Link>
        <nav className="hidden flex-1 items-center gap-6 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[0.8rem] font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <form action="/search" className="ml-auto flex items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <input
              name="q"
              type="search"
              placeholder="Поиск…"
              aria-label="Поиск по каталогу"
              className="w-36 rounded-sm border border-line bg-canvas/60 py-2 pl-8 pr-3 text-sm outline-none transition-colors focus:border-brass sm:w-56"
            />
          </div>
        </form>
        <CartLink />
      </div>
    </header>
  );
}
