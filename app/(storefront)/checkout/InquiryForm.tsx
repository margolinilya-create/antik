"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "./actions";

const initial: InquiryState = {};

export function InquiryForm({ itemSlug }: { itemSlug?: string }) {
  const [state, formAction, pending] = useActionState(submitInquiry, initial);

  if (state.ok) {
    return (
      <div className="border border-accent/40 bg-surface px-4 py-8 text-center">
        <p className="font-medium text-ink">Заявка отправлена</p>
        <p className="mt-1 text-sm text-muted">
          Мы свяжемся с вами в ближайшее время.
        </p>
      </div>
    );
  }

  const input =
    "w-full border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent";
  const lbl = "mb-1.5 block text-[0.7rem] uppercase tracking-[0.14em] text-faint";

  return (
    <form action={formAction} className="space-y-3">
      {itemSlug && <input type="hidden" name="item_slug" value={itemSlug} />}
      <input type="hidden" name="type" value="reserve" />

      <div>
        <label className={lbl}>Имя *</label>
        <input name="customer_name" required className={input} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
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
        <label className={lbl}>Сообщение</label>
        <textarea name="message_ru" rows={3} className={input} />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-accent px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-onaccent transition-colors hover:bg-accent-soft disabled:opacity-60"
      >
        {pending ? "Отправка…" : "Отправить заявку"}
      </button>
      <p className="text-xs text-faint">
        Укажите хотя бы один контакт. Нажимая «Отправить», вы соглашаетесь на
        обработку персональных данных.
      </p>
    </form>
  );
}
