"use client"

import * as React from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback"?: () => void
          theme?: "light" | "dark" | "auto"
        }
      ) => string
      remove: (id: string) => void
    }
  }
}

/**
 * Widget Turnstile — invisible si pas de site key publique.
 */
export function TurnstileField({
  onToken,
}: {
  onToken: (token: string) => void
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || ""
  const ref = React.useRef<HTMLDivElement>(null)
  const widgetId = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!siteKey || !ref.current) return

    let cancelled = false

    function mount() {
      if (cancelled || !ref.current || !window.turnstile) return
      if (widgetId.current) {
        try {
          window.turnstile.remove(widgetId.current)
        } catch {
          /* ignore */
        }
      }
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(""),
        theme: "light",
      })
    }

    const existing = document.querySelector(
      'script[src*="challenges.cloudflare.com/turnstile"]'
    )
    if (window.turnstile) {
      mount()
    } else if (!existing) {
      const s = document.createElement("script")
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
      s.async = true
      s.onload = () => mount()
      document.body.appendChild(s)
    } else {
      existing.addEventListener("load", mount)
    }

    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current)
        } catch {
          /* ignore */
        }
      }
    }
  }, [siteKey, onToken])

  if (!siteKey) return null
  return <div ref={ref} className="flex justify-center my-2" />
}
