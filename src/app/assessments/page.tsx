import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import {
  getAssessmentsProgress,
  getMyGrowthAxes,
  getMyRelationBilan,
} from "@/app/actions/assessments"
import { ASSESSMENT_RETAKE_COOLDOWN_DAYS } from "@/lib/assessments/constants"
import { GrowthAxesCard } from "@/components/assessments/GrowthAxesCard"
import { RelationBilanCard } from "@/components/matching/RelationBilanCard"
import { PillarBadges } from "@/components/assessments/PillarBadges"
import { AssessmentPillarCards } from "@/components/assessments/AssessmentPillarCards"
import { Heart, Sparkles, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AssessmentsHubPage() {
  const [{ progress, allDone, error }, growth, bilan] = await Promise.all([
    getAssessmentsProgress(),
    getMyGrowthAxes(),
    getMyRelationBilan(),
  ])

  const completedAny = progress.some((p) => p.completed)
  const doneCount = progress.filter((p) => p.completed).length
  const next = progress.find((p) => p.canStart && !p.completed) ?? progress.find((p) => p.canStart)

  return (
    <MemberPage>
      <div className="relative space-y-8 py-2 max-w-4xl mx-auto">
        <header className="relative z-10 overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-[#5C1F28] via-[#722F37] to-[#3D141A] p-6 sm:p-8 text-[#F8F4EE] shadow-elevated">
          <div className="relative z-10 space-y-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
              5 piliers · Matching KELIAA
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-tight">
              Tests de compatibilité
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl">
              Avant de retrouver quelqu’un qui partage votre vision, prenez le temps de{" "}
              <strong className="text-white font-semibold">vous découvrir</strong>. Ces cinq
              tests — humaine, spirituelle, relationnelle, projet de vie, valeurs — clarifient
              qui vous êtes, pour que le Matching puisse vous rapprocher de profils vraiment
              alignés.
            </p>

            <ul className="grid sm:grid-cols-3 gap-3 pt-1">
              {[
                {
                  icon: Sparkles,
                  title: "Se découvrir",
                  body: "Clarifiez votre rythme, votre foi, vos besoins.",
                },
                {
                  icon: Heart,
                  title: "Même vision",
                  body: "Le Matching rapproche ceux qui avancent vers le mariage.",
                },
                {
                  icon: Users,
                  title: "Se retrouver",
                  body: "Des suggestions fondées sur la compatibilité, pas le hasard.",
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="h-4 w-4 text-[#F3D9A4]" />
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{item.body}</p>
                  </li>
                )
              })}
            </ul>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {next ? (
                <Link
                  href={`/assessments/${next.slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#B8954A] px-6 text-sm font-bold text-[#1C1412] shadow-lg transition hover:bg-[#C9A85C]"
                >
                  {doneCount === 0
                    ? "Commencer mon premier test →"
                    : allDone
                      ? "Revoir un test →"
                      : `Continuer · ${next.name.replace(/^Compatibilité\s+/i, "")} →`}
                </Link>
              ) : null}
              <p className="text-xs text-white/65">
                {doneCount}/5 complétés · mise à jour tous les{" "}
                {ASSESSMENT_RETAKE_COOLDOWN_DAYS} jours
              </p>
            </div>
          </div>
        </header>

        <div className="relative z-10 rounded-[1.35rem] border border-border/70 bg-gradient-to-br from-white via-secondary/40 to-accent/[0.06] p-5 shadow-card">
          <PillarBadges
            pillars={progress.map((p) => ({ slug: p.slug, completed: p.completed }))}
          />
        </div>

        {error ? (
          <p className="relative z-10 text-sm text-destructive">{error}</p>
        ) : null}

        {allDone ? (
          <div className="relative z-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
            Les cinq tests de compatibilité sont complétés.{" "}
            <Link href="/compatibility" className="underline font-semibold">
              Voir vos suggestions
            </Link>
            {" · "}
            <Link href="/academie-mariage" className="underline font-semibold">
              Académie du mariage
            </Link>
          </div>
        ) : null}

        {completedAny ? (
          <div className="relative z-10">
            <RelationBilanCard report={bilan.report} />
          </div>
        ) : null}
        {completedAny && !bilan.isAlliance ? (
          <div className="relative z-10">
            <GrowthAxesCard axes={growth.axes} />
          </div>
        ) : null}

        <section className="relative z-10 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Les 5 piliers
              </p>
              <h2 className="font-serif text-2xl font-bold">
                Choisissez un test de compatibilité
              </h2>
            </div>
          </div>
          <AssessmentPillarCards items={[...progress]} />
        </section>
      </div>
    </MemberPage>
  )
}
