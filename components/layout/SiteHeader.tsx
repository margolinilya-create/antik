"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { site } from "@/lib/site";
import { CartLink } from "./CartLink";
import { FavoritesLink } from "./FavoritesLink";

const NAV_LEFT = [
  { href: "/catalog?category=zhivopis", label: "Живопись" },
  { href: "/catalog?category=ikony", label: "Иконы" },
  { href: "/catalog?category=farfor", label: "Фарфор" },
  { href: "/catalog", label: "Каталог" },
];

const NAV_RIGHT = [
  { href: "/brands", label: "Бренды" },
  { href: "/journal", label: "Журнал" },
  { href: "/about", label: "О нас" },
];

const linkCls =
  "link-underline py-1 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 md:grid-cols-3 md:py-5">
        {/* Left: mobile burger / desktop category nav */}
        <div className="flex items-center md:justify-start">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            className="text-ink md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LEFT.map((n) => (
              <Link key={n.href} href={n.href} className={linkCls}>
                {n.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: wordmark */}
        <Link
          href="/"
          aria-label={`${site.name} — на главную`}
          className="flex flex-col items-center justify-center leading-none"
        >
          <span className="font-display text-xl tracking-[0.32em] text-ink sm:text-2xl">
            {site.name}
          </span>
          <span className="mt-1.5 hidden text-[0.5rem] tracking-[0.34em] text-faint sm:block">
            {site.wordmarkTagline}
          </span>
        </Link>

        {/* Right: desktop nav + utilities */}
        <div className="flex items-center justify-end gap-5 md:gap-6">
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_RIGHT.map((n) => (
              <Link key={n.href} href={n.href} className={linkCls}>
                {n.label}
              </Link>
            ))}
          </nav>
          <form action="/search" className="relative hidden lg:block">
            <Search
              className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-faint"
              aria-hidden
            />
            <input
              name="q"
              type="search"
              placeholder="Поиск"
              aria-label="Поиск по каталогу"
              className="w-24 border-b border-line bg-transparent py-1.5 pl-6 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:w-40 focus:border-accent"
            />
          </form>
          <Link
            href="/search"
            aria-label="Поиск"
            className="text-muted transition-colors hover:text-ink lg:hidden"
          >
            <Search className="size-5" />
          </Link>
          <FavoritesLink />
          <CartLink />
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <nav className="mx-auto flex max-w-[1320px] flex-col px-5 py-4">
            {[...NAV_LEFT, ...NAV_RIGHT].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="border-b border-line/60 py-3 text-sm uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="py-3 text-sm uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              Поиск
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
