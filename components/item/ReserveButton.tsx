"use client";

import Link from "next/link";
import type { ItemStatus } from "@/types/database";

/**
 * Lead entry point. Routes to the inquiry/checkout form pre-filled with this
 * item. Cart-lite wiring (zustand) lands in phase 4; for now it's a direct
 * "оставить заявку" link, which already drives the deal funnel.
 */
export function ReserveButton({
  slug,
  status,
}: {
  slug: string;
  status: ItemStatus;
}) {
  if (status === "sold") {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-sm bg-canvas px-5 py-3.5 text-sm font-medium uppercase tracking-[0.12em] text-muted"
      >
        Продано
      </button>
    );
  }
  return (
    <Link
      href={`/checkout?item=${slug}`}
      className="block w-full rounded-sm bg-accent px-5 py-3.5 text-center text-sm font-medium uppercase tracking-[0.12em] text-cream transition-colors hover:bg-accent-deep"
    >
      {status === "reserved" ? "Узнать о предмете" : "Оставить заявку"}
    </Link>
  );
}
