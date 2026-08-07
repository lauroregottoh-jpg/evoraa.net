import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { getAssessmentsProgress } from "@/app/actions/assessments"
import { ASSESSMENT_RETAKE_COOLDOWN_DAYS } from "@/lib/assessments/constants"
import { PillarBadges } from "@/components/assessments/PillarBadges"
import { AssessmentPillarCards } from "@/components/assessments/AssessmentPillarCards"
import { DiscoveryAssessmentCards } from "@/components/rapport/DiscoveryAssessmentCards"
import { buildLivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import { createClient } from "@/utils/supabase/server"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { Crown, Lock, Sparkles } from "lucide-react"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"

export const dynamic = "force-dynamic"

export default async function AssessmentsHubPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ progress, allDone, error }, usage, profileRes] = await Promise.all([
    getAssessmentsProgress(),
    getUsageSnapshot(user?.id),
    user
      ? supabase
          .from("profiles")
          .select("first_name, psychometric_results")
          .eq("user_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const isAlliance = Boolean(usage?.isPaid)
  const psych = profileRes.data?.psychometric_results as {
    personality?: number | null
    spiritual?: number | null
    relationship?: number | null
    couple_life?: number | null
    finances?: number | null
    dimensions?: Partial<Record<AssessmentSlug, Record<string, number>>>
  } | null

  const living = buildLivingPersonalizedReport({
    firstName: profileRes.data?.first_name,
    psychometric: psych,
    isAlliance,
  })

  const doneCount = progress.filter((p) => p.completed).length
  const next =
    progress.find((p) => p.canStart && !p.completed) ??
    progress.find((p) => p.canStart)

  return (
    <MemberPage>
      <div className="relative space-y-8 py-2 max-w-4xl mx-auto">
        <header className="relative z-10 overflow-hidden rounded-[1.75rem] border border-primary/20 bg-gradient-to-br from-[#5C1F28] via-[#722F37] to-[#3D141A] p-6 sm:p-8 text-[#F8F4EE] shadow-elevated">
          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
              Tests · Matching & Rapport
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Choisissez un test
            </h1>
            <p className="text-sm text-white/85 leading-relaxed max-w-2xl">
              {isAlliance
                ? "Formule Alliance : les 5 tests Matching restent le socle. Les évaluations enrichies sont visibles et débloquées pour votre Rapport Personnalisé."
                : "Formule Découverte : commencez par les 5 tests de compatibilité. Les évaluations Alliance sont visibles mais verrouillées — elles s’ouvrent avec Alliance."}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {next ? (
                <Link
                  href={`/assessments/${next.slug}`}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-[#B8954A] px-6 text-sm font-bold text-[#1C1412]"
                >
                  {doneCount === 0
                    ? "Commencer un test de compatibilité →"
                    : `Continuer · ${next.name.replace(/^Compatibilité\s+/i, "")} →`}
                </Link>
              ) : null}
              {!isAlliance ? (
                <Link
                  href="/premium"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 text-sm font-semibold"
                >
                  <Crown className="h-4 w-4 text-[#F3D9A4]" />
                  Débloquer les tests Alliance
                </Link>
              ) : (
                <Link
                  href="/rapport"
                  className="inline-flex h-12 items-center rounded-xl border border-white/25 bg-white/10 px-5 text-sm font-semibold"
                >
                  Voir mon rapport
                </Link>
              )}
              <p className="text-xs text-white/65">
                Matching {doneCount}/5 · maj tous les {ASSESSMENT_RETAKE_COOLDOWN_DAYS} j
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

        <section className="relative z-10 space-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Formule Découverte
            </p>
            <h2 className="font-serif text-2xl font-bold">
              Tests de compatibilité (5 piliers)
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Accessibles à tous — alimentent le Matching et plusieurs chapitres du
              rapport.
            </p>
          </div>
          <AssessmentPillarCards items={[...progress]} />
        </section>

        <section className="relative z-10 space-y-4">
          <div className="rounded-2xl border border-accent/25 bg-accent/[0.07] p-5 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent inline-flex items-center gap-1.5">
              {isAlliance ? (
                <Crown className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              Formule Alliance
            </p>
            <h2 className="font-serif text-2xl font-bold">
              Évaluations enrichies du Rapport Personnalisé
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAlliance
                ? "Cartes débloquées : chaque évaluation ouvre une nouvelle partie de votre rapport. Les questionnaires dédiés arriveront progressivement — les clés Matching déjà complétées enrichissent déjà plusieurs chapitres."
                : "Cartes visibles mais verrouillées en Découverte. Avec Alliance, elles s’ouvrent pour enrichir votre bilan relationnel complet."}
            </p>
            {!isAlliance ? (
              <Link
                href="/premium"
                className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
              >
                Passer Alliance pour débloquer →
              </Link>
            ) : null}
          </div>
          <DiscoveryAssessmentCards
            cards={living.cards.filter((c) => c.tier !== "essential")}
            showComplementary
          />
        </section>

        {allDone ? (
          <div className="relative z-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800">
            Les cinq tests Matching sont complétés.{" "}
            <Link href="/compatibility" className="underline font-semibold">
              Voir vos compatibilités
            </Link>
            {" · "}
            <Link href="/rapport" className="underline font-semibold">
              Ouvrir le rapport
            </Link>
          </div>
        ) : null}
      </div>
    </MemberPage>
  )
}
