"use client"

import * as React from "react"
import { Download, Lock, Loader2, Unlock } from "lucide-react"
import { CoffreCover } from "@/components/coffre/CoffreCover"
import {
  COFFRE_CATEGORY_META,
  type CoffreResource,
} from "@/lib/coffre/resources"
import { cn } from "@/utils/cn"

type Props = {
  resource: CoffreResource
  locked: boolean
  canUnlock: boolean
  isPaid: boolean
  unlocking?: boolean
  justUnlocked?: boolean
  index: number
  onLockedClick: () => void
  onUnlock: () => void
}

export function CoffreResourceCard({
  resource,
  locked,
  canUnlock,
  isPaid,
  unlocking,
  justUnlocked,
  index,
  onLockedClick,
  onUnlock,
}: Props) {
  const meta = COFFRE_CATEGORY_META[resource.category]

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-[1.25rem] border bg-white/90 shadow-card overflow-hidden",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1.5 hover:shadow-elevated",
        "animate-in fade-in slide-in-from-bottom-3 fill-mode-both",
        locked
          ? "border-border/80 opacity-[0.88]"
          : "border-border/90",
        justUnlocked &&
          "ring-2 ring-accent/50 animate-[coffreUnlock_0.7s_ease-out]"
      )}
      style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
    >
      <div className="relative">
        <CoffreCover resource={resource} locked={locked} />
        {locked && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#A07070]/25 backdrop-blur-[1px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg">
              <Lock className="h-5 w-5" />
            </span>
          </div>
        )}
        {!locked && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
            <Unlock className="h-3 w-3" />
            Ouvert
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="space-y-1.5">
          <span
            className="inline-flex text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: meta.tone }}
          >
            {meta.label}
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-foreground">
            {resource.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {locked && resource.teaser ? resource.teaser : resource.description}
          </p>
          {locked && resource.teaser ? (
            <p className="text-[11px] text-primary/80 font-medium">
              Contenu complet réservé Alliance
            </p>
          ) : null}
        </div>

        <div className="mt-auto pt-1">
          {locked ? (
            isPaid && canUnlock ? (
              <button
                type="button"
                disabled={unlocking}
                onClick={onUnlock}
                className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95 disabled:opacity-60 transition-all"
              >
                {unlocking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
                Débloquer maintenant
              </button>
            ) : (
              <button
                type="button"
                onClick={onLockedClick}
                className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
              >
                <Lock className="h-4 w-4" />
                {isPaid ? "Disponible le prochain mois" : "Débloquer avec Alliance"}
              </button>
            )
          ) : (
            <a
              href={`/coffre-premium/download/${resource.id}`}
              className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-95 transition-opacity"
            >
              <Download className="h-4 w-4" />
              Télécharger
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
