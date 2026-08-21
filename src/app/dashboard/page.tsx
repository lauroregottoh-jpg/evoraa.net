import Link from "next/link"
import { MemberShell } from "@/components/layout/MemberShell"
import { getDashboardData } from "@/app/actions/dashboard"
import { listCommunityMembers } from "@/app/actions/community"
import { Button } from "@/components/ui/button"
import { DashboardAlertBanners } from "@/components/dashboard/DashboardAlertBanners"
import { AllianceIdentityHome } from "@/components/dashboard/AllianceIdentityHome"
import { DiscoveryPathVisual } from "@/components/dashboard/DiscoveryPathVisual"
import { DiscoveryWelcomeHero } from "@/components/dashboard/DiscoveryWelcomeHero"
import { SimulatedMatchesPanel } from "@/components/dashboard/SimulatedMatchesPanel"
import { DemoCompatibilityPanel } from "@/components/dashboard/DemoCompatibilityPanel"
import { CommunityTeaser } from "@/components/community/CommunityMemberCard"
import { shouldShowDemoMatches } from "@/lib/demo/sarahGandeSimulations"
import { Crown } from "lucide-react"
import { DashboardCouplePromo } from "@/components/dashboard/DashboardCouplePromo"
import { KeliaaBuddyNudge } from "@/components/engagement/KeliaaBuddyNudge"
import { MessageCreditsCallout } from "@/components/engagement/MessageCreditsCallout"

export default async function DashboardPage() {
  const [{ data, error }, community] = await Promise.all([
    getDashboardData(),
    listCommunityMembers(8),
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

  const usage = data.usage
  const firstName = data.firstName
  const isPaid = usage.isPaid
  const showDemo = shouldShowDemoMatches({
    conversations: data.conversationCount,
    compatibilities: data.topSuggestions?.length ?? 0,
    matches: data.conversationCount,
  })

  const banners = data.nextSteps
    .filter(
      (s) =>
        s.tone === "upgrade" ||
        s.tone === "renew" ||
        s.tone === "tests"
    )
    .map((s) => ({
      id: s.id,
      title: s.title,
      body: s.body,
      href: s.href,
      cta: s.cta,
      tone: s.tone,
    }))
    .filter((b) => {
      if (isPaid && b.tone === "upgrade") return false
      return true
    })

  return (
    <MemberShell
      firstName={firstName}
      planLabel={usage.planName}
      isPaid={isPaid}
      completionPercentage={data.completionPercentage}
      hasAvatar={data.hasAvatar}
      assessmentsDone={data.assessmentsDone}
      assessmentsTotal={data.assessmentsTotal}
      renewSoon={usage.renewSoon}
      daysRemaining={usage.daysRemaining}
      trialDaysRemaining={usage.trialDaysRemaining}
      isTrialBoost={usage.isTrialBoost}
    >
      <div className="space-y-8 pb-8">
        {/* 1. Bienvenue */}
        <DiscoveryWelcomeHero
          firstName={firstName}
          variant={isPaid ? "alliance" : "discovery"}
        />

        <KeliaaBuddyNudge href="/compatibility" />
        <MessageCreditsCallout />

        {isPaid ? (
          <AllianceIdentityHome
            firstName={firstName}
            lastName={data.lastName}
            avatarUrl={data.avatarUrl}
            gender={data.gender}
            memberSinceLabel={data.memberSinceLabel}
            isVerified={data.isVerified}
            assessmentsDone={data.assessmentsDone}
          />
        ) : null}

        {/* 2. Communauté */}
        <CommunityTeaser
          members={community.members}
          sameSexFriendship={community.sameSexFriendship}
          isPaid={isPaid || community.isPaid}
        />

        {/* 3. Marche à suivre (Découverte) */}
        {!isPaid ? (
          <DiscoveryPathVisual assessmentsDone={data.assessmentsDone} />
        ) : null}

        {/* Démos — Discovery + Alliance tant que < 5 réels */}
        {showDemo ? (
          <>
            <DemoCompatibilityPanel />
            <SimulatedMatchesPanel
              variant={isPaid ? "alliance" : "discovery"}
            />
          </>
        ) : null}

        {banners.length > 0 ? (
          <DashboardAlertBanners banners={banners} />
        ) : null}

        <DashboardCouplePromo isPaid={isPaid} />

        {!isPaid ? (
          <Link
            href="/premium"
            className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-5 hover:bg-accent/15 transition-colors"
          >
            <div className="h-10 w-10 rounded-xl bg-accent/25 flex items-center justify-center shrink-0">
              <Crown className="h-5 w-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="font-serif text-lg font-bold">Passer Alliance</p>
              <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                Matching enrichi, Rapport Personnalisé et Coffre Premium.
              </p>
              <span className="inline-block mt-2 text-xs font-bold text-accent">
                Voir Alliance →
              </span>
            </div>
          </Link>
        ) : null}

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
      </div>
    </MemberShell>
  )
}
