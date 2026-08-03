"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

/**
 * Reçoit les liens Auth (code PKCE, token_hash, ou #access_token).
 */
export default function AuthFinishPage() {
  const router = useRouter()
  const [status, setStatus] = React.useState("Ouverture de votre espace…")

  React.useEffect(() => {
    let cancelled = false

    async function run() {
      const hash = window.location.hash.replace(/^#/, "")
      const query = window.location.search.replace(/^\?/, "")
      const hashParams = new URLSearchParams(hash)
      const queryParams = new URLSearchParams(query)
      const params = new URLSearchParams([
        ...queryParams.entries(),
        ...hashParams.entries(),
      ])

      const access_token = params.get("access_token")
      const refresh_token = params.get("refresh_token")
      const type = params.get("type")
      const error = params.get("error_description") || params.get("error")
      const code = params.get("code")
      const token_hash = params.get("token_hash")
      const nextParam = params.get("next")

      const preferredNext =
        type === "recovery"
          ? "/reset-password"
          : nextParam?.startsWith("/")
            ? nextParam
            : "/onboarding"

      if (error) {
        setStatus("Lien invalide. Redirection…")
        router.replace(
          `/login?error=auth_callback&confirmed=1&msg=${encodeURIComponent(error)}`
        )
        return
      }

      const supabase = createClient()

      try {
        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })
          if (sessionError) throw sessionError
        } else if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) throw exchangeError
        } else if (token_hash && type) {
          const { error: otpError } = await supabase.auth.verifyOtp({
            type: type as
              | "signup"
              | "email"
              | "recovery"
              | "invite"
              | "magiclink"
              | "email_change",
            token_hash,
          })
          if (otpError) throw otpError
        } else {
          const { data } = await supabase.auth.getUser()
          if (!data.user) {
            router.replace(
              "/login?confirmed=1&msg=" +
                encodeURIComponent(
                  "Connectez-vous avec l’email et le mot de passe de votre inscription."
                )
            )
            return
          }
        }

        if (cancelled) return

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user && type !== "recovery") {
          await supabase
            .from("profiles")
            .update({ email_verified: true })
            .eq("user_id", user.id)
        }

        setStatus("Accès ouvert. Redirection…")
        router.replace(preferredNext)
        router.refresh()
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Impossible d’ouvrir la session depuis ce lien."
        setStatus(message)
        router.replace(
          `/login?error=auth_callback&confirmed=1&msg=${encodeURIComponent(
            `${message} Utilisez « Mot de passe oublié » pour retrouver l’accès.`
          )}`
        )
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary text-white px-6">
      <p className="font-serif text-xl text-center">{status}</p>
    </div>
  )
}
