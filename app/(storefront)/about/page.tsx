import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { GuaranteesStrip } from "@/components/marketing/GuaranteesStrip";
import { ContactChannels } from "@/components/marketing/ContactChannels";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "О галерее — экспертиза и провенанс",
  description:
    "Антикварная галерея с экспертизой и провенансом: атрибуция, честное описание состояния, страховка и доставка. Подбор и продажа уникальных предметов.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "100%", label: "предметов с атрибуцией" },
  { value: "1 / 1", label: "каждый предмет в единственном экземпляре" },
  { value: "Под запрос", label: "персональный подбор редких предметов" },
];

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "О галерее", url: "/about" },
        ]}
      />

      <header className="max-w-3xl">
        <p className="eyebrow text-accent">О галерее</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Антиквариат, которому можно доверять
        </h1>
        <p className="mt-6 text-lg font-light leading-relaxed text-muted">
          {site.name} — кураторская галерея антиквариата. Мы отбираем предметы с
          прозрачной историей, проверяем подлинность и честно описываем
          состояние. Наша задача — чтобы каждая покупка приносила уверенность и
          удовольствие коллекционеру.
        </p>
      </header>

      <section className="grid gap-px border border-line bg-line sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-bg p-7 text-center">
            <p className="text-3xl font-light text-accent">{s.value}</p>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="max-w-3xl space-y-4 text-[0.95rem] leading-[1.8] text-ink/85">
        <h2 className="text-xl font-light tracking-tight text-ink">Экспертиза и подход</h2>
        <div className="gold-rule w-16" />
        <p>
          Каждый предмет проходит атрибуцию: мы изучаем клейма, материалы,
          технологию и провенанс. По значимым позициям предоставляем экспертное
          заключение и сертификат.
        </p>
        <p>
          Мы работаем с самоварами, иконами, фарфором, мебелью, монетами и
          живописью — от Императорской России до периода СССР. Среди брендов —
          Фаберже, Кузнецовъ, Императорский фарфоровый завод, Гарднеръ,
          Овчинниковъ и другие знаковые мануфактуры.
        </p>
        <p>
          Доставка по России и миру выполняется в музейной упаковке со
          страхованием на полную стоимость. А если нужного предмета нет в
          наличии — займёмся персональным подбором под ваш запрос.
        </p>
      </section>

      <GuaranteesStrip />

      <section className="max-w-3xl">
        <h2 className="mb-4 text-xl font-light tracking-tight">Связаться с нами</h2>
        <ContactChannels />
        <p className="mt-4 text-sm text-muted">
          {site.address.city}, {site.address.street}. {site.hours}.
        </p>
      </section>
    </div>
  );
}
