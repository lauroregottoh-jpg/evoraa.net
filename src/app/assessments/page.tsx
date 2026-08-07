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
import { Crown, Lock, Sparkles, KeyRound } from "lucide-react"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import { ESSENTIAL_ASSESSMENTS } from "@/lib/rapport/personalized/assessments.catalog"

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
          <div
            aria-hidden
            className="alliance-gold-sweep pointer-events-none absolute inset-0 opacity-35"
          />
          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#F3D9A4]">
              Tests · Matching & Rapport
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Choisissez un test
            </h1>
            <p className="text-sm text-white/85 leading-relaxed max-w-2xl">
              {isAlliance
                ? "Avec Alliance, chaque test compte double : il alimente le Matching et ouvre une clé de votre Rapport Personnalisé (~18 pages). Les 10 clés ci-dessous sont le cœur de votre bilan."
                : "Formule Découverte : les 5 tests de compatibilité. Les 10 clés Alliance du Rapport Personnalisé sont visibles mais verrouillées."}
            </p>

            {isAlliance ? (
              <div className="rounded-2xl border border-[#B8954A]/45 bg-[#B8954A]/15 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-[#F3D9A4]" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#F3D9A4]">
                    Les 10 clés du Rapport Personnalisé Alliance
                  </p>
                </div>
                <p className="text-xs text-white/75 leading-relaxed">
                  Personnalité, communication, conflits, intelligence émotionnelle,
                  valeurs, vision du mariage, projet de vie, spiritualité, finances,
                  famille — chaque clé ouvre un chapitre. Complétez-les pour un
                  rapport premium, section par section.
                </p>
                <ol className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {ESSENTIAL_ASSESSMENTS.map((a) => {
                    const done = living.cards.find((c) => c.id === a.id)?.state === "done"
                    return (
                      <li
                        key={a.id}
                        className={
                          done
                            ? "rounded-lg border border-[#F3D9A4]/50 bg-[#B8954A]/30 px-2 py-1.5 text-[10px] font-semibold text-[#F8F4EE]"
                            : "rounded-lg border border-white/15 bg-white/5 px-2 py-1.5 text-[10px] font-medium text-white/70"
                        }
                      >
                        <span className="text-[#F3D9A4] font-bold">
                          {String(a.order).padStart(2, "0")}
                        </span>{" "}
                        {a.title.replace(/^Personnalité relationnelle$/, "Personnalité")}
                      </li>
                    )
                  })}
                </ol>
              </div>
            ) : null}

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
                  href="/rapport/global"
                  className="inline-flex h-12 items-center rounded-xl border border-[#B8954A]/45 bg-[#B8954A]/20 px-5 text-sm font-semibold text-[#F3D9A4]"
                >
                  Voir mon rapport
                </Link>
              )}
              <p className="text-xs text-white/65">
                Matching {doneCount}/5 · Rapport {living.completenessPercent}% ·
                maj {ASSESSMENT_RETAKE_COOLDOWN_DAYS} j
              </p>
            </div>
          </div>
        </header>

        <div className="relative z-10 rounded-[1.35rem] border border-border/70 bg-gradient-to-br from-white via-secondary/40 to-accent/[0.06] p-5 shadow-card">
          <PillarBadges
            pillars={progress.map((p) => ({
              slug: p.slug,
              completed: p.completed,
            }))}
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
              Accessibles à tous — Matching + plusieurs chapitres du rapport.
            </p>
          </div>
          <AssessmentPillarCards items={[...progress]} />
        </section>

        <section className="relative z-10 space-y-4">
          <div
            className={
              isAlliance
                ? "rounded-2xl border border-[#B8954A]/35 bg-gradient-to-br from-[#B8954A]/12 via-white to-primary/[0.04] p-5 space-y-2"
                : "rounded-2xl border border-accent/25 bg-accent/[0.07] p-5 space-y-2"
            }
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent inline-flex items-center gap-1.5">
              {isAlliance ? (
                <Crown className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
              Formule Alliance
            </p>
            <h2 className="font-serif text-2xl font-bold">
              Les 10 clés · Évaluations du Rapport Personnalisé
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAlliance
                ? "Chaque clé ouvre un chapitre de votre rapport (forces, portrait, communication, spiritualité…). Cliquez pour faire le test Matching lié, puis lisez l’analyse dans Rapport complet."
                : "Ces 10 clés sont le cœur d’Alliance. En Découverte elles restent visibles mais verrouillées — passez Alliance pour les ouvrir."}
            </p>
            {!isAlliance ? (
              <Link
                href="/premium"
                className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
              >
                Passer Alliance pour débloquer →
              </Link>
            ) : (
              <Link
                href="/rapport/global"
                className="inline-flex h-10 items-center rounded-xl border border-[#B8954A]/40 bg-[#B8954A]/15 px-4 text-sm font-bold text-[#7A5F28]"
              >
                Ouvrir mon Rapport Personnalisé →
              </Link>
            )}
          </div>
          <DiscoveryAssessmentCards
            cards={living.cards.map((c) => {
              if (isAlliance) return c
              if (c.state === "done") return c
              if (c.tier === "essential") {
                return { ...c, state: "locked" as const }
              }
              return c
            })}
            isAlliance={isAlliance}
          />
        </section>

        {allDone ? (
          <div className="relative z-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800">
            Les cinq tests Matching sont complétés.{" "}
            <Link href="/compatibility" className="underline font-semibold">
              Voir vos compatibilités
            </Link>
            {" · "}
            <Link href="/rapport/global" className="underline font-semibold">
              Ouvrir le rapport
            </Link>
          </div>
        ) : null}
      </div>
    </MemberPage>
  )
}
