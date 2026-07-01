import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Публичная оферта",
  description:
    "Публичная оферта RELIQUA: условия подбора, бронирования и продажи антикварных предметов и доставки.",
  alternates: { canonical: "/oferta" },
};

const updated = "30 июня 2026 г.";

export default function OfferPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <header>
        <p className="eyebrow">Юридическая информация</p>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Публичная оферта
        </h1>
        <p className="mt-3 text-sm text-muted">Редакция от {updated}</p>
        <div className="gold-rule mt-6 w-16" />
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-ink/85 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-medium [&_h2]:text-ink [&_h2]:tracking-tight [&_h2]:pt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_p]:text-ink/85">
        <p>
          Настоящий документ является публичной офертой {site.legal.entity} (далее
          — «Продавец»), ИНН {site.legal.inn}, ОГРН {site.legal.ogrn}, адрес:{" "}
          {site.legal.legalAddress}, и содержит условия приобретения антикварных
          предметов, представленных на сайте {site.url}.
        </p>
        <p className="text-xs text-faint">
          Шаблонный документ. Перед публикацией замените реквизиты на реальные и
          согласуйте текст с юристом.
        </p>

        <h2>1. Предмет оферты</h2>
        <p>
          Продавец предлагает к продаже уникальные антикварные предметы. Каждый
          предмет существует в единственном экземпляре. Описание, состояние и цена
          указаны в карточке предмета. Акцептом оферты является оформление заявки,
          бронирования или иного обращения через формы Сайта.
        </p>

        <h2>2. Оформление заявки</h2>
        <p>
          Покупатель оставляет заявку через форму на Сайте. Продавец связывается с
          Покупателем для согласования деталей сделки, способа оплаты и доставки.
          До подтверждения Продавцом предмет может быть зарезервирован за другим
          покупателем.
        </p>

        <h2>3. Цена и оплата</h2>
        <p>
          Цены указаны в российских рублях. Для предметов с пометкой «цена по
          запросу» стоимость сообщается индивидуально. Способ и порядок оплаты
          согласовываются с менеджером при оформлении сделки.
        </p>

        <h2>4. Доставка</h2>
        <p>
          Доставка осуществляется по согласованию: музейная упаковка, страхование
          на полную стоимость, отправка по России и миру. Сроки и стоимость
          доставки сообщаются при оформлении.
        </p>

        <h2>5. Гарантии</h2>
        <p>
          Продавец гарантирует подлинность и соответствие предмета описанию.
          Подробнее — в разделе{" "}
          <Link href="/guarantees" className="text-accent hover:underline">
            «Гарантии и доставка»
          </Link>
          .
        </p>

        <h2>6. Персональные данные</h2>
        <p>
          Оформляя заявку, Покупатель соглашается с обработкой персональных данных
          в соответствии с{" "}
          <Link
            href="/politika-konfidencialnosti"
            className="text-accent hover:underline"
          >
            Политикой конфиденциальности
          </Link>
          .
        </p>

        <h2>7. Реквизиты продавца</h2>
        <ul>
          <li>{site.legal.entity}</li>
          <li>ИНН {site.legal.inn}</li>
          <li>ОГРН {site.legal.ogrn}</li>
          <li>Адрес: {site.legal.legalAddress}</li>
          <li>
            Эл. почта:{" "}
            <a href={site.emailHref} className="text-accent hover:underline">
              {site.email}
            </a>
          </li>
          <li>
            Телефон:{" "}
            <a href={site.phoneHref} className="text-accent hover:underline">
              {site.phone}
            </a>
          </li>
        </ul>
      </div>
    </article>
  );
}
