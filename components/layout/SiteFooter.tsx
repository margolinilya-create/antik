import Link from "next/link";

const COLS = [
  {
    title: "Категории",
    links: [
      { href: "/catalog?category=samovary", label: "Самовары" },
      { href: "/catalog?category=ikony", label: "Иконы" },
      { href: "/catalog?category=farfor", label: "Фарфор" },
      { href: "/catalog?category=mebel", label: "Мебель" },
    ],
  },
  {
    title: "Покупателю",
    links: [
      { href: "/catalog", label: "Весь каталог" },
      { href: "/search", label: "Поиск" },
      { href: "/cart", label: "Подборка" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-forest text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="font-display text-2xl font-semibold">Антикъ</p>
          <div className="brass-rule my-3 max-w-[120px]" />
          <p className="max-w-sm text-sm text-cream/70">
            Курируемый антиквариат с провенансом и экспертизой. Подбор и продажа
            предметов в наличии — каждый предмет в единственном экземпляре.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="eyebrow !text-cream/50">{c.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream/80 hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-cream/50">
          © {new Date().getFullYear()} Антикъ. Все предметы уникальны и
          представлены в единственном экземпляре.
        </div>
      </div>
    </footer>
  );
}
