"use client"

import * as React from "react"
import { MemberShell } from "@/components/layout/MemberShell"
import { DailyEditorialCard } from "@/components/dashboard/FarataHomeBlocks"
import { EvaWeeklyReflection } from "@/components/dashboard/EvaWeeklyReflection"
import { getDailyEditorialPack } from "@/lib/editorial/library"
import { BookOpen } from "lucide-react"

export default function InspirationPage() {
  const today = React.useMemo(() => getDailyEditorialPack(), [])

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
      </div>
    </MemberShell>
  )
}
