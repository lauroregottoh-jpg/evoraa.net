import Link from "next/link"
import { MemberShell } from "@/components/layout/MemberShell"
import { getDashboardData } from "@/app/actions/dashboard"
import { Button } from "@/components/ui/button"
import { DashboardAlertBanners } from "@/components/dashboard/DashboardAlertBanners"
import { ProfileProgressHero } from "@/components/dashboard/ProfileProgressHero"
import { SelectionGrid, SelectionHeader } from "@/components/dashboard/SelectionGrid"
import {
  AcademyTeaser,
  CoachFab,
  DailyQuotaCard,
  DailyEditorialCard,
  QuickAccessGrid,
} from "@/components/dashboard/FarataHomeBlocks"
import { EvaWeeklyReflection } from "@/components/dashboard/EvaWeeklyReflection"
import { PresenceStreak } from "@/components/dashboard/PresenceStreak"
import { PillarBadges } from "@/components/assessments/PillarBadges"
import { InviteShareCard } from "@/components/growth/InviteShareCard"
import { getMyRelationBilan } from "@/app/actions/assessments"
import { RelationBilanCard } from "@/components/matching/RelationBilanCard"

export default async function DashboardPage() {
  const [{ data, error }, bilan] = await Promise.all([
    getDashboardData(),
    getMyRelationBilan(),
  ])

  if (error || !data) {
    return (
      <MemberShell>
        <div className="py-10 space-y-4 max-w-lg">
          <p className="text-sm text-destructive">{error || "Espace indisponible."}</p>
          <Link href="/login">
            <Button variant="outline" className="rounded-xl">
              Se connecter
            </Button>
          </Link>
        </div>
      </MemberShell>
    )
  }

  const { usage } = data
  const banners = data.nextSteps
    .filter(
      (s) =>
        s.tone === "photo" ||
        s.tone === "upgrade" ||
        s.tone === "renew" ||
        s.tone === "tests" ||
        s.tone === "profile"
    )
    .map((s) => ({
      id: s.id,
      title: s.title,
      body: s.body,
      href: s.href,
      cta: s.cta,
      tone: s.tone,
    }))

  return (
    <MemberShell
      firstName={data.firstName}
      planLabel={usage.planName}
      isPaid={usage.isPaid}
      completionPercentage={data.completionPercentage}
      hasAvatar={data.hasAvatar}
      assessmentsDone={data.assessmentsDone}
      assessmentsTotal={data.assessmentsTotal}
      renewSoon={usage.renewSoon}
      daysRemaining={usage.daysRemaining}
      trialDaysRemaining={usage.trialDaysRemaining}
      isTrialBoost={usage.isTrialBoost}
    >
      <div className="space-y-5 max-w-3xl mx-auto pb-24">
        <DashboardAlertBanners banners={banners} />

        <ProfileProgressHero
          firstName={data.firstName}
          completion={data.completionPercentage}
          hasAvatar={data.hasAvatar}
          isVerified={data.isVerified}
        />

        {data.assessmentsDone > 0 && bilan.report ? (
          <RelationBilanCard report={bilan.report} compact />
        ) : null}

        <Link
          href="/feedback"
          className="block rounded-2xl border border-primary/20 bg-primary/5 p-4 hover:border-primary/40 transition-colors"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Améliorez Keliaa avec nous
          </p>
          <p className="font-serif text-lg font-bold mt-1">
            Difficultés, plaintes ou idées ?
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Plus vous nous écrivez, plus vite nous corrigeons l’inscription, les
            questionnaires et l’expérience sur mobile. Vos retours vont
            directement à l’équipe.
          </p>
          <span className="inline-block mt-2 text-xs font-bold text-primary">
            Envoyer un avis →
          </span>
        </Link>

        <div className="px-1">
          <PresenceStreak />
        </div>

        <section className="space-y-3">
          <SelectionHeader
            title={data.selectionTitle}
            subtitle={data.selectionSubtitle}
          />
          <SelectionGrid items={data.topSuggestions} />
        </section>

        {data.sponsoredAds.length > 0 && (
          <div className="space-y-3">
            {data.sponsoredAds.map((ad) => (
              <Link
                key={ad.id}
                href={ad.href || "#"}
                className="block rounded-2xl border border-border bg-secondary/40 p-4 hover:border-primary/30 transition-colors"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Partenaire
                </p>
                <p className="font-semibold text-sm mt-1">{ad.title}</p>
                {ad.body ? (
                  <p className="text-xs text-muted-foreground mt-1">{ad.body}</p>
                ) : null}
                <span className="inline-block mt-2 text-xs font-bold text-primary">
                  {ad.ctaLabel} →
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3 px-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Astuce relationnelle
            </p>
            <Link
              href="/inspiration"
              className="text-xs font-semibold text-primary hover:underline underline-offset-2"
            >
              Voir plus →
            </Link>
          </div>
          <DailyEditorialCard item={data.dailyPrimary} featured />
        </div>

        {!data.hasAvatar || data.assessmentsDone < 5 ? (
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Message d’Eva
            </p>
            <p className="text-sm font-bold text-foreground">
              {data.assessmentsDone < 5
                ? "Sans Matching, pas de rencontre juste"
                : "Devenez visible dès maintenant"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.assessmentsDone < 5
                ? `${data.firstName ? `${data.firstName}, v` : "V"}otre profil est à ${data.completionPercentage}% (${data.assessmentsDone}/5 questionnaires). Sans les tests, je ne peux pas bien vous orienter vers quelqu’un qui partage votre foi et votre projet.`
                : "Ajoutez une photo claire : sans portrait, vous restez difficile à découvrir pour les profils compatibles."}
            </p>
            <Link
              href={data.assessmentsDone < 5 ? "/assessments" : "/profile"}
              className="flex items-center justify-center w-full rounded-xl bg-primary text-primary-foreground h-11 text-sm font-semibold"
            >
              {data.assessmentsDone < 5
                ? "Compléter mes questionnaires →"
                : "Ajouter ma photo →"}
            </Link>
          </div>
        ) : null}

        <EvaWeeklyReflection />

        <QuickAccessGrid
          unreadMessages={data.unreadMessages}
          social={data.social}
          isPaid={usage.isPaid}
        />

        <InviteShareCard userId={data.userId} />

        <DailyQuotaCard usage={usage} />

        <div className="rounded-2xl border border-border bg-card p-5">
          <PillarBadges
            pillars={data.assessmentProgress.map((p) => ({
              slug: p.slug,
              completed: p.completed,
            }))}
          />
        </div>

        <AcademyTeaser />
      </div>

      <CoachFab />
    </MemberShell>
  )
}
