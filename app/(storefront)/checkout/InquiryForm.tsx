"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "./actions";

const initial: InquiryState = {};

export function InquiryForm({ itemSlug }: { itemSlug?: string }) {
  const [state, formAction, pending] = useActionState(submitInquiry, initial);

  if (state.ok) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-6 text-center">
        <p className="font-medium text-green-800">Заявка отправлена!</p>
        <p className="mt-1 text-sm text-green-700">
          Мы свяжемся с вами в ближайшее время.
        </p>
      </div>
    );
  }

  const input =
    "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none focus:border-stone-500";

  return (
    <form action={formAction} className="space-y-3">
      {itemSlug && <input type="hidden" name="item_slug" value={itemSlug} />}
      <input type="hidden" name="type" value="reserve" />

      <div>
        <label className="mb-1 block text-sm text-stone-600">Имя *</label>
        <input name="customer_name" required className={input} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-stone-600">Телефон</label>
          <input name="phone" type="tel" className={input} placeholder="+7…" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-600">Telegram</label>
          <input name="telegram" className={input} placeholder="@username" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm text-stone-600">Email</label>
        <input name="email" type="email" className={input} />
      </div>
      <div>
        <label className="mb-1 block text-sm text-stone-600">Сообщение</label>
        <textarea name="message_ru" rows={3} className={input} />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-stone-900 px-5 py-3 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pending ? "Отправка…" : "Отправить заявку"}
      </button>
      <p className="text-xs text-stone-400">
        Укажите хотя бы один контакт. Нажимая «Отправить», вы соглашаетесь на
        обработку персональных данных.
      </p>
    </form>
  );
}
