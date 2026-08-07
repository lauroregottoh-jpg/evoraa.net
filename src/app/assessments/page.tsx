import Link from "next/link";
import { MemberPage } from "@/components/layout/MemberPage";
import { getAssessmentsProgress, getMyGrowthAxes, getMyRelationBilan } from "@/app/actions/assessments";
import { ASSESSMENT_RETAKE_COOLDOWN_DAYS } from "@/lib/assessments/constants";
import { GrowthAxesCard } from "@/components/assessments/GrowthAxesCard";
import { RelationBilanCard } from "@/components/matching/RelationBilanCard";
import { PillarBadges } from "@/components/assessments/PillarBadges";
import { AssessmentPillarCards } from "@/components/assessments/AssessmentPillarCards";
import { AmbientSnowOrbs } from "@/components/home/AmbientSnowOrbs";
import { Badge } from "@/components/ui/badge";

export default async function AssessmentsHubPage() {
  const [{ progress, allDone, error }, growth, bilan] = await Promise.all([
    getAssessmentsProgress(),
    getMyGrowthAxes(),
    getMyRelationBilan(),
  ]);

  const completedAny = progress.some((p) => p.completed);

  return (
    <MemberPage>
      <div className="relative space-y-8 py-2 max-w-4xl mx-auto">
        <AmbientSnowOrbs density="soft" className="opacity-80" />

        <div className="relative z-10 space-y-3 border-b border-border/40 pb-6">
          <Badge variant="outline" className="text-accent border-accent/40">
            5 piliers de compatibilité
          </Badge>
          <h1 className="font-serif text-4xl font-bold">
            Tests de compatibilité
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Les cinq piliers KELIAA — humaine, spirituelle, relationnelle, projet de vie et
            valeurs — alimentent votre Matching. Plus vos réponses s&apos;alignent avec celles
            d&apos;un autre profil, plus le score monte. Chaque réponse est une vision
            personnelle — pas un « bon » ou « mauvais » choix. Mise à jour possible tous les{" "}
            {ASSESSMENT_RETAKE_COOLDOWN_DAYS} jours.
          </p>
        </div>

        <div className="relative z-10 rounded-[1.35rem] border border-border/70 bg-gradient-to-br from-white via-secondary/40 to-accent/[0.06] p-5 shadow-card">
          <PillarBadges
            pillars={progress.map((p) => ({ slug: p.slug, completed: p.completed }))}
          />
        </div>

        {error && (
          <p className="relative z-10 text-sm text-destructive">{error}</p>
        )}

        {allDone && (
          <div className="relative z-10 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
            Les cinq tests de compatibilité sont complétés.{" "}
            <Link href="/compatibility" className="underline font-semibold">
              Voir vos suggestions
            </Link>
            {" · "}
            <Link href="/academie-mariage" className="underline font-semibold">
              Académie du mariage
            </Link>
          </div>
        )}

        {completedAny && (
          <div className="relative z-10">
            <RelationBilanCard report={bilan.report} />
          </div>
        )}
        {completedAny && !bilan.isAlliance && (
          <div className="relative z-10">
            <GrowthAxesCard axes={growth.axes} />
          </div>
        )}

        <div className="relative z-10">
          <AssessmentPillarCards items={progress} />
        </div>
      </div>
    </MemberPage>
  );
}
