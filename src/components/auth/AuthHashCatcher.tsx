"use client"

import * as React from "react"

/**
 * Sur la home : si retour Auth (?code= Google / #token), bascule IMMÉDIATEMENT
 * vers le handler — évite 10 s bloqué sur l’accueil.
 */
export function AuthHashCatcher() {
  const [pending, setPending] = React.useState(false)

  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return

    const url = new URL(window.location.href)
    // Ne jamais intercepter /login|/register (évite boucle auth_callback).
    if (
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/register") ||
      url.pathname.startsWith("/auth/")
    ) {
      return
    }

    const code = url.searchParams.get("code")
    const error =
      url.searchParams.get("error_description") ||
      url.searchParams.get("error")
    const nextRaw = url.searchParams.get("next")
    const next =
      nextRaw && nextRaw.startsWith("/") ? nextRaw : "/onboarding"

    if (code) {
      setPending(true)
      const qs = new URLSearchParams()
      qs.set("code", code)
      qs.set("next", next)
      window.location.replace(`/auth/finish?${qs.toString()}`)
      return
    }

    if (error && (url.pathname === "/" || url.pathname === "")) {
      setPending(true)
      const qs = new URLSearchParams()
      qs.set("error", error)
      qs.set("next", next)
      window.location.replace(`/auth/finish?${qs.toString()}`)
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

    setPending(true)
    const type = params.get("type")
    const dest =
      type === "recovery" || type === "invite"
        ? `/reset-password${window.location.hash}`
        : `/auth/finish?next=${encodeURIComponent(next)}${window.location.hash}`
    window.location.replace(dest)
  }, [])

  if (!pending) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary text-white px-6">
      <p className="font-serif text-xl text-center">
        Connexion en cours… ouverture de votre espace
      </p>
    </div>
  )
}
