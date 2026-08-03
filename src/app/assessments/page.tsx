import Link from "next/link";
import { MemberPage } from "@/components/layout/MemberPage";
import { getAssessmentsProgress, getMyGrowthAxes } from "@/app/actions/assessments";
import { ASSESSMENT_RETAKE_COOLDOWN_DAYS } from "@/lib/assessments/constants";
import { GrowthAxesCard } from "@/components/assessments/GrowthAxesCard";
import { PillarBadges } from "@/components/assessments/PillarBadges";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock } from "lucide-react";

export default async function AssessmentsHubPage() {
  const [{ progress, allDone, error }, growth] = await Promise.all([
    getAssessmentsProgress(),
    getMyGrowthAxes(),
  ]);

  const completedAny = progress.some((p) => p.completed);

  return (
    <MemberPage>
      <div className="space-y-8 py-2 max-w-4xl mx-auto">
        <div className="space-y-2 border-b border-border/40 pb-6">
          <Badge variant="outline" className="text-accent border-accent/40">
            5 piliers KELLIA
          </Badge>
          <h1 className="font-serif text-4xl font-bold">Questionnaires de discernement</h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Plus vos réponses s&apos;alignent avec celles d&apos;un autre profil, plus le score de
            compatibilité monte (jusqu&apos;à 97–100&nbsp;%). Chaque réponse est une vision
            personnelle — pas un « bon » ou « mauvais » choix. Mise à jour possible tous les{" "}
            {ASSESSMENT_RETAKE_COOLDOWN_DAYS} jours.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <PillarBadges
            pillars={progress.map((p) => ({ slug: p.slug, completed: p.completed }))}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {allDone && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
            Les cinq questionnaires sont complétés.{" "}
            <Link href="/compatibility" className="underline font-semibold">
              Voir vos suggestions
            </Link>
            {" · "}
            <Link href="/academie-mariage" className="underline font-semibold">
              Académie du mariage
            </Link>
          </div>
        )}

        {completedAny && <GrowthAxesCard axes={growth.axes} />}

        <div className="grid gap-4">
          {progress.map((item) => {
            const locked = item.completed && !item.canRetake;
            return (
              <div
                key={item.slug}
                className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      locked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      )
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h2 className="font-serif text-xl font-bold">{item.name}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.questionCount} scénarios
                    {item.score != null ? ` · Profil ${item.score}%` : ""}
                  </p>
                  {item.lockMessage && (
                    <p className="text-xs text-accent/90 mt-1">{item.lockMessage}</p>
                  )}
                </div>
                {item.canStart ? (
                  <Link
                    href={`/assessments/${item.slug}`}
                    className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shrink-0"
                  >
                    {item.completed ? "Mettre à jour" : "Commencer"}
                  </Link>
                ) : (
                  <span className="inline-flex items-center justify-center h-10 px-5 rounded-xl border border-border text-sm text-muted-foreground shrink-0">
                    Validé
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </MemberPage>
  );
}
