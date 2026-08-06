"use client"

import * as React from "react"
import { trackEvent } from "@/components/analytics/AnalyticsScripts"
import {
  INVITE_MESSAGE,
  buildInviteUrl,
  inviteCodeFromUserId,
} from "@/lib/growth/invite"

type Network = {
  id: string
  label: string
  href: (url: string, text: string) => string
  className: string
}

const NETWORKS: Network[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: (url, text) =>
      `https://wa.me/?text=${encodeURIComponent(text + url)}`,
    className: "bg-[#25D366] text-white",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    className: "bg-[#1877F2] text-white",
  },
  {
    id: "x",
    label: "X / Twitter",
    href: (url, text) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    className: "bg-foreground text-background",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    className: "bg-[#0A66C2] text-white",
  },
  {
    id: "telegram",
    label: "Telegram",
    href: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    className: "bg-[#229ED9] text-white",
  },
  {
    id: "email",
    label: "E-mail",
    href: (url, text) =>
      `mailto:?subject=${encodeURIComponent("KELIAA — rencontres sérieuses")}&body=${encodeURIComponent(text + url)}`,
    className: "bg-primary text-primary-foreground",
  },
]

/** Recommander l’application — boutons réseaux uniquement. */
export function InviteShareCard({ userId }: { userId: string }) {
  const code = inviteCodeFromUserId(userId)
  const url = buildInviteUrl(code, { utm_medium: "social" })
  const text = INVITE_MESSAGE

  const open = (n: Network) => {
    trackEvent("invite_share", { network: n.id, ref: code })
    window.open(n.href(url, text), "_blank", "noopener,noreferrer")
  }

  return (
    <div id="invite" className="scroll-mt-24 space-y-3 rounded-xl border border-border p-4">
      <h2 className="font-serif text-lg font-bold">Recommander l’application</h2>
      <p className="text-xs text-muted-foreground">
        Partagez KELIAA sur le réseau de votre choix.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {NETWORKS.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => open(n)}
            className={`h-10 rounded-xl text-xs font-bold ${n.className}`}
          >
            {n.label}
          </button>
        ))}
      </div>
    </div>
  )
}
