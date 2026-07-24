import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { getAssessmentsProgress } from "@/app/actions/assessments";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

export default async function AssessmentsHubPage() {
  const { progress, allDone, error } = await getAssessmentsProgress();

  return (
    <MainLayout maxWidth="4xl">
      <div className="space-y-8 py-6">
        <div className="space-y-2 border-b border-border/40 pb-6">
          <Badge variant="outline" className="text-accent border-accent/40">
            Questionnaires KELIAA
          </Badge>
          <h1 className="font-serif text-4xl font-bold">Discernement psychométrique</h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Trois questionnaires (≈ 8–10 min). Ils enrichissent votre score de compatibilité au-delà du profil d&apos;accueil.
          </p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {allDone && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
            Les trois questionnaires sont complétés.{" "}
            <Link href="/compatibility" className="underline font-semibold">
              Voir vos suggestions
            </Link>
          </div>
        )}

        <div className="grid gap-4">
          {progress.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl border border-border/60 bg-background p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <h2 className="font-serif text-xl font-bold">{item.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <p className="text-xs text-muted-foreground">
                  {item.questionCount} questions
                  {item.score != null ? ` · Score ${item.score}%` : ""}
                </p>
              </div>
              <Link
                href={`/assessments/${item.slug}`}
                className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                {item.completed ? "Refaire" : "Commencer"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
