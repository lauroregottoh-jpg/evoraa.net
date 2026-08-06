/**
 * Sentry Edge (middleware) — soft-init.
 */
import * as Sentry from "@sentry/nextjs"

function parseRate(raw: string | undefined, fallback: number): number {
  if (raw === undefined) return fallback
  const n = Number(raw)
  if (!Number.isFinite(n)) return fallback
  return Math.max(0, Math.min(1, n))
}

const dsn =
  process.env.SENTRY_DSN?.trim() ||
  process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ||
  ""

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.SENTRY_ENVIRONMENT ||
      process.env.VERCEL_ENV ||
      process.env.NODE_ENV,
    tracesSampleRate: parseRate(process.env.SENTRY_TRACES_SAMPLE_RATE, 0),
  })
}
