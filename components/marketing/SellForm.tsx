"use client";

import { useActionState } from "react";
import { sellRequest, type LeadState } from "@/app/(storefront)/leads";
import { ConsentCheckbox } from "./ConsentCheckbox";

const input =
  "w-full border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent";
const lbl = "mb-1.5 block text-[0.7rem] uppercase tracking-[0.14em] text-faint";

export function SellForm() {
  const [state, action, pending] = useActionState<LeadState, FormData>(sellRequest, {});

  if (state.ok) {
    return (
      <div className="border border-accent/40 bg-surface px-4 py-8 text-center">
        <p className="font-medium text-ink">Заявка отправлена</p>
        <p className="mt-1 text-sm text-muted">
          Мы изучим предмет и свяжемся с вами с оценкой.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="sell-name" className={lbl}>Имя *</label>
        <input id="sell-name" name="customer_name" required className={input} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sell-phone" className={lbl}>Телефон</label>
          <input id="sell-phone" name="phone" type="tel" className={input} placeholder="+7…" />
        </div>
        <div>
          <label htmlFor="sell-telegram" className={lbl}>Telegram</label>
          <input id="sell-telegram" name="telegram" className={input} placeholder="@username" />
        </div>
      </div>
      <div>
        <label htmlFor="sell-email" className={lbl}>Email</label>
        <input id="sell-email" name="email" type="email" className={input} />
      </div>
      <div>
        <label htmlFor="sell-message" className={lbl}>Что продаёте</label>
        <textarea
          id="sell-message"
          name="message_ru"
          rows={4}
          className={input}
          placeholder="Опишите предмет: что это, эпоха, состояние, клейма. Можно приложить ссылку на фото."
        />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      <ConsentCheckbox id="sell-consent" />
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-ink px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-bg transition-colors hover:bg-ink/85 disabled:opacity-60"
      >
        {pending ? "Отправка…" : "Отправить на оценку"}
      </button>
      <p className="text-xs text-faint">
        Оценка бесплатна и ни к чему не обязывает.
      </p>
    </form>
  );
}
