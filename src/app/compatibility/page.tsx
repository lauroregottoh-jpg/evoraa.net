import { MemberPage } from "@/components/layout/MemberPage";
import { CompatibilityGrid } from "@/components/compatibility/CompatibilityGrid";
import { getCompatibilitySuggestions } from "@/app/actions/matching";
import { getDefaultPhotoBlur } from "@/lib/platform/settings";

export default async function CompatibilityPage() {
  const [result, defaultBlurred] = await Promise.all([
    getCompatibilitySuggestions(),
    getDefaultPhotoBlur(),
  ]);

  return (
    <MemberPage>
      <CompatibilityGrid
        initialSuggestions={result.suggestions}
        error={result.error}
        needsOnboarding={result.needsOnboarding}
        defaultBlurred={defaultBlurred}
      />
    </MemberPage>
  );
}
