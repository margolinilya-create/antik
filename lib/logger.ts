import "server-only";

type Context = Record<string, unknown>;

/**
 * Structured server-side error logging. On Vercel these land in the function
 * logs. This is the single seam for an external monitor: to enable Sentry,
 * install `@sentry/nextjs` and forward `error` here (and in instrumentation.ts).
 */
export function logError(error: unknown, context?: Context): void {
  const payload = {
    level: "error",
    time: new Date().toISOString(),
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  };
  console.error("[error]", JSON.stringify(payload));

  const dsn = process.env.SENTRY_DSN;
  if (dsn) {
    // Placeholder: forward to Sentry once @sentry/nextjs is installed.
    // import * as Sentry from "@sentry/nextjs"; Sentry.captureException(error, { extra: context });
  }
}
