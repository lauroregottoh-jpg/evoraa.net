"use client"

import Script from "next/script"

/**
 * Lightweight funnel analytics.
 * Set ONE of:
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
 * - NEXT_PUBLIC_PLAUSIBLE_DOMAIN=evoraa-net.vercel.app
 */
export function AnalyticsScripts() {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  if (gaId) {
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { anonymize_ip: true });
          `}
        </Script>
      </>
    )
  }

  if (plausible) {
    return (
      <Script
        defer
        data-domain={plausible}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    )
  }

  return null
}

export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void
  }
  if (typeof w.gtag === "function") {
    w.gtag("event", name, props || {})
  }
  if (typeof w.plausible === "function") {
    w.plausible(name, props ? { props } : undefined)
  }
}
