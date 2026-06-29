"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useCart } from "@/lib/cart/store";
import { useMounted } from "@/lib/hooks/useMounted";
import { formatPrice } from "@/lib/format";
import { submitCartInquiry, type CartInquiryState } from "./actions";

export function CartView() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  // Cart lives in localStorage — render nothing until mounted to avoid mismatch.
  const mounted = useMounted();
  const [state, formAction, pending] = useActionState<CartInquiryState, FormData>(
    submitCartInquiry,
    {},
  );

  useEffect(() => {
    if (state.ok) clear();
  }, [state.ok, clear]);

  if (!mounted) return null;

  if (state.ok) {
    return (
      <div className="border border-accent/40 bg-surface px-4 py-8 text-center">
        <p className="font-medium text-ink">Заявка по подборке отправлена</p>
        <p className="mt-1 text-sm text-muted">Мы свяжемся с вами в ближайшее время.</p>
        <Link href="/catalog" className="mt-4 inline-block text-xs uppercase tracking-[0.16em] text-accent link-underline pb-1">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="border border-dashed border-line px-4 py-14 text-center text-sm text-muted">
        Подборка пуста.{" "}
        <Link href="/catalog" className="text-accent link-underline pb-0.5">
          Перейти в каталог
        </Link>
      </p>
    );
  }

  const total = items.reduce(
    (sum, i) => sum + (i.price_on_request ? 0 : (i.price ?? 0)),
    0,
  );
  const input =
    "w-full border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent";

  return (
    <div className="space-y-8">
      <ul className="divide-y divide-line border-y border-line">
        {items.map((i) => (
          <li key={i.slug} className="flex items-center gap-4 py-4">
            <div className="relative size-16 shrink-0 overflow-hidden bg-surface">
              <Image src={i.image || "/placeholder.svg"} alt={i.title} fill sizes="64px" className="object-cover" />
            </div>
            <div className="flex-1">
              <Link href={`/item/${i.slug}`} className="text-sm font-medium text-ink transition-colors hover:text-accent">
                {i.title}
              </Link>
              <p className="mt-0.5 text-sm text-muted">
                {formatPrice(i.price, i.currency, i.price_on_request)}
              </p>
            </div>
            <button
              onClick={() => remove(i.slug)}
              className="text-xs uppercase tracking-[0.14em] text-faint transition-colors hover:text-accent"
            >
              Убрать
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-sm">
        <span className="eyebrow">Ориентировочно</span>
        <span className="text-lg font-light text-ink">{formatPrice(total)}</span>
      </div>

      <form action={formAction} className="space-y-3 border border-line p-5">
        <input type="hidden" name="snapshot" value={JSON.stringify(items)} />
        <p className="eyebrow mb-1">Оставить заявку по подборке</p>
        <input name="customer_name" required placeholder="Имя *" className={input} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="phone" type="tel" placeholder="Телефон" className={input} />
          <input name="telegram" placeholder="Telegram" className={input} />
        </div>
        <input name="email" type="email" placeholder="Email" className={input} />
        <textarea name="message_ru" rows={2} placeholder="Сообщение" className={input} />
        {state.error && <p className="text-sm text-red-400">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-accent px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-onaccent transition-colors hover:bg-accent-soft disabled:opacity-60"
        >
          {pending ? "Отправка…" : "Отправить заявку"}
        </button>
      </form>
    </div>
  );
}
