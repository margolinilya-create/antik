"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/items", label: "Предметы" },
  { href: "/admin/collections", label: "Подборки" },
  { href: "/admin/inquiries", label: "Заявки" },
  { href: "/admin/taxonomy", label: "Справочники" },
];

export function AdminNav({ orientation }: { orientation: "side" | "top" }) {
  const path = usePathname();
  return (
    <nav
      className={
        orientation === "side"
          ? "mt-6 flex flex-col gap-1 text-sm"
          : "flex gap-1 overflow-x-auto text-sm"
      }
    >
      {NAV.map((n) => {
        const active =
          n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`whitespace-nowrap rounded-md px-3 py-2 transition-colors ${
              active
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
