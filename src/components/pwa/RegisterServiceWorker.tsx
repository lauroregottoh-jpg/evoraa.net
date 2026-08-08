"use client"

import * as React from "react"

/** Enregistre le service worker PWA (shell only). */
export function RegisterServiceWorker() {
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV === "development") return

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[pwa] sw register failed", err)
    })
  }, [])

  return null
}
