import Link from "next/link"
import { MemberShell } from "@/components/layout/MemberShell"
import { getDashboardData } from "@/app/actions/dashboard"
import { Button } from "@/components/ui/button"
import { DashboardAlertBanners } from "@/components/dashboard/DashboardAlertBanners"
import { SelectionGrid, SelectionHeader } from "@/components/dashboard/SelectionGrid"
import { AllianceIdentityHome } from "@/components/dashboard/AllianceIdentityHome"
import { DiscoveryPathVisual } from "@/components/dashboard/DiscoveryPathVisual"
import { Crown } from "lucide-react"

export default async function DashboardPage() {
  const { data, error } = await getDashboardData()

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

  /** Alliance : pas de bannières photo/profil devant la carte membre. */
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
    .filter((b) => {
      if (isPaid && b.tone === "upgrade") return false
      if (isPaid && (b.tone === "photo" || b.tone === "profile")) return false
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
      <div className="space-y-5 pb-8">
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
        ) : (
          <>
            <DashboardAlertBanners banners={banners} />
            <DiscoveryPathVisual
              firstName={firstName}
              assessmentsDone={data.assessmentsDone}
              hasAvatar={data.hasAvatar}
            />
          </>
        )}

        <section className="space-y-3">
          <SelectionHeader
            title={
              isPaid ? "Découvrez vos compatibilités" : data.selectionTitle
            }
            subtitle={
              isPaid
                ? data.assessmentsDone < 5
                  ? "Continuez vos questionnaires pour affiner vos suggestions."
                  : "Profils alignés sur votre foi et votre projet de mariage."
                : data.selectionSubtitle
            }
          />
          <SelectionGrid items={data.topSuggestions} />
          {isPaid && data.assessmentsDone < 5 ? (
            <Link
              href="/assessments"
              className="inline-flex text-xs font-semibold text-primary underline"
            >
              Continuer mon questionnaire →
            </Link>
          ) : null}
        </section>

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
                Débloquez mon Rapport Personnalisé, le Coffre Premium et un Matching
                enrichi.
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
