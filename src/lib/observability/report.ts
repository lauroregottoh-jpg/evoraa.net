/**
 * Observabilité — préfère @sentry/nextjs si installé + SENTRY_DSN,
 * sinon endpoint Store Sentry DIY (fire-and-forget).
 */

export function captureError(
  error: unknown,
  context?: Record<string, unknown>
) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "unknown_error"
  const stack = error instanceof Error ? error.stack : undefined
  console.error("[ops]", message, context ?? {}, stack ? `\n${stack}` : "")

  const dsn = process.env.SENTRY_DSN?.trim()
  if (!dsn) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require("@sentry/nextjs") as typeof import("@sentry/nextjs")
    if (Sentry?.captureException) {
      Sentry.captureException(
        error instanceof Error ? error : new Error(message),
        { extra: context }
      )
      return
    }
  } catch {
    /* fall through DIY */
  }

  void sendToSentry(dsn, message, stack, context).catch(() => {})
}

async function sendToSentry(
  dsn: string,
  message: string,
  stack?: string,
  context?: Record<string, unknown>
) {
  const match = dsn.match(/^https:\/\/([^@]+)@([^/]+)\/(\d+)/)
  if (!match) return
  const [, key, host, project] = match
  const url = `https://${host}/api/${project}/store/?sentry_key=${key}&sentry_version=7`
  const event = {
    event_id: crypto.randomUUID().replace(/-/g, ""),
    timestamp: Date.now() / 1000,
    platform: "node",
    level: "error",
    server_name: process.env.VERCEL_URL || "keliaa",
    message,
    exception: stack
      ? {
          values: [
            {
              type: "Error",
              value: message,
              stacktrace: {
                frames: [{ filename: "app", function: "captureError" }],
              },
            },
          ],
        }
      : undefined,
    tags: { app: "keliaa" },
    extra: context ?? {},
  }
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  })
}

export function captureMessage(
  message: string,
  context?: Record<string, unknown>
) {
  console.info("[ops]", message, context ?? {})
  if (!process.env.SENTRY_DSN?.trim()) return

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Sentry = require("@sentry/nextjs") as typeof import("@sentry/nextjs")
    if (Sentry?.captureMessage) {
      Sentry.captureMessage(message, { extra: context })
      return
    }
  } catch {
    /* DIY */
  }

  void sendToSentry(
    process.env.SENTRY_DSN.trim(),
    message,
    undefined,
    context
  ).catch(() => {})
}
