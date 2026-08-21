import { MemberPage } from "@/components/layout/MemberPage"
import { CompatibilityGrid } from "@/components/compatibility/CompatibilityGrid"
import { getCompatibilitySuggestions } from "@/app/actions/matching"
import { getDefaultPhotoBlur } from "@/lib/platform/settings"
import { loadPublicCms } from "@/lib/admin/loadCms"
import { SponsoredAdBanner } from "@/components/ads/SponsoredAdBanner"
import { DemoCompatibilityPanel } from "@/components/dashboard/DemoCompatibilityPanel"
import { shouldShowDemoMatches } from "@/lib/demo/sarahGandeSimulations"
import { CommunityMatchingCta } from "@/components/community/CommunityMatchingVideoCta"
import { KeliaaBuddyNudge } from "@/components/engagement/KeliaaBuddyNudge"

export default async function CompatibilityPage() {
  const [result, defaultBlurred, cms] = await Promise.all([
    getCompatibilitySuggestions(),
    getDefaultPhotoBlur(),
    loadPublicCms(),
  ])

  const ads = cms.ads.filter((a) => a.active && a.slot === "discover")
  const showDemo = shouldShowDemoMatches({
    compatibilities: result.suggestions?.length ?? 0,
    conversations: 0,
    matches: result.suggestions?.length ?? 0,
  })

  return (
    <MemberPage>
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#5C1F28]/15 bg-[#F7F0E0] px-4 py-3 text-sm text-[#3D1519]">
          <p className="font-semibold text-[#5C1F28]">Rappel important</p>
          <p className="mt-1 leading-relaxed">
            On vous propose déjà des personnes selon votre demande, même si les
            tests ne sont pas finis : ce sont des <strong>suggestions</strong>.
            Invitez-les à un test pour mesurer vraiment la compatibilité. Chaque
            test fait = +10 messages (20 jours).
          </p>
        </div>
        <KeliaaBuddyNudge href="/assessments" />
        <CommunityMatchingCta />
        {ads.map((ad) => (
          <SponsoredAdBanner key={ad.id} ad={ad} />
        ))}
        {showDemo ? <DemoCompatibilityPanel /> : null}
        <CompatibilityGrid
          initialSuggestions={result.suggestions}
          error={result.error}
          needsOnboarding={result.needsOnboarding}
          defaultBlurred={defaultBlurred}
        />
      </div>
    </MemberPage>
  )
}
