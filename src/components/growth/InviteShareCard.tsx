"use client"

import * as React from "react"
import { Copy, MessageCircle, Share2, Check } from "lucide-react"
import {
  INVITE_MESSAGE,
  buildInviteUrl,
  inviteCodeFromUserId,
} from "@/lib/growth/invite"
import { trackEvent } from "@/components/analytics/AnalyticsScripts"

/** Compact invite — pas de lien affiché, WhatsApp + copier. */
export function InviteShareCard({ userId }: { userId: string }) {
  const [copied, setCopied] = React.useState(false)
  const code = inviteCodeFromUserId(userId)
  const url = buildInviteUrl(code)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INVITE_MESSAGE + url)
      setCopied(true)
      trackEvent("invite_copy", { ref: code })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  const whatsapp = () => {
    trackEvent("invite_whatsapp", { ref: code })
    window.open(
      `https://wa.me/?text=${encodeURIComponent(INVITE_MESSAGE + url)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  return (
    <div
      id="invite"
      className="scroll-mt-24 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-3 py-2.5"
    >
      <p className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1.5">
        <Share2 className="h-3.5 w-3.5" />
        Inviter un ami
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={whatsapp}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold"
        >
          <MessageCircle className="h-3 w-3" /> WhatsApp
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-border text-[11px] font-semibold"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
    </div>
  )
}
