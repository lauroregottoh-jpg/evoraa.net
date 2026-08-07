import { notFound } from "next/navigation";
import { MemberPage } from "@/components/layout/MemberPage";
import { AssessmentRunner } from "@/components/assessments/AssessmentRunner";
import { ASSESSMENTS, type AssessmentSlug } from "@/lib/assessments/questionBank";
import { getAssessmentsProgress } from "@/app/actions/assessments";
import { getUsageSnapshot } from "@/lib/billing/usage";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(slug in ASSESSMENTS)) notFound();
  const typed = slug as AssessmentSlug;
  const meta = ASSESSMENTS[typed];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [{ progress }, usage] = await Promise.all([
    getAssessmentsProgress(),
    user ? getUsageSnapshot(user.id) : Promise.resolve(null),
  ]);
  const item = progress.find((p) => p.slug === typed);
  const isAlliance = Boolean(usage?.isPaid);

  return (
    <MemberPage>
      <div className="space-y-6 py-2 max-w-4xl mx-auto">
        <div className="space-y-1">
          <Link href="/assessments" className="text-xs text-muted-foreground hover:underline">
            ← Tous les tests de compatibilité
          </Link>
          <h1 className="font-serif text-3xl font-bold">{meta.name}</h1>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
          <p className="text-xs text-muted-foreground">
            Sélectionnez une réponse — la question suivante s&apos;affiche automatiquement.
            {isAlliance
              ? " Votre Rapport Alliance se mettra à jour automatiquement après validation."
              : ""}
          </p>
        </div>
        <AssessmentRunner
          slug={typed}
          locked={Boolean(item && !item.canStart)}
          lockMessage={item?.lockMessage ?? undefined}
          isAlliance={isAlliance}
        />
      </div>
    </MemberPage>
  );
}
