import { MemberPage } from "@/components/layout/MemberPage";
import { CompatibilityGrid } from "@/components/compatibility/CompatibilityGrid";
import { getCompatibilitySuggestions } from "@/app/actions/matching";
import { getDefaultPhotoBlur } from "@/lib/platform/settings";
import { loadPublicCms } from "@/lib/admin/loadCms";
import { SponsoredAdBanner } from "@/components/ads/SponsoredAdBanner";

export default async function CompatibilityPage() {
  const [result, defaultBlurred, cms] = await Promise.all([
    getCompatibilitySuggestions(),
    getDefaultPhotoBlur(),
    loadPublicCms(),
  ]);

  const ads = cms.ads.filter((a) => a.active && a.slot === "discover");

  return (
    <MemberPage>
      <div className="space-y-4">
        {ads.map((ad) => (
          <SponsoredAdBanner key={ad.id} ad={ad} />
        ))}
        <CompatibilityGrid
          initialSuggestions={result.suggestions}
          error={result.error}
          needsOnboarding={result.needsOnboarding}
          defaultBlurred={defaultBlurred}
        />
      </div>
    </MemberPage>
  );
}
