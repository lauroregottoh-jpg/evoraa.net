"use client"

import * as React from "react"
import Link from "next/link"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import {
  getCoupleReportAction,
  getMyCoupleStateAction,
} from "@/app/actions/couple"
import type { CoupleReportDocument } from "@/lib/couple/report"

export default function CoupleResultatsPage() {
  const [doc, setDoc] = React.useState<CoupleReportDocument | null>(null)
  const [score, setScore] = React.useState<number | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    void (async () => {
      const state = await getMyCoupleStateAction()
      if ("scores" in state && state.scores) {
        setScore(Number(state.scores.global_score))
      }
      const res = await getCoupleReportAction()
      if (res.error) setError(res.error)
      else setDoc(res.report as CoupleReportDocument)
    })()
  }, [])

  return (
    <CouplePageFrame>
      <CoupleShell activeHref="/couple/resultats">
        <div className="max-w-2xl space-y-6">
          <h1 className="font-serif text-3xl font-bold">Vos résultats</h1>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {doc && (
            <>
              <div className="rounded-2xl border bg-white/90 p-6 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Score global — indicateur de dynamique
                </p>
                <p className="font-serif text-5xl font-bold text-primary">
                  {score ?? doc.globalScore} %
                </p>
                <h2 className="font-serif text-xl font-bold">
                  {doc.scoreInterpretation.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {doc.scoreInterpretation.paragraph}
                </p>
                {doc.safetyNotice && (
                  <p className="text-sm rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 leading-relaxed">
                    {doc.safetyNotice}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/couple/rapport"
                  className="inline-flex h-10 items-center rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold"
                >
                  Lire le rapport
                </Link>
                <Link
                  href="/couple/exercices"
                  className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
                >
                  Exercices
                </Link>
                <Link
                  href="/couple/plan"
                  className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
                >
                  Plan d’action
                </Link>
                <Link
                  href="/couple/telecharger"
                  className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
                >
                  Télécharger
                </Link>
              </div>
            </>
          )}
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
