/**
 * Boot serveur Next — validation env soft + Sentry optionnel.
 * Ne throw jamais : ne pas bloquer cold start / build.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertEnvSoft } = await import("@/lib/config/env")
    assertEnvSoft()

    if (process.env.SENTRY_DSN?.trim()) {
      try {
        const Sentry = await import("@sentry/nextjs")
        Sentry.init({
          dsn: process.env.SENTRY_DSN.trim(),
          tracesSampleRate: 0.1,
          environment:
            process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
        })
      } catch {
        /* package absent — capture DIY dans report.ts */
      }
    }
  }
}

export async function onRequestError(
  error: unknown,
  request: { path: string },
  context: { routerKind?: string }
) {
  const { captureError } = await import("@/lib/observability/report")
  captureError(error, {
    source: "onRequestError",
    path: request.path,
    routerKind: context.routerKind,
  })
}
