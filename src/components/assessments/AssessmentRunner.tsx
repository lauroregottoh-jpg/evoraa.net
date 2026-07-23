"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  ASSESSMENTS,
  LIKERT_LABELS,
  type AssessmentSlug,
} from "@/lib/assessments/questionBank";
import { submitAssessmentAction } from "@/app/actions/assessments";

export function AssessmentRunner({ slug }: { slug: AssessmentSlug }) {
  const router = useRouter();
  const bank = ASSESSMENTS[slug];
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [doneScore, setDoneScore] = React.useState<number | null>(null);

  const question = bank.questions[index];
  const progress = Math.round(((index + (answers[question.key] ? 1 : 0)) / bank.questions.length) * 100);

  const select = (value: number) => {
    setAnswers((prev) => ({ ...prev, [question.key]: value }));
  };

  const goNext = async () => {
    if (!answers[question.key]) {
      setError("Choisissez une réponse pour continuer.");
      return;
    }
    setError("");
    if (index < bank.questions.length - 1) {
      setIndex((i) => i + 1);
      return;
    }

    setLoading(true);
    try {
      const result = await submitAssessmentAction(slug, answers);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDoneScore(result.score ?? null);
      if (result.allDone) {
        setTimeout(() => router.push("/compatibility"), 1800);
      } else {
        setTimeout(() => router.push("/assessments"), 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  if (doneScore != null) {
    return (
      <Card className="rounded-2xl max-w-xl mx-auto">
        <CardContent className="p-8 text-center space-y-3">
          <p className="font-serif text-2xl">Questionnaire terminé</p>
          <p className="text-muted-foreground text-sm">
            Score normalisé : <strong>{doneScore}%</strong>
          </p>
          <p className="text-xs text-muted-foreground">Redirection…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Question {index + 1} / {bank.questions.length}
          </span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="rounded-2xl border-border/60">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <p className="text-[11px] uppercase tracking-wider text-accent font-semibold">
            {question.dimension.replace(/_/g, " ")}
          </p>
          <h2 className="font-serif text-2xl text-foreground leading-snug">{question.text}</h2>

          <div className="space-y-2">
            {LIKERT_LABELS.map((label, i) => {
              const value = i + 1;
              const active = answers[question.key] === value;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => select(value)}
                  className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                    active
                      ? "border-accent bg-accent/10 text-foreground"
                      : "border-border/60 hover:border-accent/40"
                  }`}
                >
                  <span className="font-semibold mr-2">{value}.</span>
                  {label}
                </button>
              );
            })}
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={index === 0 || loading}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="rounded-xl"
            >
              Précédent
            </Button>
            <Button type="button" disabled={loading} onClick={goNext} className="rounded-xl">
              {index === bank.questions.length - 1
                ? loading
                  ? "Enregistrement…"
                  : "Terminer"
                : "Suivant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
