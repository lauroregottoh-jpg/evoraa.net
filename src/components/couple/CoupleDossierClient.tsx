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
    title: "Rapport chapitres",
    description: "Lecture type dossier — slides, sous-titres, graphiques A/B.",
    href: "/couple/rapport",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "exercices",
    title: "Cahier d’exercices",
    description: "Cartes ludiques, zones à remplir, jeux de rôle, export.",
    href: "/couple/exercices",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "plan",
    title: "Plan d’action",
    description: "Étapes datées pour mettre le bilan en mouvement.",
    href: "/couple/plan",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    id: "telecharger",
    title: "Téléchargements",
    description: "HTML / impression soignée de vos livrables.",
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

  React.useEffect(() => {
    if (demo) {
      setOfferId("couple_premium_plus")
      setHasReport(true)
      return
    }
    void getMyCoupleStateAction().then(setState)
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

  const unlocked = demo || (bothDone && hasReport)
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

          <header className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#5C1F28] via-[#3D1519] to-[#1C1412] p-7 sm:p-9 text-[#FBF9F6]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
              Votre dossier
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Composition des livrables
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
              Rapport enrichi, cahier d’exercices, plan d’action et
              téléchargements — pour motiver la fin des questionnaires et garder
              une lecture premium.
            </p>
            <p className="mt-4 text-xs text-white/55">
              {unlocked
                ? "Dossier débloqué"
                : bothDone
                  ? "Analyse en cours — dossier bientôt disponible"
                  : "Verrouillé tant que les deux questionnaires ne sont pas terminés"}
            </p>
          </header>

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
                      ? "border-[#1C1412]/10 bg-[#F8F4EE]/80 opacity-80"
                      : "border-[#B8954A]/30 bg-white hover:border-[#B8954A]/55"
                  )}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5C1F28]/10 text-[#5C1F28]">
                    {locked ? <Lock className="h-5 w-5" /> : p.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-serif text-lg font-bold">{p.title}</p>
                      {p.premiumPlus ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C1F28] bg-[#5C1F28]/10 px-2 py-0.5 rounded-full">
                          Premium Plus
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-[#1C1412]/70 leading-relaxed">
                      {p.description}
                    </p>
                    {locked ? (
                      <p className="mt-2 text-xs text-[#1C1412]/50">
                        Disponible après questionnaires + génération du rapport
                      </p>
                    ) : (
                      <p className="mt-2 text-xs font-semibold text-[#5C1F28]">
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
                className="inline-flex h-11 items-center rounded-xl bg-[#5C1F28] px-5 text-sm font-semibold text-[#FBF9F6]"
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
            <p className="text-sm text-[#1C1412]/60">
              <Link href="/couple/rapport/demo" className="font-semibold text-[#5C1F28] underline">
                Voir le rapport démo →
              </Link>
            </p>
          ) : null}
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
