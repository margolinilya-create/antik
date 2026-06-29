"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Returns false during SSR and the first hydration pass, true once on the
 * client. Hydration-safe (useSyncExternalStore handles the server/client
 * snapshot swap) and avoids setState-in-effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
