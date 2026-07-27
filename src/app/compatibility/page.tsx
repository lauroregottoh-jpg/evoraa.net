import { MemberPage } from "@/components/layout/MemberPage";
import { CompatibilityGrid } from "@/components/compatibility/CompatibilityGrid";
import { getCompatibilitySuggestions } from "@/app/actions/matching";

export default async function CompatibilityPage() {
  const result = await getCompatibilitySuggestions();

  return (
    <MemberPage>
      <CompatibilityGrid
        initialSuggestions={result.suggestions}
        error={result.error}
        needsOnboarding={result.needsOnboarding}
      />
    </MemberPage>
  );
}
