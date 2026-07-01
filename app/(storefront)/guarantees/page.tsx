import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { GuaranteesStrip } from "@/components/marketing/GuaranteesStrip";
import { ContactChannels } from "@/components/marketing/ContactChannels";

export const metadata: Metadata = {
  title: "Гарантии и доставка",
  description:
    "Гарантия подлинности и экспертизы, страхованная доставка по России и миру, персональный подбор предметов. Условия покупки антиквариата в галерее.",
  alternates: { canonical: "/guarantees" },
};

const blocks = [
  {
    title: "Подлинность и экспертиза",
    items: [
      "Атрибуция каждого предмета: клейма, материалы, технология, провенанс.",
      "Экспертное заключение и сертификат по значимым позициям — по запросу.",
      "Гарантируем подлинность атрибуции каждого предмета.",
    ],
  },
  {
    title: "Доставка",
    items: [
      "Музейная упаковка и страхование на полную стоимость предмета.",
      "Доставка по России и миру проверенными службами.",
      "Возможен самовывоз из галереи по предварительной договорённости.",
    ],
  },
  {
    title: "Подбор и сопровождение",
    items: [
      "Персональный подбор предметов под ваш запрос, коллекцию и бюджет.",
      "Резерв понравившегося предмета на время принятия решения.",
      "Сопровождение сделки и консультации на каждом шаге.",
    ],
  },
];

export default function GuaranteesPage() {
  return (
    <div className="space-y-14">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Гарантии", url: "/guarantees" },
        ]}
      />

      <header className="max-w-2xl">
        <p className="eyebrow text-accent">Условия покупки</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Гарантии и доставка
        </h1>
        <p className="mt-6 leading-relaxed text-muted">
          Мы отвечаем за подлинность и состояние каждого предмета. Покупка
          антиквариата у нас — это уверенность на каждом шаге.
        </p>
      </header>

      <GuaranteesStrip />

      <div className="grid gap-10 md:grid-cols-3">
        {blocks.map((b) => (
          <section key={b.title}>
            <h2 className="text-lg font-light tracking-tight">{b.title}</h2>
            <div className="gold-rule my-4 w-12" />
            <ul className="space-y-3 text-sm leading-relaxed text-muted">
              {b.items.map((it) => (
                <li key={it} className="flex gap-2.5">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                  {it}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="max-w-2xl">
        <h2 className="mb-4 text-lg font-light tracking-tight">Остались вопросы?</h2>
        <ContactChannels />
      </section>
    </div>
  );
}
