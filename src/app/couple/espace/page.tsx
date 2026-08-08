"use client"

import * as React from "react"
import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { getMyCoupleStateAction } from "@/app/actions/couple"

export default function CoupleEspacePage() {
  const [state, setState] = React.useState<
    Awaited<ReturnType<typeof getMyCoupleStateAction>> | null
  >(null)

  React.useEffect(() => {
    void getMyCoupleStateAction().then(setState)
  }, [])

  return (
    <MemberPage>
      <CoupleShell activeHref="/couple/espace">
        {!state ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : "error" in state && state.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : !state.couple ? (
          <div className="space-y-4 max-w-lg">
            <h1 className="font-serif text-3xl font-bold">Aucun bilan actif</h1>
            <p className="text-sm text-muted-foreground">
              Achetez un bilan ou rejoignez celui de votre partenaire.
            </p>
            <div className="flex gap-3">
              <Link
                href="/couple/offre"
                className="inline-flex h-10 items-center rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold"
              >
                Voir les offres
              </Link>
              <Link
                href="/couple/rejoindre"
                className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
              >
                Entrer un code
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            <header className="space-y-1">
              <h1 className="font-serif text-3xl font-bold">Votre espace couple</h1>
              <p className="text-sm text-muted-foreground">
                Code couple {state.couple.public_code} · statut{" "}
                <span className="font-medium text-foreground">
                  {state.couple.status}
                </span>
              </p>
            </header>

            <section className="rounded-2xl border border-border/70 bg-white/80 p-5 space-y-3">
              <h2 className="font-serif text-xl font-bold">Où vous en êtes</h2>
              <ul className="space-y-2 text-sm">
                {(state.participants || []).map((p) => (
                  <li key={p.id} className="flex justify-between gap-3">
                    <span>
                      Place {p.seat}
                      {p.display_name ? ` — ${p.display_name}` : ""}
                      {state.me?.participantId === p.id ? " (vous)" : ""}
                    </span>
                    <span className="text-muted-foreground">
                      {p.questionnaire_status}
                    </span>
                  </li>
                ))}
              </ul>
              {(state.participants?.length || 0) < 2 && (
                <p className="text-xs text-muted-foreground">
                  En attente du partenaire —{" "}
                  <Link href="/couple/inviter" className="underline text-primary">
                    inviter
                  </Link>
                </p>
              )}
            </section>

            <div className="flex flex-wrap gap-2">
              <Link
                href="/couple/questionnaire"
                className="inline-flex h-10 items-center rounded-xl bg-primary text-primary-foreground px-4 text-sm font-semibold"
              >
                {state.me?.questionnaireStatus === "COMPLETED"
                  ? "Questionnaire terminé"
                  : "Continuer le questionnaire"}
              </Link>
              {state.report && (
                <>
                  <Link
                    href="/couple/resultats"
                    className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
                  >
                    Résultats
                  </Link>
                  <Link
                    href="/couple/rapport"
                    className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
                  >
                    Rapport
                  </Link>
                </>
              )}
              {!state.report &&
                state.me?.questionnaireStatus === "COMPLETED" && (
                  <Link
                    href="/couple/attente"
                    className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-semibold"
                  >
                    Voir l’attente
                  </Link>
                )}
            </div>
          </div>
        )}
      </CoupleShell>
    </MemberPage>
  )
}
