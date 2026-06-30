"use client";

import { useActionState } from "react";
import { sellRequest, type LeadState } from "@/app/(storefront)/leads";

const input =
  "w-full border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent";
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
        <label className={lbl}>Имя *</label>
        <input name="customer_name" required className={input} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={lbl}>Телефон</label>
          <input name="phone" type="tel" className={input} placeholder="+7…" />
        </div>
        <div>
          <label className={lbl}>Telegram</label>
          <input name="telegram" className={input} placeholder="@username" />
        </div>
      </div>
      <div>
        <label className={lbl}>Email</label>
        <input name="email" type="email" className={input} />
      </div>
      <div>
        <label className={lbl}>Что продаёте</label>
        <textarea
          name="message_ru"
          rows={4}
          className={input}
          placeholder="Опишите предмет: что это, эпоха, состояние, клейма. Можно приложить ссылку на фото."
        />
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-accent px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-onaccent transition-colors hover:bg-accent-soft disabled:opacity-60"
      >
        {pending ? "Отправка…" : "Отправить на оценку"}
      </button>
      <p className="text-xs text-faint">
        Оценка бесплатна и ни к чему не обязывает.
      </p>
    </form>
  );
}
