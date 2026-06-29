"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) {
      setError("Сервер не настроен. Подключите Supabase.");
      return;
    }
    setPending(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setPending(false);
    if (error) {
      setError("Неверный email или пароль.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  const input =
    "w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500";

  return (
    <form onSubmit={onSubmit} className="mt-5 space-y-3">
      <div>
        <label className="mb-1 block text-sm text-stone-600">Email</label>
        <input name="email" type="email" required className={input} autoComplete="username" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-stone-600">Пароль</label>
        <input
          name="password"
          type="password"
          required
          className={input}
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-60"
      >
        {pending ? "Вход…" : "Войти"}
      </button>
    </form>
  );
}
