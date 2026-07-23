import { getCompatibilityDetail } from "@/app/actions/matching";
import { CompatibilityDetailView } from "@/components/compatibility/CompatibilityDetailView";

export default async function CompatibilityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCompatibilityDetail(id);

  return (
    <CompatibilityDetailView
      profile={result.detail}
      error={result.error}
    />
  );
}
