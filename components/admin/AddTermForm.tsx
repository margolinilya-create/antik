"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTaxonomyTerm } from "@/app/(admin)/admin/actions";

type Table = "categories" | "eras" | "materials" | "techniques" | "makers";

export function AddTermForm({ table }: { table: Table }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    setPending(true);
    setError(null);
    const res = await createTaxonomyTerm(table, { name_ru: name });
    setPending(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setName("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Новое значение"
        className="flex-1 rounded-md border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-stone-900 px-3 py-1.5 text-sm text-white hover:bg-stone-700 disabled:opacity-60"
      >
        +
      </button>
      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </form>
  );
}
