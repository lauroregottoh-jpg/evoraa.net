"use client"

import * as React from "react"
import Link from "next/link"
import {
  ClipboardList,
  FileText,
  FolderOpen,
  Route,
  Sparkles,
  Users,
} from "lucide-react"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import {
  CoupleDashTile,
  CoupleShell,
} from "@/components/couple/CoupleShell"
import { CoupleDeadlineBanner } from "@/components/couple/CoupleDeadlineBanner"
import { CoupleHeroCard } from "@/components/couple/CoupleHeroCard"
import { CouplePaywallOverlay } from "@/components/couple/CouplePaywallOverlay"
import { getMyCoupleStateAction } from "@/app/actions/couple"

function DashboardGrid({
  locked,
  questionnaireLabel,
  hasReport,
}: {
  locked?: boolean
  questionnaireLabel: string
  hasReport?: boolean
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <CoupleDashTile
        href="/couple/questionnaire"
        title="Questionnaire"
        description="72 questions individuelles et confidentielles — chacun répond de son côté."
        icon={ClipboardList}
        locked={locked}
        accent
        status={questionnaireLabel}
      />
      <CoupleDashTile
        href="/couple/dossier"
        title="Dossier"
        description="Composition des livrables : rapport, exercices, plan — téléchargeables à part."
        icon={FolderOpen}
        locked={locked}
      />
      <CoupleDashTile
        href="/couple/rapport"
        title="Rapport"
        description="Lecture croisée de votre dynamique de couple, chapitre par chapitre."
        icon={FileText}
        locked={locked || !hasReport}
        status={
          locked
            ? "Verrouillé"
            : hasReport
              ? "Prêt"
              : "Disponible après les deux questionnaires"
        }
      />
      <CoupleDashTile
        href="/couple/exercices"
        title="Exercices"
        description="Cahier pratique pour ancrer les prises de conscience du bilan."
        icon={Sparkles}
        locked={locked || !hasReport}
      />
      <CoupleDashTile
        href="/couple/plan"
        title="Plan d’action"
        description="Étapes concrètes pour avancer ensemble après le bilan."
        icon={Route}
        locked={locked || !hasReport}
      />
      <CoupleDashTile
        href="/couple/inviter"
        title="Partenaire"
        description="Inviter ou suivre l’avancement de votre conjoint(e)."
        icon={Users}
        locked={locked}
      />
    </div>
  )
}

/**
 * Tableau de bord client Couple — belle grille de modules + verrous.
 */
export default function CoupleEspacePage() {
  const [state, setState] = React.useState<
    Awaited<ReturnType<typeof getMyCoupleStateAction>> | null
  >(null)

  React.useEffect(() => {
    void getMyCoupleStateAction().then(setState)
  }, [])

  const lockedPreview = (
    <div className="space-y-5">
      <CoupleHeroCard
        eyebrow="Tableau de bord"
        title="Votre espace couple"
        body="Voici ce que vous débloquez après le paiement : questionnaire, dossier, rapport, exercices et plan."
        status="Aperçu — débloquez pour accéder"
      />
      <DashboardGrid locked questionnaireLabel="Verrouillé" hasReport={false} />
    </div>
  )

  return (
    <CouplePageFrame contentWidth="wide">
      <CoupleShell activeHref="/couple/espace" variant="app">
        {!state ? (
          <p className="text-sm text-muted-foreground">Chargement…</p>
        ) : "error" in state && state.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : !state.couple ? (
          <CouplePaywallOverlay
            title="Débloquez votre bilan"
            body="Vous voyez déjà la forme de votre espace. Le paiement (ou un code partenaire) ouvre questionnaire et livrables."
          >
            {lockedPreview}
          </CouplePaywallOverlay>
        ) : (
          <div className="space-y-5">
            <CoupleHeroCard
              eyebrow="Tableau de bord"
              title="Votre espace couple"
              body="Suivez l’avancement à deux et ouvrez chaque module quand vous êtes prêts."
              status={`Code ${state.couple.public_code} · ${state.couple.status}`}
            />

            <CoupleDeadlineBanner
              createdAt={
                (state.couple as { created_at?: string }).created_at ?? null
              }
              variant={
                state.me?.questionnaireStatus === "COMPLETED"
                  ? "info"
                  : "warning"
              }
            />

            <section className="rounded-2xl border border-[#B8954A]/30 bg-[#FBF9F6] p-5 space-y-3">
              <h2 className="font-serif text-xl font-bold text-[#5C1F28]">
                Où vous en êtes
              </h2>
              <ul className="space-y-2 text-sm">
                {(state.participants || []).map((p) => (
                  <li
                    key={p.id}
                    className="flex justify-between gap-3 rounded-xl bg-white border border-[#1C1412]/8 px-3 py-2.5"
                  >
                    <span>
                      Place {p.seat}
                      {p.display_name ? ` — ${p.display_name}` : ""}
                      {state.me?.participantId === p.id ? " (vous)" : ""}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      {p.questionnaire_status === "COMPLETED"
                        ? "Terminé"
                        : p.questionnaire_status}
                    </span>
                  </li>
                ))}
              </ul>
              {(state.participants?.length || 0) < 2 ? (
                <p className="text-xs text-muted-foreground">
                  En attente du partenaire —{" "}
                  <Link
                    href="/couple/inviter"
                    className="underline text-primary font-semibold"
                  >
                    inviter
                  </Link>
                </p>
              ) : null}
            </section>

            <DashboardGrid
              questionnaireLabel={
                state.me?.questionnaireStatus === "COMPLETED"
                  ? "Terminé"
                  : "À poursuivre"
              }
              hasReport={Boolean(state.report)}
            />

            <p className="text-center text-xs text-muted-foreground">
              <Link href="/couple" className="underline">
                Retour à la présentation KELYA Couple
              </Link>
              {" · "}
              <Link href="/couple/offre" className="underline">
                Offres & paiement
              </Link>
            </p>
          </div>
        )}
      </CoupleShell>
    </CouplePageFrame>
  )
}
