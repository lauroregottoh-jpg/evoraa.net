"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

/**
 * Sur la home (et pages marketing) : récupère les retours Auth
 * (?code= PKCE ou #access_token) et envoie vers le bon handler,
 * au lieu de laisser l’utilisateur bloqué sur l’accueil.
 */
export function AuthHashCatcher() {
  const router = useRouter()

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const url = new URL(window.location.href)
    const code = url.searchParams.get("code")
    const error =
      url.searchParams.get("error_description") ||
      url.searchParams.get("error")
    const nextRaw = url.searchParams.get("next")
    const next =
      nextRaw && nextRaw.startsWith("/") ? nextRaw : "/onboarding"

    // Flux PKCE OAuth (Google) : souvent renvoyé sur Site URL avec ?code=
    if (code || error) {
      const qs = new URLSearchParams()
      if (code) qs.set("code", code)
      if (error) qs.set("error", error)
      qs.set("next", next)
      router.replace(`/auth/callback?${qs.toString()}`)
      return
    }

    const hash = window.location.hash.replace(/^#/, "")
    if (!hash) return
    const params = new URLSearchParams(hash)
    if (
      !params.get("access_token") &&
      !params.get("refresh_token") &&
      !params.get("error") &&
      !params.get("error_description")
    ) {
      return
    }

    const type = params.get("type")
    const dest =
      type === "recovery" || type === "invite"
        ? "/reset-password"
        : `/auth/finish?next=${encodeURIComponent(next)}`
    router.replace(`${dest}${window.location.hash}`)
  }, [router])

  return null
}
