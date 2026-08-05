export type LivePaymentProvider = "bictorys" | "moneroo"

export function resolveLiveProvider(): LivePaymentProvider {
  const env = (process.env.PAYMENT_PROVIDER || "").toLowerCase()
  if (env === "bictorys" || env === "moneroo") return env
  // Primary Keliaa : Bictorys ; Moneroo si clé présente et pas Bictorys
  if (process.env.BICTORYS_API_KEY) return "bictorys"
  if (process.env.MONEROO_SECRET_KEY) return "moneroo"
  return "bictorys"
}

export function isDemoPaymentsEnv() {
  if (process.env.NODE_ENV === "production" && process.env.PAYMENTS_DEMO_MODE !== "true") {
    return false
  }
  if (process.env.PAYMENTS_DEMO_MODE === "false") return false
  if (process.env.PAYMENTS_DEMO_MODE === "true") return true
  const hasMoneroo = Boolean(process.env.MONEROO_SECRET_KEY)
  const hasBictorys = Boolean(process.env.BICTORYS_API_KEY)
  return !hasMoneroo && !hasBictorys
}
