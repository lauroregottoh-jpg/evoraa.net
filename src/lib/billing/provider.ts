export function resolveLiveProvider() {
  const env = (process.env.PAYMENT_PROVIDER || "").toLowerCase()
  if (env === "bictorys" || env === "cinetpay") return env
  // Keliaa primary: Bictorys (Mobile Money UEMOA). CinetPay reste fallback explicite.
  if (process.env.BICTORYS_API_KEY) return "bictorys"
  if (process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID) return "cinetpay"
  return "bictorys"
}

export function isDemoPaymentsEnv() {
  if (process.env.NODE_ENV === "production" && process.env.PAYMENTS_DEMO_MODE !== "true") {
    return false
  }
  if (process.env.PAYMENTS_DEMO_MODE === "false") return false
  if (process.env.PAYMENTS_DEMO_MODE === "true") return true
  const hasCinetPay = Boolean(process.env.CINETPAY_API_KEY && process.env.CINETPAY_SITE_ID)
  const hasBictorys = Boolean(process.env.BICTORYS_API_KEY)
  return !hasCinetPay && !hasBictorys
}
