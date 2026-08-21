"use client"

import * as React from "react"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { CoupleReportView } from "@/components/couple/CoupleReportView"
import { CoupleRequirePaid } from "@/components/couple/CoupleRequirePaid"
import { CoupleHeroCard } from "@/components/couple/CoupleHeroCard"
import { getCoupleReportAction } from "@/app/actions/couple"
import type { CoupleReportDocument } from "@/lib/couple/report"
import Link from "next/link"

export default function CoupleRapportPage() {
  const [doc, setDoc] = React.useState<CoupleReportDocument | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    void getCoupleReportAction().then((res) => {
      if (res.error) setError(res.error)
      else setDoc(res.report as CoupleReportDocument)
      setLoading(false)
    })
  }, [])

  return (
    <CouplePageFrame>
      <CoupleShell activeHref="/couple/rapport">
        <div className="max-w-3xl space-y-6 pb-12">
          <CoupleHeroCard
            eyebrow="Votre rapport"
            title="Chapitres de lecture"
            body="Forces, convergences, différences et priorités — chaque chapitre se lit et se télécharge à part."
            status={
              doc
                ? "Rapport prêt"
                : loading
                  ? "Chargement…"
                  : "En attente du rapport"
            }
          />
          <CoupleRequirePaid
            title="Rapport verrouillé"
            body="Les chapitres (forces, convergences, différences, priorités) s’ouvrent après le paiement du bilan."
            previewTitle="Rapport — chapitres de lecture"
            previewDescription="Chaque chapitre se lit et se télécharge à part."
          >
            {loading && (
              <p className="text-sm text-muted-foreground">
                Chargement du rapport…
              </p>
            )}
            {error && (
              <div className="space-y-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
                <p className="text-sm text-destructive">{error}</p>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez aussi consulter un{" "}
                  <Link
                    href="/couple/rapport/demo"
                    className="font-semibold text-primary underline underline-offset-2"
                  >
                    exemple de rapport démo
                  </Link>
                  .
                </p>
              </div>
            )}
            {doc && <CoupleReportView doc={doc} />}
          </CoupleRequirePaid>
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
