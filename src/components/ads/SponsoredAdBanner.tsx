"use client"

import * as React from "react"
import Link from "next/link"
import type { AdSlot } from "@/lib/admin/cms"

/** Bannière pub membre — consomme un AdSlot CMS. */
export function SponsoredAdBanner({ ad }: { ad: AdSlot }) {
  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
        Partenaire
      </p>
      <p className="font-serif text-lg font-bold text-foreground">{ad.title}</p>
      {ad.body ? (
        <p className="text-sm text-muted-foreground leading-relaxed">{ad.body}</p>
      ) : null}
      {ad.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ad.imageUrl}
          alt=""
          className="w-full max-h-40 object-cover rounded-xl border border-border"
        />
      ) : null}
      {ad.href && ad.href !== "#" ? (
        <Link
          href={ad.href}
          className="inline-flex text-sm font-semibold text-primary underline"
          target={ad.href.startsWith("http") ? "_blank" : undefined}
          rel={ad.href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {ad.ctaLabel || "En savoir plus"} →
        </Link>
      ) : null}
    </div>
  )
}
