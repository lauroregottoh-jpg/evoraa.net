import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import type { EmailOtpType } from "@supabase/supabase-js"

/**
 * Callback Auth Supabase (confirmation email, reset password, magic link).
 * Gère à la fois ?code= (PKCE) et ?token_hash=&type= (OTP).
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const { searchParams, origin } = url
  const code = searchParams.get("code")
  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const nextParam = searchParams.get("next") || "/dashboard"

  const supabase = await createClient()
  let sessionOk = false

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    sessionOk = !error
    if (error) console.error("[auth/callback] exchangeCode", error.message)
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    sessionOk = !error
    if (error) console.error("[auth/callback] verifyOtp", error.message)
  }

  if (sessionOk) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let next = nextParam.startsWith("/") ? nextParam : "/dashboard"

    if (user) {
      // Marque l'email vérifié côté profil produit
      await supabase
        .from("profiles")
        .update({
          email_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      // Reset password : laisser next=/reset-password
      if (next !== "/reset-password" && !next.startsWith("/reset-password")) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("completion_percentage, onboarding_status")
          .eq("user_id", user.id)
          .maybeSingle()

        const completion = profile?.completion_percentage ?? 0
        const status = profile?.onboarding_status
        const needsOnboarding =
          completion < 70 ||
          !status ||
          status === "step1_account" ||
          status === "step2_profile"

        next = needsOnboarding ? "/onboarding" : "/dashboard"
      }
    }

    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(
    `${origin}/login?error=auth_callback&msg=${encodeURIComponent(
      "Le lien a expiré ou est invalide. Connectez-vous ou demandez un nouvel email."
    )}`
  )
}
