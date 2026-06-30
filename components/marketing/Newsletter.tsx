"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type LeadState } from "@/app/(storefront)/leads";

export function Newsletter({
  source = "footer",
  compact = false,
}: {
  source?: string;
  compact?: boolean;
}) {
  const [state, action, pending] = useActionState<LeadState, FormData>(
    subscribeNewsletter,
    {},
  );

  if (state.ok) {
    return (
      <p className="text-sm text-accent">
        Спасибо! Вы подписаны на новые поступления.
      </p>
    );
  }

  return (
    <form action={action} className={compact ? "space-y-2" : "space-y-3"}>
      <input type="hidden" name="source" value={source} />
      {!compact && (
        <p className="eyebrow">Новые поступления — первыми</p>
      )}
      <div className="flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="Ваш email"
          aria-label="Email для подписки"
          className="min-w-0 flex-1 border border-line bg-bg px-3 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-accent"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 bg-accent px-4 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-onaccent transition-colors hover:bg-accent-soft disabled:opacity-60"
        >
          {pending ? "…" : "Подписаться"}
        </button>
      </div>
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
