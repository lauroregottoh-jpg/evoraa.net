"use client"

import * as React from "react"
import Link from "next/link"
import { MemberShell } from "@/components/layout/MemberShell"
import { DailyEditorialCard } from "@/components/dashboard/FarataHomeBlocks"
import { EvaWeeklyReflection } from "@/components/dashboard/EvaWeeklyReflection"
import {
  getBrowsableEditorialPreview,
  getDailyEditorialPack,
} from "@/lib/editorial/library"
import { BookOpen, ChevronDown } from "lucide-react"

export default function InspirationPage() {
  const today = React.useMemo(() => getDailyEditorialPack(), [])
  const preview = React.useMemo(() => getBrowsableEditorialPreview(6), [])
  const [libraryOpen, setLibraryOpen] = React.useState(false)

  return (
    <MemberShell dense>
      <div className="max-w-2xl mx-auto space-y-6 pb-24">
        <header className="space-y-1 px-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary inline-flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Inspiration
          </p>
          <h1 className="font-serif text-3xl font-bold">Conseil du jour</h1>
        </header>

        <DailyEditorialCard item={today.primary} featured />

        <EvaWeeklyReflection />

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setLibraryOpen((v) => !v)}
            className="w-full flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:border-primary/30"
          >
            Bibliothèque d’inspirations
            <ChevronDown
              className={`h-4 w-4 transition-transform ${libraryOpen ? "rotate-180" : ""}`}
            />
          </button>

          {libraryOpen ? (
            <div className="space-y-3">
              {preview.map((item) => (
                <DailyEditorialCard key={item.id} item={item} />
              ))}
              <p className="text-xs text-muted-foreground text-center px-2">
                Quelques contenus tournent chaque semaine. Pour aller plus loin :{" "}
                <Link
                  href="/academie-mariage"
                  className="text-primary font-semibold underline-offset-2 hover:underline"
                >
                  Académie
                </Link>
                .
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </MemberShell>
  )
}
