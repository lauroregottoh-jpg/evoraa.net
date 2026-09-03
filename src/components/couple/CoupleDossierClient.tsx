"use client"

import * as React from "react"
import Link from "next/link"
import {
  BookOpen,
  ClipboardList,
  Download,
  FileText,
  Lock,
  Sparkles,
} from "lucide-react"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import { CoupleDeadlineBanner } from "@/components/couple/CoupleDeadlineBanner"
import { CouplePaywallOverlay } from "@/components/couple/CouplePaywallOverlay"
import { CoupleHeroCard } from "@/components/couple/CoupleHeroCard"
import { getMyCoupleStateAction, getCoupleReportAction } from "@/app/actions/couple"
import { cn } from "@/utils/cn"

type Piece = {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
  premiumPlus?: boolean
}

const PIECES: Piece[] = [
  {
    id: "rapport",
    title: "Rapport — chapitres de lecture",
    description:
      "Bienvenue, regard, profils, dynamique… chaque chapitre se lit et se télécharge à part.",
    href: "/couple/rapport",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "convergences",
    title: "Dossier — convergences & forces",
    description:
      "Ce qui vous unit : à ouvrir ensemble quand vous voulez consolider le positif.",
    href: "/couple/rapport",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: "differences",
    title: "Dossier — différences & priorités",
    description:
      "Les écarts et les 3 priorités : un livrable distinct pour les conversations sensibles.",
    href: "/couple/rapport",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "exercices",
    title: "Cahier d’exercices",
    description:
      "Exercices séparés du rapport de lecture — zones à remplir, export imprimable.",
    href: "/couple/exercices",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "plan",
    title: "Plan d’action",
    description:
      "Étapes datées, à télécharger et suivre hors du rapport narratif.",
    href: "/couple/plan",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    id: "telecharger",
    title: "Centre de téléchargements",
    description:
      "Exporter chapitre par chapitre, exercices et plan — sans tout mélanger.",
    href: "/couple/telecharger",
    icon: <Download className="h-5 w-5" />,
  },
]

type Props = { demo?: boolean }

export function CoupleDossierClient({ demo = false }: Props) {
  const [state, setState] = React.useState<
    Awaited<ReturnType<typeof getMyCoupleStateAction>> | null
  >(null)
  const [hasReport, setHasReport] = React.useState(demo)
  const [offerId, setOfferId] = React.useState<string | null>(
    demo ? "couple_premium_plus" : null
  )

  const [needsPurchase, setNeedsPurchase] = React.useState(false)

  React.useEffect(() => {
    if (demo) {
      setOfferId("couple_premium_plus")
      setHasReport(true)
      return
    }
    void getMyCoupleStateAction().then((s) => {
      setState(s)
      if (!("couple" in s) || !s.couple) setNeedsPurchase(true)
    })
    void getCoupleReportAction().then((res) => {
      if (res.report) {
        setHasReport(true)
        setOfferId((res.report as { offerId?: string }).offerId ?? null)
      }
    })
  }, [demo])

  const bothDone =
    demo ||
    (state?.participants?.length === 2 &&
      state.participants.every((p) => p.questionnaire_status === "COMPLETED"))

  const unlocked = demo || (!needsPurchase && bothDone && hasReport)
  const isPP = offerId === "couple_premium_plus" || demo
  const createdAt =
    state && "couple" in state && state.couple
      ? (state.couple as { created_at?: string }).created_at
      : null

  const pieces = [
    ...PIECES,
    ...(isPP
      ? [
          {
            id: "pp",
            title: "Ressources Premium Plus",
            description:
              "Protocole, charte, fiches pratiques — feuilles séparées dans le rapport.",
            href: "/couple/rapport",
            icon: <Sparkles className="h-5 w-5" />,
            premiumPlus: true,
          } satisfies Piece,
        ]
      : []),
  ]

  return (
    <CouplePageFrame>
      <CoupleShell activeHref="/couple/dossier">
        <div className="max-w-2xl space-y-8 pb-16">
          {demo ? (
            <p className="text-xs font-semibold text-[#B8954A]">
              Aperçu démo — Daniel & Naomi · forme du dossier livrable
            </p>
          ) : null}

          <CoupleHeroCard
            eyebrow="Votre dossier"
            title="Composition des livrables"
            body="Rapport enrichi, cahier d’exercices, plan d’action et téléchargements — pour motiver la fin des questionnaires et garder une lecture premium."
            status={
              needsPurchase
                ? "Aperçu — débloquez le bilan pour accéder aux livrables"
                : unlocked
                  ? "Dossier débloqué"
                  : bothDone
                    ? "Analyse en cours — dossier bientôt disponible"
                    : "Verrouillé tant que les deux questionnaires ne sont pas terminés"
            }
          />

          {needsPurchase && !demo ? (
            <CouplePaywallOverlay
              title="Dossier livrables verrouillé"
              body="Rapport, exercices et plan d’action sont séparés pour que vous puissiez télécharger et travailler pièce par pièce. Débloquez le bilan pour ouvrir le dossier."
            >
              <ul className="space-y-3 pointer-events-none">
                {pieces.slice(0, 4).map((p) => (
                  <li
                    key={p.id}
                    className="flex gap-4 rounded-2xl border border-[#A07070]/10 bg-[#F2EBE0]/80 p-5 opacity-80"
                  >
                    <Lock className="h-5 w-5 text-[#A07070]/50" />
                    <div>
                      <p className="font-serif text-lg font-bold">{p.title}</p>
                      <p className="text-sm text-[#A07070]/60">{p.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CouplePaywallOverlay>
          ) : null}

          {!needsPurchase || demo ? (
          <>
          {!demo ? (
            <CoupleDeadlineBanner
              createdAt={createdAt}
              variant={unlocked ? "info" : "warning"}
            />
          ) : (
            <CoupleDeadlineBanner variant="info" />
          )}

          <ul className="space-y-3">
            {pieces.map((p) => {
              const locked = !unlocked
              const inner = (
                <div
                  className={cn(
                    "flex gap-4 rounded-2xl border p-5 transition-colors",
                    locked
                      ? "border-[#A07070]/10 bg-[#F2EBE0]/80 opacity-80"
                      : "border-[#B8954A]/30 bg-white hover:border-[#B8954A]/55"
                  )}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#A07070]/10 text-[#A07070]">
                    {locked ? <Lock className="h-5 w-5" /> : p.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-lg font-bold">{p.title}</p>
                      {p.premiumPlus ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A07070] bg-[#A07070]/10 px-2 py-0.5 rounded-full">
                          Premium Plus
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-[#A07070]/70 leading-relaxed">
                      {p.description}
                    </p>
                    {locked ? (
                      <p className="mt-2 text-xs text-[#A07070]/50">
                        Disponible après questionnaires + génération du rapport
                      </p>
                    ) : (
                      <p className="mt-2 text-xs font-semibold text-[#A07070]">
                        Ouvrir →
                      </p>
                    )}
                  </div>
                </div>
              )
              return (
                <li key={p.id}>
                  {locked ? (
                    inner
                  ) : (
                    <Link href={demo && p.id === "rapport" ? "/couple/rapport/demo" : p.href}>
                      {inner}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          {!unlocked && !demo ? (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/couple/questionnaire"
                className="inline-flex h-11 items-center rounded-xl bg-[#A07070] px-5 text-sm font-semibold text-[#F2EBE0]"
              >
                Continuer le questionnaire
              </Link>
              <Link
                href="/couple/espace"
                className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-semibold"
              >
                Espace couple
              </Link>
            </div>
          ) : null}

          {demo ? (
            <p className="text-sm text-[#A07070]/60">
              <Link href="/couple/rapport/demo" className="font-semibold text-[#A07070] underline">
                Voir le rapport démo →
              </Link>
            </p>
          ) : null}
          </>
          ) : null}
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
