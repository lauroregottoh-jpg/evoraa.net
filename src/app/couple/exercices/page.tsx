"use client"

import * as React from "react"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { getCoupleReportAction } from "@/app/actions/couple"
import type { CoupleReportDocument } from "@/lib/couple/report"

export default function CoupleExercicesPage() {
  const [doc, setDoc] = React.useState<CoupleReportDocument | null>(null)

  React.useEffect(() => {
    void getCoupleReportAction().then((res) => {
      if (res.report) setDoc(res.report as CoupleReportDocument)
    })
  }, [])

  return (
    <MemberPage>
      <CoupleShell>
        <div className="max-w-2xl space-y-8 pb-12">
          <h1 className="font-serif text-3xl font-bold">Exercices</h1>
          <p className="text-sm text-muted-foreground">
            Imprimables — laissez de l’espace pour écrire. Chaque exercice a un
            objectif, des consignes et un débrief.
          </p>
          {doc?.exercises.map((ex) => (
            <article
              key={ex.id}
              className="rounded-2xl border bg-white/90 p-5 sm:p-6 space-y-3 print:border-black"
            >
              <h2 className="font-serif text-2xl font-bold">
                {ex.title}
                {ex.premiumPlus ? (
                  <span className="ml-2 text-xs font-sans font-semibold text-accent">
                    Premium Plus
                  </span>
                ) : null}
              </h2>
              <Field label="Objectif" body={ex.objective} />
              <Field label="Pourquoi cet exercice" body={ex.why} />
              <Field label="Durée" body={ex.duration} />
              <Field label="Préparation" body={ex.preparation} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Consignes
                </p>
                <ol className="mt-1 list-decimal pl-5 text-sm space-y-1">
                  {ex.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Questions
                </p>
                <ul className="mt-1 list-disc pl-5 text-sm space-y-1">
                  {ex.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
              <div className="min-h-24 rounded-xl border border-dashed border-border/80 bg-[#F8F4EE]/50 p-3 text-xs text-muted-foreground">
                Espace de réponse
              </div>
              <Field label="Mise en commun" body={ex.share} />
              <Field label="Débrief" body={ex.debrief} />
              <Field label="À retenir" body={ex.takeaway} />
              <Field label="Prochaine action" body={ex.nextAction} />
            </article>
          ))}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold print:hidden"
          >
            Imprimer / PDF
          </button>
        </div>
      </CoupleShell>
    </MemberPage>
  )
}

function Field({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm leading-relaxed">{body}</p>
    </div>
  )
}
