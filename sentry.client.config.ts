/**
 * Sentry browser — no-op if NEXT_PUBLIC_SENTRY_DSN / SENTRY_DSN absent.
 * Pattern adapté Evora (soft-init).
 */
import * as Sentry from "@sentry/nextjs"

function parseRate(raw: string | undefined, fallback: number): number {
  if (raw === undefined) return fallback
  const n = Number(raw)
  if (!Number.isFinite(n)) return fallback
  return Math.max(0, Math.min(1, n))
}

const dsn =
  process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ||
  process.env.SENTRY_DSN?.trim() ||
  ""

if (dsn) {
  Sentry.init({
    dsn,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
      process.env.VERCEL_ENV ||
      process.env.NODE_ENV,
    tracesSampleRate: parseRate(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
      0.05
    ),
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: parseRate(
      process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
      1
    ),
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications.",
    ],
  })
}
