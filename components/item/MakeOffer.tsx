"use client";

import { useActionState, useState } from "react";
import { makeOffer, type LeadState } from "@/app/(storefront)/leads";

const input =
  "w-full border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent";

export function MakeOffer({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<LeadState, FormData>(makeOffer, {});

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full border border-line px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:border-accent hover:text-ink"
      >
        Сделать предложение
      </button>
    );
  }

  if (state.ok) {
    return (
      <p className="border border-accent/40 bg-surface px-4 py-4 text-center text-sm text-ink">
        Предложение отправлено. Мы свяжемся с вами.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-2.5 border border-line p-4">
      <input type="hidden" name="item_slug" value={slug} />
      <p className="eyebrow mb-1">Ваше предложение</p>
      <input name="offer_amount" inputMode="numeric" required placeholder="Сумма, ₽" className={input} />
      <input name="customer_name" required placeholder="Имя" className={input} />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <input name="phone" type="tel" placeholder="Телефон" className={input} />
        <input name="telegram" placeholder="Telegram" className={input} />
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex-1 bg-accent px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-onaccent transition-colors hover:bg-accent-soft disabled:opacity-60"
        >
          {pending ? "Отправка…" : "Отправить"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="border border-line px-4 py-3 text-xs uppercase tracking-[0.14em] text-faint hover:text-ink"
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
