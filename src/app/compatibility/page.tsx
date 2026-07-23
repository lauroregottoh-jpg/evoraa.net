import { MainLayout } from "@/components/layout/MainLayout";
import { CompatibilityGrid } from "@/components/compatibility/CompatibilityGrid";
import { getCompatibilitySuggestions } from "@/app/actions/matching";

export default async function CompatibilityGridPage() {
  const result = await getCompatibilitySuggestions();

  return (
    <MainLayout maxWidth="7xl">
      <CompatibilityGrid
        initialSuggestions={result.suggestions}
        error={result.error}
        needsOnboarding={result.needsOnboarding}
      />
    </MainLayout>
  );
}
