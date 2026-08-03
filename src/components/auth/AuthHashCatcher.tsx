"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

/**
 * Place on marketing pages (/, etc.) so Auth links that land on Site URL
 * with #access_token=… still open a session instead of looking "broken".
 */
export function AuthHashCatcher() {
  const router = useRouter()

  React.useEffect(() => {
    if (typeof window === "undefined") return
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
    const next =
      type === "recovery" || type === "invite"
        ? "/reset-password"
        : "/auth/finish"
    router.replace(`${next}${window.location.hash}`)
  }, [router])

  return null
}
