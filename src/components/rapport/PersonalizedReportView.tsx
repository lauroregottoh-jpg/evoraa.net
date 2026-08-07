import Link from "next/link"
import { ClipboardList, Crown, Lock, Sparkles } from "lucide-react"
import type { ProfileReport } from "@/lib/matching/report/types"
import { ASSESSMENTS, type AssessmentSlug } from "@/lib/assessments/questionBank"
import { cn } from "@/utils/cn"

const PILLAR_ORDER: AssessmentSlug[] = [
  "personality",
  "spiritual",
  "relationship",
  "couple_life",
  "finances",
]

type Scores = Partial<Record<AssessmentSlug, number | null>>

/** Vue complète du rapport personnalisé Alliance (écran → PDF plus tard). */
export function PersonalizedReportView({
  firstName,
  report,
  scores,
  isAlliance,
  demoLabel,
}: {
  firstName?: string | null
  report: ProfileReport
  scores?: Scores
  isAlliance: boolean
  demoLabel?: string
}) {
  const name = firstName?.trim() || "Membre"

  return (
    <article className="space-y-6 max-w-3xl mx-auto">
      <header className="relative overflow-hidden rounded-[1.75rem] border border-primary/25 bg-gradient-to-br from-[#5C1F28] via-[#722F37] to-[#3D141A] p-6 sm:p-8 text-[#F8F4EE] shadow-elevated">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F3D9A4]">
          Rapport personnalisé KELIAA
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
          {name}, votre lecture Alliance
        </h1>
        <p className="mt-3 text-sm text-white/80 leading-relaxed max-w-xl">
          Synthèse des 5 piliers de compatibilité à partir de vos tests — pour vous
          comprendre avant d’avancer à deux.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {isAlliance ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#B8954A]/50 bg-[#B8954A]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F3D9A4]">
              <Crown className="h-3 w-3" /> Alliance
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              <Lock className="h-3 w-3" /> Aperçu
            </span>
          )}
          {demoLabel ? (
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold">
              {demoLabel}
            </span>
          ) : null}
        </div>
      </header>

      {scores && Object.keys(scores).length > 0 ? (
        <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h2 className="font-serif text-xl font-bold">Vos 5 piliers</h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-3">
            {PILLAR_ORDER.map((slug) => {
              const score = scores[slug]
              const label = ASSESSMENTS[slug]?.name ?? slug
              return (
                <li
                  key={slug}
                  className="rounded-xl border border-border/70 bg-secondary/30 px-4 py-3"
                >
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-serif text-2xl font-bold mt-0.5">
                    {score != null ? `${Math.round(score)}%` : "—"}
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full bg-primary transition-all",
                        score == null && "w-0"
                      )}
                      style={{
                        width: score != null ? `${Math.min(100, Math.max(0, score))}%` : "0%",
                      }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-xl font-bold">Axes prioritaires</h2>
        </div>
        {report.lightTips.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucun axe prioritaire fort pour l’instant — continuez via l’Académie.
          </p>
        ) : (
          <ol className="space-y-3">
            {report.lightTips.map((t, i) => (
              <li
                key={t.id ?? `${t.title}-${i}`}
                className="rounded-xl border border-border/70 p-4 space-y-1.5"
              >
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {[
                    `#${i + 1}`,
                    t.pillarName,
                    t.dimensionLabel,
                    t.score != null ? `${t.score}%` : null,
                    t.scoreBandLabel,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <p className="text-sm font-semibold">{t.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                  {t.advice}
                </p>
                {t.href ? (
                  <Link
                    href={t.href}
                    className="inline-flex text-xs font-bold text-primary underline mt-1"
                  >
                    Module Académie →
                  </Link>
                ) : null}
              </li>
            ))}
          </ol>
        )}
      </section>

      {!isAlliance && report.ctaUpgrade ? (
        <Link
          href={report.ctaUpgrade.href}
          className="flex items-center justify-center h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold"
        >
          {report.ctaUpgrade.label}
        </Link>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          Export PDF : prochainement — cette page est le modèle d’écran livré aux membres
          Alliance.
        </p>
      )}
    </article>
  )
}
