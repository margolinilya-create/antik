import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SourcingForm } from "@/components/marketing/SourcingForm";

export const metadata: Metadata = {
  title: "Подбор антиквариата под запрос — консьерж-сервис",
  description:
    "Ищете конкретный предмет — икону, самовар, фарфор, мебель или живопись определённой эпохи? Подберём под запрос: поиск, экспертиза, проверка состояния. Бесплатно при покупке через галерею.",
  alternates: { canonical: "/concierge" },
};

const steps = [
  { n: "01", t: "Опишите предмет", d: "Расскажите, что ищете: эпоха, стиль, материалы, бюджет и важные детали." },
  { n: "02", t: "Ищем и проверяем", d: "Подбираем варианты из собрания и по нашим источникам, проверяем подлинность и состояние." },
  { n: "03", t: "Показываем лучшее", d: "Присылаем фото, видео и отчёт о состоянии. Решение — за вами, без спешки." },
];

export default function ConciergePage() {
  return (
    <div className="space-y-14">
      <Breadcrumbs
        crumbs={[
          { name: "Главная", url: "/" },
          { name: "Подбор под запрос", url: "/concierge" },
        ]}
      />

      <header className="max-w-2xl">
        <p className="eyebrow text-accent">Консьерж-сервис</p>
        <h1 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          Подбор под запрос
        </h1>
        <p className="mt-6 leading-relaxed text-muted">
          Не нашли нужное в каталоге? Опишите предмет мечты — и мы займёмся
          поиском: из собственного собрания и по проверенным источникам, с
          экспертизой подлинности и честной оценкой состояния. Услуга бесплатна
          при покупке через галерею.
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
        <h2 className="mb-6 text-xl font-light tracking-tight">Заявка на подбор</h2>
        <SourcingForm />
      </section>
    </div>
  );
}
