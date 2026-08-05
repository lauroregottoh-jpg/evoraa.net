import { createClient } from "@/utils/supabase/server"
import { headers } from "next/headers"

/** URL publique stable pour liens email / redirects Auth. */
export async function resolveAppUrl(): Promise<string> {
  // Prefer the host the member actually used (keliaa.org, vercel preview, etc.)
  try {
    const h = await headers()
    const host = (h.get("x-forwarded-host") || h.get("host") || "").split(
      ":"
    )[0]
    const proto = h.get("x-forwarded-proto") || "https"
    if (host && !host.includes("localhost")) {
      // Même canonique que le middleware : www pour PKCE / cookies partagés
      if (host === "keliaa.org" || host === "www.keliaa.org") {
        return "https://www.keliaa.org"
      }
      return `${proto}://${host}`.replace(/\/$/, "")
    }
  } catch {
    /* headers() indisponible hors requête */
  }

  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim()
  if (configured && !configured.includes("localhost")) {
    if (configured === "https://keliaa.org" || configured === "http://keliaa.org") {
      return "https://www.keliaa.org"
    }
    return configured
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "")
  }

  return configured || "http://localhost:3000"
}

export function resolveAppUrlSync(): string {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "").trim() || ""
  if (
    configured === "https://keliaa.org" ||
    configured === "http://keliaa.org"
  ) {
    return "https://www.keliaa.org"
  }
  return (
    configured ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  )
}

export async function resolvePostAuthPath(
  userId: string
): Promise<"/onboarding" | "/dashboard"> {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "completion_percentage, onboarding_status, first_name, last_name, gender, birth_date, city, church_attended"
    )
    .eq("user_id", userId)
    .maybeSingle()

  const { profileNeedsOnboarding } = await import("@/lib/auth/onboardingGate")
  return profileNeedsOnboarding(profile) ? "/onboarding" : "/dashboard"
}
