/**
 * Boot serveur Next — validation env soft + Sentry optionnel.
 * Ne throw jamais : ne pas bloquer cold start / build.
 * Configs dédiées : sentry.{client,server,edge}.config.ts (chargées par Next).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertEnvSoft } = await import("@/lib/config/env")
    assertEnvSoft()
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
