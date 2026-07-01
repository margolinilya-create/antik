"use client";

import { useActionState } from "react";
import { sourcingRequest, type LeadState } from "@/app/(storefront)/leads";
import { ConsentCheckbox } from "./ConsentCheckbox";

const input =
  "w-full border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent";
const lbl = "mb-1.5 block text-[0.7rem] uppercase tracking-[0.14em] text-faint";

export function SourcingForm() {
  const [state, action, pending] = useActionState<LeadState, FormData>(
    sourcingRequest,
    {},
  );

  if (state.ok) {
    return (
      <div className="border border-accent/40 bg-surface px-4 py-8 text-center">
        <p className="font-medium text-ink">Заявка принята</p>
        <p className="mt-1 text-sm text-muted">
          Начнём поиск и свяжемся с вами, как только найдём подходящее.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="src-name" className={lbl}>Имя *</label>
        <input id="src-name" name="customer_name" required className={input} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="src-phone" className={lbl}>Телефон</label>
          <input id="src-phone" name="phone" type="tel" className={input} placeholder="+7…" />
        </div>
        <div>
          <label htmlFor="src-telegram" className={lbl}>Telegram</label>
          <input id="src-telegram" name="telegram" className={input} placeholder="@username" />
        </div>
      </div>
      <div>
        <label htmlFor="src-email" className={lbl}>Email</label>
        <input id="src-email" name="email" type="email" className={input} />
      </div>
      <div>
        <label htmlFor="src-message" className={lbl}>Что ищете</label>
        <textarea
          id="src-message"
          name="message_ru"
          rows={4}
          className={input}
          placeholder="Опишите предмет мечты: что это, эпоха, стиль, материалы, бюджет. Чем подробнее — тем точнее подбор."
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <ConsentCheckbox id="src-consent" />
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-bg transition-colors hover:bg-ink/85 disabled:opacity-60"
      >
        {pending ? "Отправка…" : "Отправить запрос"}
      </button>
      <p className="text-xs text-faint">
        Услуга бесплатна при покупке через галерею и ни к чему не обязывает.
      </p>
    </form>
  );
}
