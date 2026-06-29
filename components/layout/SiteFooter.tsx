import Link from "next/link";

const COLS = [
  {
    title: "Коллекция",
    links: [
      { href: "/catalog?category=zhivopis", label: "Живопись" },
      { href: "/catalog?category=ikony", label: "Иконы" },
      { href: "/catalog?category=farfor", label: "Фарфор" },
      { href: "/catalog?category=mebel", label: "Мебель" },
    ],
  },
  {
    title: "Навигация",
    links: [
      { href: "/catalog", label: "Весь каталог" },
      { href: "/search", label: "Поиск" },
      { href: "/cart", label: "Подборка" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-line">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="text-base font-semibold uppercase tracking-[0.42em] text-ink">
            Антик
          </p>
          <div className="gold-rule my-4 max-w-[100px]" />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Курируемая антикварная галерея с провенансом и экспертизой. Подбор и
            продажа уникальных предметов — каждый в единственном экземпляре.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <p className="eyebrow">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-[1280px] px-5 py-6 text-[0.72rem] uppercase tracking-[0.14em] text-faint">
          © {new Date().getFullYear()} Антик · Все предметы уникальны
        </div>
      </div>
    </footer>
  );
}
