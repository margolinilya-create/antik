import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SellForm } from "@/components/marketing/SellForm";

export const metadata: Metadata = {
  title: "Продать антиквариат — бесплатная оценка",
  description:
    "Продайте антиквариат или закажите бесплатную оценку: самовары, иконы, фарфор, серебро, живопись, монеты. Выкуп и комиссионная продажа, экспертиза.",
  alternates: { canonical: "/sell" },
};

const steps = [
  { n: "01", t: "Опишите предмет", d: "Заполните форму и приложите фото — что это, эпоха, состояние, клейма." },
  { n: "02", t: "Получите оценку", d: "Эксперт изучит предмет и предложит цену выкупа или условия комиссии." },
  { n: "03", t: "Сделка", d: "Согласуем удобный способ передачи и оплаты. Всё прозрачно и без спешки." },
];

export default function SellPage() {
  return (
    <div className="space-y-14">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Продать / оценка", url: "/sell" },
        ]}
      />

      <header className="max-w-2xl">
        <p className="eyebrow text-accent">Выкуп и комиссия</p>
        <h1 className="mt-4 text-4xl font-light leading-tight tracking-tight sm:text-5xl">
          Продать антиквариат
        </h1>
        <p className="mt-6 leading-relaxed text-muted">
          Оценим ваш предмет бесплатно и предложим честные условия — выкуп или
          комиссионную продажу через галерею. Принимаем самовары, иконы, фарфор,
          серебро, живопись, мебель и монеты.
        </p>
      </header>

      <section className="grid gap-px border border-line bg-line sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="bg-bg p-7">
            <p className="text-2xl font-light text-accent">{s.n}</p>
            <h2 className="mt-3 text-base font-medium text-ink">{s.t}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
          </div>
        ))}
      </section>

      <section className="max-w-xl">
        <h2 className="mb-6 text-xl font-light tracking-tight">Заявка на оценку</h2>
        <SellForm />
      </section>
    </div>
  );
}
