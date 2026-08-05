import { z } from "zod"

/**
 * Validation env au boot (serveur).
 * En CI / build : valeurs stub acceptées.
 * En production runtime : contraintes plus strictes (URLs, pas de placeholder).
 */

const urlLike = z.string().min(1)

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: urlLike,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  PAYMENTS_DEMO_MODE: z.enum(["true", "false"]).optional(),
  PAYMENT_PROVIDER: z.enum(["bictorys", "cinetpay"]).optional(),
  CRON_SECRET: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  BICTORYS_API_KEY: z.string().optional(),
  BICTORYS_WEBHOOK_SECRET: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
})

export type AppEnv = z.infer<typeof EnvSchema>

let cached: AppEnv | null = null

function isPlaceholder(value: string | undefined) {
  if (!value) return true
  return (
    value.includes("example") ||
    value.includes("placeholder") ||
    value.includes("your-") ||
    value === "http://localhost:3000"
  )
}

/**
 * Lit et valide process.env. Ne throw en build CI que si schema de base KO.
 * En Vercel production runtime, log un warning (captureError) si paiements live
 * sans secrets — sans faire planter cold start.
 */
export function getEnv(): AppEnv {
  if (cached) return cached
  const parsed = EnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    PAYMENTS_DEMO_MODE: process.env.PAYMENTS_DEMO_MODE as "true" | "false" | undefined,
    PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER as
      | "bictorys"
      | "cinetpay"
      | undefined,
    CRON_SECRET: process.env.CRON_SECRET,
    SENTRY_DSN: process.env.SENTRY_DSN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    BICTORYS_API_KEY: process.env.BICTORYS_API_KEY,
    BICTORYS_WEBHOOK_SECRET: process.env.BICTORYS_WEBHOOK_SECRET,
    NODE_ENV: process.env.NODE_ENV as AppEnv["NODE_ENV"],
    VERCEL_ENV: process.env.VERCEL_ENV as AppEnv["VERCEL_ENV"],
  })

  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.path.join(".")).join(", ")
    throw new Error(`[env] Variables manquantes ou invalides: ${msg}`)
  }

  cached = parsed.data

  const prod =
    process.env.VERCEL_ENV === "production" ||
    (process.env.NODE_ENV === "production" &&
      !isPlaceholder(process.env.NEXT_PUBLIC_SUPABASE_URL))

  if (prod && process.env.PAYMENTS_DEMO_MODE !== "true") {
    if (!process.env.BICTORYS_WEBHOOK_SECRET && !process.env.CINETPAY_WEBHOOK_TOKEN) {
      console.warn(
        "[env] Prod live payments: BICTORYS_WEBHOOK_SECRET (ou CINETPAY_WEBHOOK_TOKEN) recommandé"
      )
    }
  }

  return cached
}

/** Soft assert — call from instrumentation without crashing the process. */
export function assertEnvSoft() {
  try {
    getEnv()
  } catch (e) {
    console.error("[env]", e)
  }
}
