import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { AssessmentRunner } from "@/components/assessments/AssessmentRunner";
import { ASSESSMENTS, type AssessmentSlug } from "@/lib/assessments/questionBank";
import { getAssessmentsProgress } from "@/app/actions/assessments";
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
  const { progress } = await getAssessmentsProgress();
  const item = progress.find((p) => p.slug === typed);

  return (
    <MainLayout maxWidth="4xl">
      <div className="space-y-6 py-6">
        <div className="space-y-1">
          <Link href="/assessments" className="text-xs text-muted-foreground hover:underline">
            ← Tous les questionnaires
          </Link>
          <h1 className="font-serif text-3xl font-bold">{meta.name}</h1>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
          <p className="text-xs text-muted-foreground">
            Sélectionnez une réponse — la question suivante s&apos;affiche automatiquement.
          </p>
        </div>
        <AssessmentRunner
          slug={typed}
          locked={Boolean(item && !item.canStart)}
          lockMessage={item?.lockMessage ?? undefined}
        />
      </div>
    </MainLayout>
  );
}
