"use client"

import * as React from "react"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"
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
    <MemberPage>
      <CoupleShell>
        <div className="max-w-2xl space-y-6 pb-12">
          <h1 className="font-serif text-3xl font-bold">Plan d’action</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Des actions concrètes : quoi, comment, quand, dans quel ordre, avec
            quel signal de progression.
          </p>
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
        </div>
      </CoupleShell>
    </MemberPage>
  )
}
