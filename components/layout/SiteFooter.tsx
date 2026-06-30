import Link from "next/link";
import { site } from "@/lib/site";
import { Newsletter } from "@/components/marketing/Newsletter";

const COLS = [
  {
    title: "Коллекция",
    links: [
      { href: "/catalog", label: "Весь каталог" },
      { href: "/brands", label: "Бренды" },
      { href: "/prodano", label: "Архив проданного" },
      { href: "/favorites", label: "Избранное" },
    ],
  },
  {
    title: "Галерея",
    links: [
      { href: "/about", label: "О галерее" },
      { href: "/guarantees", label: "Гарантии и доставка" },
      { href: "/sell", label: "Продать / оценка" },
      { href: "/journal", label: "Журнал" },
      { href: "/faq", label: "Вопросы и ответы" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-line">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 md:grid-cols-4">
        <div>
          <p className="text-base font-semibold uppercase tracking-[0.42em] text-ink">
            Антик
          </p>
          <div className="gold-rule my-4 max-w-[100px]" />
          <p className="text-sm leading-relaxed text-muted">{site.tagline}.</p>
          <ul className="mt-5 space-y-1.5 text-sm text-muted">
            <li>
              <a href={site.phoneHref} className="hover:text-ink">{site.phone}</a>
            </li>
            <li>
              <a href={site.emailHref} className="hover:text-ink">{site.email}</a>
            </li>
            <li>{site.address.city}, {site.address.street}</li>
            <li className="text-faint">{site.hours}</li>
          </ul>
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

        <div>
          <p className="eyebrow">Новые поступления</p>
          <p className="mt-4 mb-3 text-sm text-muted">
            Подпишитесь — сообщим о новинках первыми.
          </p>
          <Newsletter source="footer" compact />
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-[1280px] px-5 py-6 text-[0.72rem] uppercase tracking-[0.14em] text-faint">
          © {new Date().getFullYear()} {site.legalName} · Все предметы уникальны
        </div>
      </div>
    </footer>
  );
}
