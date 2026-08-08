"use client"

import * as React from "react"
import Link from "next/link"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { getMyCoupleStateAction } from "@/app/actions/couple"

export default function CoupleAttentePage() {
  const [state, setState] = React.useState<
    Awaited<ReturnType<typeof getMyCoupleStateAction>> | null
  >(null)

  React.useEffect(() => {
    void getMyCoupleStateAction().then(setState)
    const t = window.setInterval(() => {
      void getMyCoupleStateAction().then(setState)
    }, 8000)
    return () => window.clearInterval(t)
  }, [])

  const reportReady = Boolean(state && "report" in state && state.report)
  const both =
    state &&
    "participants" in state &&
    (state.participants || []).length === 2 &&
    (state.participants || []).every((p) => p.questionnaire_status === "COMPLETED")

  return (
    <CouplePageFrame>
      <CoupleShell>
        <div className="max-w-lg space-y-4 py-6">
          <h1 className="font-serif text-3xl font-bold">
            {reportReady
              ? "Votre rapport est prêt"
              : both
                ? "Analyse en cours"
                : "En attente"}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {reportReady
              ? "Les deux questionnaires sont terminés et le dossier a été généré."
              : both
                ? "Nous croisons vos profils pour rédiger votre bilan. Cela ne prend que quelques instants."
                : "Votre questionnaire est enregistré. Dès que votre partenaire a terminé le sien, l’analyse se lance automatiquement."}
          </p>
          {state && "participants" in state && (
            <ul className="text-sm space-y-1">
              {(state.participants || []).map((p) => (
                <li key={p.id}>
                  Place {p.seat} : {p.questionnaire_status}
                </li>
              ))}
            </ul>
          )}
          {reportReady ? (
            <Link
              href="/couple/resultats"
              className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold"
            >
              Voir les résultats
            </Link>
          ) : (
            <Link
              href="/couple/espace"
              className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
            >
              Retour à l’espace
            </Link>
          )}
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
