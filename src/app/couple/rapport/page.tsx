"use client"

import * as React from "react"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { getCoupleReportAction } from "@/app/actions/couple"
import type { CoupleReportDocument } from "@/lib/couple/report"

export default function CoupleRapportPage() {
  const [doc, setDoc] = React.useState<CoupleReportDocument | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    void getCoupleReportAction().then((res) => {
      if (res.error) setError(res.error)
      else setDoc(res.report as CoupleReportDocument)
    })
  }, [])

  return (
    <MemberPage>
      <CoupleShell activeHref="/couple/rapport">
        <article className="max-w-3xl mx-auto space-y-10 pb-16">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {doc && (
            <>
              <header className="space-y-2 border-b border-border/50 pb-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  {doc.brand}
                </p>
                <h1 className="font-serif text-4xl font-bold leading-tight">
                  Rapport de couple
                </h1>
                <p className="text-sm text-muted-foreground">
                  {doc.names.nameA} & {doc.names.nameB} · {doc.tagline}
                </p>
              </header>

              {[...doc.sections, ...doc.premiumPlusExtras].map((section) => (
                <section key={section.id} className="space-y-3">
                  <h2 className="font-serif text-2xl font-bold">{section.title}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      className="text-sm sm:text-[15px] leading-relaxed text-foreground/90"
                    >
                      {p}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-foreground/90">
                      {section.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              <p className="text-[11px] text-muted-foreground pt-6 border-t">
                Versions — questionnaire {doc.versions.questionnaire_version} ·
                scoring {doc.versions.scoring_version} · contenu{" "}
                {doc.versions.content_version} · rapport{" "}
                {doc.versions.report_version} · offre {doc.versions.offer}
              </p>
            </>
          )}
        </article>
      </CoupleShell>
    </MemberPage>
  )
}
