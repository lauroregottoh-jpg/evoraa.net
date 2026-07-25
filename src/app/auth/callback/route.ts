import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const nextParam = searchParams.get("next") || "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      let next = nextParam.startsWith("/") ? nextParam : "/dashboard"

      if (user) {
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

        if (needsOnboarding) {
          next = "/onboarding"
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback`)
}
