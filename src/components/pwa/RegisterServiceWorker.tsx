"use client"

import * as React from "react"

/** Enregistre le service worker PWA (shell only) + purge anciens caches. */
export function RegisterServiceWorker() {
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV === "development") return

    const boot = async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.update()))
        if ("caches" in window) {
          const keys = await caches.keys()
          await Promise.all(
            keys
              .filter((k) => k.startsWith("keliaa-shell-") && k !== "keliaa-shell-v14")
              .map((k) => caches.delete(k))
          )
        }
        await navigator.serviceWorker.register("/sw.js?v=14")
      } catch (err) {
        console.warn("[pwa] sw register failed", err)
      }
    }

    void boot()
  }, [])

  return null
}
