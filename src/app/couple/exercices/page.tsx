"use client"

import * as React from "react"
import Link from "next/link"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { CoupleExercisesWorkbook } from "@/components/couple/CoupleExercisesWorkbook"
import { getCoupleReportAction } from "@/app/actions/couple"
import { buildDemoCoupleReport } from "@/lib/couple/demoReport"
import type { CoupleReportDocument } from "@/lib/couple/report"

export default function CoupleExercicesPage() {
  const [doc, setDoc] = React.useState<CoupleReportDocument | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    void getCoupleReportAction().then((res) => {
      if (res.report) setDoc(res.report as CoupleReportDocument)
      setLoading(false)
    })
  }, [])

  return (
    <CouplePageFrame>
      <CoupleShell activeHref="/couple/exercices">
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : doc ? (
          <CoupleExercisesWorkbook doc={doc} />
        ) : (
          <div className="max-w-xl space-y-4">
            <h1 className="font-serif text-3xl font-bold">Cahier d’exercices</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le cahier se débloque lorsque votre rapport est prêt. En attendant,
              vous pouvez voir la forme sur la démo publique.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/couple/dossier"
                className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
              >
                Voir le dossier
              </Link>
              <Link
                href="/couple/rapport/demo"
                className="inline-flex h-10 items-center rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold"
              >
                Aperçu démo
              </Link>
              <button
                type="button"
                onClick={() => setDoc(buildDemoCoupleReport("couple_premium_plus"))}
                className="inline-flex h-10 items-center rounded-xl border border-[#B8954A]/40 px-4 text-sm font-semibold text-[#5C1F28]"
              >
                Prévisualiser le cahier
              </button>
            </div>
          </div>
        )}
      </CoupleShell>
    </CouplePageFrame>
  )
}
