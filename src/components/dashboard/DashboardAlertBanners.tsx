"use client"

import * as React from "react"
import Link from "next/link"
import { X, Camera, Crown, ArrowRight } from "lucide-react"
import { cn } from "@/utils/cn"

type Banner = {
  id: string
  title: string
  body: string
  href: string
  cta: string
  tone: "photo" | "upgrade" | "renew" | "profile" | "tests"
}

export function DashboardAlertBanners({ banners }: { banners: Banner[] }) {
  const [dismissed, setDismissed] = React.useState<string[]>([])

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("keliaa_dash_banners")
      if (raw) setDismissed(JSON.parse(raw) as string[])
    } catch {
      /* ignore */
    }
  }, [])

  const dismiss = (id: string) => {
    setDismissed((prev) => {
      const next = [...prev, id]
      localStorage.setItem("keliaa_dash_banners", JSON.stringify(next))
      return next
    })
  }

  const visible = banners.filter((b) => !dismissed.includes(b.id))
  if (visible.length === 0) return null

  return (
    <div className="space-y-3">
      {visible.map((b) => {
        const isGold = b.tone === "photo"
        const isGreen = b.tone === "upgrade" || b.tone === "renew"
        return (
          <div
            key={b.id}
            className={cn(
              "relative rounded-2xl px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between",
              isGold && "bg-[#F7F0E0] border border-accent/40",
              isGreen && "bg-primary text-primary-foreground border border-primary",
              !isGold && !isGreen && "bg-card border border-border"
            )}
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => dismiss(b.id)}
              className={cn(
                "absolute top-2.5 right-2.5 p-1 rounded-full opacity-60 hover:opacity-100",
                isGreen ? "text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-3 min-w-0 pr-6">
              <div
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                  isGold && "bg-accent/25 text-accent-foreground",
                  isGreen && "bg-accent text-accent-foreground",
                  !isGold && !isGreen && "bg-secondary text-primary"
                )}
              >
                {isGold ? <Camera className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm leading-snug">{b.title}</p>
                <p
                  className={cn(
                    "text-xs mt-0.5 leading-relaxed",
                    isGreen ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {b.body}
                </p>
              </div>
            </div>
            <Link
              href={b.href}
              className={cn(
                "shrink-0 inline-flex items-center justify-center rounded-full h-9 px-4 text-xs font-bold",
                isGold || isGreen
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {b.cta} <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
