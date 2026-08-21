"use client"

import * as React from "react"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { CoupleRequirePaid } from "@/components/couple/CoupleRequirePaid"
import { CoupleHeroCard } from "@/components/couple/CoupleHeroCard"
import { getCoupleReportAction } from "@/app/actions/couple"
import type { CoupleReportDocument } from "@/lib/couple/report"

export default function CouplePlanPage() {
  const [doc, setDoc] = React.useState<CoupleReportDocument | null>(null)

  React.useEffect(() => {
    void getCoupleReportAction().then((res) => {
      if (res.report) setDoc(res.report as CoupleReportDocument)
    })
  }, [])

  return (
    <CouplePageFrame>
      <CoupleShell activeHref="/couple/plan">
        <div className="max-w-2xl space-y-6 pb-12">
          <CoupleHeroCard
            eyebrow="Votre plan"
            title="Plan d’action"
            body="Des actions concrètes : quoi, comment, quand, dans quel ordre — un livrable distinct du rapport et des exercices."
            status={
              doc?.actionPlan?.length
                ? `${doc.actionPlan.length} étapes`
                : "Disponible avec le rapport"
            }
          />
          <CoupleRequirePaid
            title="Plan d’action verrouillé"
            body="Le plan d’action est un livrable distinct : étapes datées à télécharger et suivre hors du rapport."
            previewTitle="Plan d’action"
            previewDescription="Quoi, comment, quand — séparé du rapport et des exercices."
          >
            <ol className="space-y-4">
              {doc?.actionPlan.map((step) => (
                <li
                  key={step.order}
                  className="rounded-2xl border bg-white/90 p-5 space-y-2"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Étape {step.order}
                  </p>
                  <h2 className="font-serif text-xl font-bold">{step.what}</h2>
                  <p className="text-sm">
                    <span className="font-semibold">Comment :</span> {step.how}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Quand :</span> {step.when}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Objectif :</span> {step.goal}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Progression :
                    </span>{" "}
                    {step.progressSignal}
                  </p>
                </li>
              ))}
            </ol>
          </CoupleRequirePaid>
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
