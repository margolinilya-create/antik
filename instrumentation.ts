/**
 * Next.js instrumentation — central server-error capture hook. This is the
 * seam where an external monitor (e.g. Sentry) would be wired.
 */
export async function onRequestError(
  error: unknown,
  request: { path?: string; method?: string },
): Promise<void> {
  const { logError } = await import("@/lib/logger");
  logError(error, { url: request?.path, method: request?.method });
}
