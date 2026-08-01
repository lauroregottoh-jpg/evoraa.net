"use client"

import * as React from "react"
import { Copy, MessageCircle, Share2, Check } from "lucide-react"
import {
  INVITE_MESSAGE,
  buildInviteUrl,
  inviteCodeFromUserId,
} from "@/lib/growth/invite"
import { trackEvent } from "@/components/analytics/AnalyticsScripts"

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
    <section id="invite" className="rounded-2xl border border-accent/30 bg-accent/5 p-5 space-y-3 scroll-mt-24">
      <div className="flex items-center gap-2 text-primary">
        <Share2 className="h-4 w-4" />
        <h2 className="font-serif text-lg font-bold text-foreground">Invitez un ami</h2>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        KELIAA grandit mieux à deux genres équilibrés. Partagez votre lien personnel — chaque
        inscription via ce lien est attribuée à votre invitation.
      </p>
      <p className="text-[11px] font-mono break-all rounded-xl bg-background border border-border px-3 py-2 text-muted-foreground">
        {url}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={whatsapp}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
        >
          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
        </button>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-border bg-background text-xs font-semibold"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copié" : "Copier le lien"}
        </button>
      </div>
    </section>
  )
}
