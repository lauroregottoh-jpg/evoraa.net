"use client"

import * as React from "react"
import Link from "next/link"
import { MemberShell } from "@/components/layout/MemberShell"
import { DailyEditorialCard } from "@/components/dashboard/FarataHomeBlocks"
import {
  EDITORIAL_FILTERS,
  getBrowsableEditorialPreview,
  getDailyEditorialPack,
  type EditorialCategory,
} from "@/lib/editorial/library"
import { cn } from "@/utils/cn"
import { BookOpen, Sparkles, Lock } from "lucide-react"

export default function InspirationPage() {
  const today = React.useMemo(() => getDailyEditorialPack(), [])
  const preview = React.useMemo(() => getBrowsableEditorialPreview(12), [])
  const [filter, setFilter] = React.useState<EditorialCategory | "all">("all")

  const items = React.useMemo(() => {
    if (filter === "all") return preview
    return preview.filter((i) => i.category === filter)
  }, [filter, preview])

  return (
    <MemberShell dense>
      <div className="max-w-3xl mx-auto space-y-6 pb-24">
        <header className="space-y-2 px-1 pt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Inspiration
          </p>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Inspiration du jour
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Chaque jour, un contenu nouveau vous est proposé. Ci-dessous, un aperçu limité
            (environ une douzaine) — le reste se découvre au fil des jours, pour garder chaque
            lecture utile.
          </p>
        </header>

        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Aujourd&apos;hui pour vous</h2>
          </div>
          <DailyEditorialCard item={today.primary} featured />
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-1">
            <h2 className="font-serif text-xl font-bold">Aperçu</h2>
            <p className="text-xs text-muted-foreground">{items.length} contenus ouverts</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
            {EDITORIAL_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors",
                  filter === f.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <DailyEditorialCard key={item.id} item={item} />
            ))}
          </div>

          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 px-4 py-5 text-center space-y-2">
            <Lock className="h-4 w-4 mx-auto text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">Le reste arrive au fil des jours</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
              Revenez demain pour un nouveau contenu. Pour aller plus loin dans la préparation :
              Académie du mariage.
            </p>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground px-4">
          Envie d&apos;aller plus loin ?{" "}
          <Link href="/academie-mariage" className="text-primary font-semibold underline-offset-2 hover:underline">
            Académie du mariage
          </Link>
          {" · "}
          <Link href="/help" className="text-primary font-semibold underline-offset-2 hover:underline">
            Parler à EVA
          </Link>
        </p>
      </div>
    </MemberShell>
  )
}
