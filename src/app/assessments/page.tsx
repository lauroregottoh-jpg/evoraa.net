import Link from "next/link"
import { MemberPage } from "@/components/layout/MemberPage"
import { getAssessmentsProgress } from "@/app/actions/assessments"
import { listIncomingAssessmentInvites } from "@/app/actions/assessmentInvites"
import { PillarBadges } from "@/components/assessments/PillarBadges"
import { AssessmentPillarCards } from "@/components/assessments/AssessmentPillarCards"
import { DiscoveryAssessmentCards } from "@/components/rapport/DiscoveryAssessmentCards"
import { buildLivingPersonalizedReport } from "@/lib/rapport/personalized/buildLivingReport"
import { createClient } from "@/utils/supabase/server"
import { getUsageSnapshot } from "@/lib/billing/usage"
import { Crown, Sparkles, KeyRound } from "lucide-react"
import type { AssessmentSlug } from "@/lib/assessments/questionBank"
import { ESSENTIAL_ASSESSMENTS } from "@/lib/rapport/personalized/assessments.catalog"
import { KeliaaTestVideoBlock } from "@/components/community/CommunityMatchingVideoCta"

export const dynamic = "force-dynamic"

export default async function AssessmentsHubPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ progress, allDone, error }, usage, profileRes, incoming] = await Promise.all([
    getAssessmentsProgress(),
    getUsageSnapshot(user?.id),
    user
      ? supabase
          .from("profiles")
          .select("first_name, psychometric_results")
          .eq("user_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    listIncomingAssessmentInvites(),
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

  const discoveryCards = living.cards.map((c) => {
    if (isAlliance) return c
    if (c.state === "done") return c
    if (c.tier === "essential") {
      return { ...c, state: "locked" as const }
    }
    return c
  })

  return (
    <MemberPage>
      <div className="relative space-y-10 py-2 max-w-4xl mx-auto">
        <header className="relative z-10 overflow-hidden rounded-[1.75rem] border border-border bg-[#FCFAF6] p-6 sm:p-8 shadow-card">
          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
              {isAlliance ? "Tests · Matching & Rapport" : "Tests"}
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-primary">
              Choisissez un test
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {isAlliance
                ? "Chaque test Matching alimente aussi votre Rapport Personnalisé."
                : "5 tests de compatibilité pour affiner votre matching."}
            </p>

            {isAlliance ? (
              <div className="rounded-2xl border border-accent/40 bg-accent/10 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-accent" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#A78335]">
                    Progression des 10 clés
                  </p>
                </div>
                <ol className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {ESSENTIAL_ASSESSMENTS.map((a) => {
                    const done =
                      living.cards.find((c) => c.id === a.id)?.state === "done"
                    return (
                      <li
                        key={a.id}
                        className={
                          done
                            ? "rounded-lg border border-accent/50 bg-accent/25 px-2 py-1.5 text-[10px] font-semibold text-foreground"
                            : "rounded-lg border border-border bg-secondary/60 px-2 py-1.5 text-[10px] font-medium text-muted-foreground"
                        }
                      >
                        <span className="text-[#A78335] font-bold">
                          {String(a.order).padStart(2, "0")}
                        </span>{" "}
                        {a.title.replace(
                          /^Personnalité relationnelle$/,
                          "Personnalité"
                        )}
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
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
                >
                  {doneCount === 0
                    ? "Commencer un test →"
                    : `Continuer · ${next.name.replace(/^Compatibilité\s+/i, "")} →`}
                </Link>
              ) : null}
              {!isAlliance ? (
                <Link
                  href="/premium"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-transparent px-5 text-sm font-semibold text-primary"
                >
                  <Crown className="h-4 w-4 text-accent" />
                  Découvrir Premium
                </Link>
              ) : (
                <Link
                  href="/rapport/global"
                  className="inline-flex h-12 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground"
                >
                  Voir mon rapport
                </Link>
              )}
              <p className="text-xs text-muted-foreground">
                Matching {doneCount}/5
                {isAlliance
                  ? ` · Rapport ${living.completenessPercent}%`
                  : ""}
              </p>
            </div>
          </div>
        </header>

        {incoming.invites.length > 0 ? (
          <div className="relative z-10 space-y-3 rounded-[1.35rem] border border-border bg-[#FCFAF6] p-5">
            <p className="font-serif text-lg font-bold text-primary">
              Invitations à un test
            </p>
            <ul className="space-y-2">
              {incoming.invites.map((inv) => (
                <li
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between gap-2 text-sm text-foreground"
                >
                  <span>
                    <strong>{inv.inviterName}</strong> vous invite à faire «{" "}
                    {inv.testTitle} ».
                  </span>
                  <Link
                    href={`/assessments/${inv.testSlug}`}
                    className="inline-flex h-9 items-center rounded-xl bg-primary px-3 text-xs font-bold text-primary-foreground"
                  >
                    Faire ce test
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="relative z-10 rounded-[1.35rem] border border-border bg-[#FCFAF6] p-5 shadow-card">
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

        <section className="relative z-10 space-y-4 rounded-[1.75rem] border border-border bg-[#FCFAF6] p-5 sm:p-7 shadow-card">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Matching
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mt-1 leading-tight text-primary">
              Tests de compatibilité
            </h2>
          </div>
          <AssessmentPillarCards items={[...progress]} />
        </section>

        <section className="relative z-10 space-y-4 rounded-[1.75rem] border border-accent/35 bg-[#FCFAF6] p-5 sm:p-7 shadow-card">
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A78335] inline-flex items-center gap-1.5 flex-wrap">
              <Crown className="h-4 w-4 text-accent" />
              Alliance
              {!isAlliance ? (
                <span className="rounded-full border border-border bg-white px-2 py-0.5 text-[9px] font-bold uppercase text-primary">
                  Aperçu
                </span>
              ) : null}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-foreground">
              Rapport personnalisé
            </h2>
            {!isAlliance ? (
              <Link
                href="/premium"
                className="inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
              >
                Découvrir Premium
              </Link>
            ) : (
              <Link
                href="/rapport/global"
                className="inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-bold text-accent-foreground"
              >
                Ouvrir mon rapport
              </Link>
            )}
          </div>
          <DiscoveryAssessmentCards
            cards={discoveryCards}
            isAlliance={isAlliance}
            kinds={["essential"]}
            showHeaders={false}
          />
        </section>

        <KeliaaTestVideoBlock />

        {/* ——— 3. PREMIUM+ À VENIR (bloc séparé) ——— */}
        <section className="relative z-10 space-y-4 rounded-[1.75rem] border border-dashed border-accent/40 bg-gradient-to-br from-accent/[0.05] via-white to-white p-5 sm:p-7">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent inline-flex items-center gap-1.5">
              <Crown className="h-4 w-4" />
              Premium+ · À venir
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1">
              Analyses approfondies
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Langages d’amour, besoins émotionnels, stress, attachement… Ces
              cartes arriveront bientôt. Elles ne font pas partie des 10 clés du
              Rapport Alliance.
            </p>
          </div>
          <DiscoveryAssessmentCards
            cards={discoveryCards}
            isAlliance={isAlliance}
            kinds={["premium_plus"]}
            showHeaders={false}
          />
        </section>

        {allDone ? (
          <div className="relative z-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800">
            Les cinq tests Matching sont complétés.{" "}
            <Link href="/compatibility" className="underline font-semibold">
              Voir vos compatibilités
            </Link>
            {isAlliance ? (
              <>
                {" · "}
                <Link href="/rapport/global" className="underline font-semibold">
                  Ouvrir le rapport
                </Link>
              </>
            ) : (
              <>
                {" · "}
                <Link href="/premium" className="underline font-semibold">
                  Débloquer le Rapport Alliance
                </Link>
              </>
            )}
          </div>
        ) : null}
      </div>
    </MemberPage>
  )
}
