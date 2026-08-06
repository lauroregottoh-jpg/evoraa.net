import Link from "next/link"
import { MemberShell } from "@/components/layout/MemberShell"
import { getDashboardData } from "@/app/actions/dashboard"
import { Button } from "@/components/ui/button"
import { DashboardAlertBanners } from "@/components/dashboard/DashboardAlertBanners"
import { ProfileProgressHero } from "@/components/dashboard/ProfileProgressHero"
import { SelectionGrid, SelectionHeader } from "@/components/dashboard/SelectionGrid"
import { InviteShareCard } from "@/components/growth/InviteShareCard"
import { getMyRelationBilan } from "@/app/actions/assessments"
import { RelationBilanCard } from "@/components/matching/RelationBilanCard"
import { Crown, BookHeart } from "lucide-react"

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

  const needsSetup = !data.hasAvatar || data.assessmentsDone < 5

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
      <div className="space-y-5 pb-8">
        <DashboardAlertBanners banners={banners} />

        <ProfileProgressHero
          firstName={data.firstName}
          completion={data.completionPercentage}
          hasAvatar={data.hasAvatar}
          isVerified={data.isVerified}
        />

        {needsSetup ? (
          <div className="rounded-2xl border border-primary/25 bg-primary/5 p-5 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Prochaine étape
            </p>
            <p className="text-sm font-bold text-foreground">
              {data.assessmentsDone < 5
                ? "Complétez vos tests pour activer le Matching"
                : "Ajoutez une photo claire"}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.assessmentsDone < 5
                ? `${data.firstName ? `${data.firstName}, v` : "V"}otre parcours est à ${data.completionPercentage}% (${data.assessmentsDone}/5 questionnaires). Les tests guident les suggestions compatibles.`
                : "Sans portrait, vous restez difficile à découvrir pour les profils compatibles."}
            </p>
            <Link
              href={data.assessmentsDone < 5 ? "/assessments" : "/profile"}
              className="flex items-center justify-center w-full rounded-xl bg-primary text-primary-foreground h-11 text-sm font-semibold"
            >
              {data.assessmentsDone < 5
                ? "Continuer mes tests →"
                : "Ajouter ma photo →"}
            </Link>
          </div>
        ) : null}

        {data.assessmentsDone > 0 && bilan.report ? (
          <RelationBilanCard report={bilan.report} compact />
        ) : null}

        <section className="space-y-3">
          <SelectionHeader
            title={data.selectionTitle}
            subtitle={data.selectionSubtitle}
          />
          <SelectionGrid items={data.topSuggestions} />
        </section>

        {!usage.isPaid ? (
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
                Débloquez votre rapport personnalisé, plus de suggestions et des
                échanges plus amples.
              </p>
              <span className="inline-block mt-2 text-xs font-bold text-accent">
                Voir Alliance →
              </span>
            </div>
          </Link>
        ) : null}

        <Link
          href="/inspiration"
          className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm hover:border-primary/30 transition-colors"
        >
          <span className="inline-flex items-center gap-2 font-medium">
            <BookHeart className="h-4 w-4 text-primary" />
            Inspiration &amp; méditations
          </span>
          <span className="text-xs font-semibold text-primary">Ouvrir →</span>
        </Link>

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

        <div id="invite" className="scroll-mt-24 pt-2">
          <InviteShareCard userId={data.userId} />
        </div>
      </div>
    </MemberShell>
  )
}
