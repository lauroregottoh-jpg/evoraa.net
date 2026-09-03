import { MemberPage } from "@/components/layout/MemberPage"
import { CompatibilityGrid } from "@/components/compatibility/CompatibilityGrid"
import { getCompatibilitySuggestions } from "@/app/actions/matching"
import { getDefaultPhotoBlur } from "@/lib/platform/settings"
import { loadPublicCms } from "@/lib/admin/loadCms"
import { SponsoredAdBanner } from "@/components/ads/SponsoredAdBanner"
import { DemoCompatibilityPanel } from "@/components/dashboard/DemoCompatibilityPanel"
import { shouldShowDemoMatches } from "@/lib/demo/sarahGandeSimulations"
import { CommunityMatchingCta } from "@/components/community/CommunityMatchingVideoCta"
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
