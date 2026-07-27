"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  ASSESSMENTS,
  getOptionLabel,
  type AssessmentSlug,
  type BankQuestion,
} from "@/lib/assessments/questionBank";
import { submitAssessmentAction } from "@/app/actions/assessments";
import { ArrowLeft, CheckCircle2, Pencil } from "lucide-react";

type Phase = "questions" | "review" | "done";

const AUTO_ADVANCE_MS = 380;

function getAnswerValue(question: BankQuestion, optionId: string): number {
  if (question.type === "scenario" && question.options) {
    return question.options.find((o) => o.id === optionId)?.value ?? 3;
  }
  return Number.parseInt(optionId, 10) || 3;
}

export function AssessmentRunner({
  slug,
  locked,
  lockMessage,
}: {
  slug: AssessmentSlug;
  locked?: boolean;
  lockMessage?: string;
}) {
  const router = useRouter();
  const bank = ASSESSMENTS[slug];
  const [phase, setPhase] = React.useState<Phase>("questions");
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [doneScore, setDoneScore] = React.useState<number | null>(null);
  const advanceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  if (locked) {
    return (
      <Card className="rounded-2xl max-w-xl mx-auto">
        <CardContent className="p-8 text-center space-y-3">
          <p className="font-serif text-xl">Questionnaire verrouillé</p>
          <p className="text-sm text-muted-foreground">{lockMessage}</p>
          <Button variant="outline" className="rounded-xl" onClick={() => router.push("/assessments")}>
            Retour
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = bank.questions[index];
  const answeredCount = bank.questions.filter((q) => answers[q.key]).length;
  const progress = Math.round((answeredCount / bank.questions.length) * 100);

  const selectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [question.key]: optionId }));
    setError("");

    if (advanceTimer.current) clearTimeout(advanceTimer.current);

    const isLast = index === bank.questions.length - 1;
    advanceTimer.current = setTimeout(() => {
      if (isLast) {
        setPhase("review");
      } else {
        setIndex((i) => i + 1);
      }
    }, AUTO_ADVANCE_MS);
  };

  const goToQuestion = (i: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setIndex(i);
    setPhase("questions");
    setError("");
  };

  const validate = async () => {
    const missing = bank.questions.filter((q) => !answers[q.key]);
    if (missing.length > 0) {
      setError("Certaines questions n'ont pas de réponse. Complétez-les avant de valider.");
      goToQuestion(bank.questions.findIndex((q) => q.key === missing[0].key));
      return;
    }

    setLoading(true);
    setError("");
    try {
      const numericAnswers: Record<string, number> = {};
      for (const q of bank.questions) {
        numericAnswers[q.key] = getAnswerValue(q, answers[q.key]);
      }
      const result = await submitAssessmentAction(slug, numericAnswers);
      if (result.error) {
        setError(result.error);
        return;
      }
      setDoneScore(result.score ?? null);
      setPhase("done");
      if (result.allDone) {
        setTimeout(() => router.push("/compatibility"), 2200);
      } else {
        setTimeout(() => router.push("/assessments"), 1800);
      }
    } finally {
      setLoading(false);
    }
  };

  if (phase === "done" && doneScore != null) {
    return (
      <Card className="rounded-2xl max-w-xl mx-auto">
        <CardContent className="p-8 text-center space-y-3">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <p className="font-serif text-2xl">Profil enregistré</p>
          <p className="text-muted-foreground text-sm">
            Score : <strong>{doneScore}%</strong> — vos réponses enrichissent le matching.
          </p>
          <p className="text-xs text-muted-foreground">
            Mise à jour possible dans 60 jours. Redirection…
          </p>
        </CardContent>
      </Card>
    );
  }

  if (phase === "review") {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold">Validez vos réponses</h2>
          <p className="text-sm text-muted-foreground">
            Relisez avant d&apos;enregistrer. Vous pourrez mettre à jour ce questionnaire dans
            environ 60 jours.
          </p>
        </div>

        <div className="space-y-3">
          {bank.questions.map((q, i) => (
            <div
              key={q.key}
              className="rounded-xl border border-border/60 bg-background p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="min-w-0 space-y-1">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Question {i + 1}
                </p>
                <p className="text-sm font-medium leading-snug">{q.text}</p>
                <p className="text-xs text-accent">
                  {answers[q.key]
                    ? getOptionLabel(
                        q,
                        getAnswerValue(q, answers[q.key]),
                        answers[q.key]
                      )
                    : "— Non répondu"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 rounded-lg"
                onClick={() => goToQuestion(i)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" /> Modifier
              </Button>
            </div>
          ))}
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => goToQuestion(bank.questions.length - 1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Retour aux questions
          </Button>
          <Button
            type="button"
            disabled={loading}
            className="rounded-xl flex-1"
            onClick={validate}
          >
            {loading ? "Enregistrement…" : "Valider définitivement"}
          </Button>
        </div>
      </div>
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
            {question.type === "scenario" && question.options
              ? question.options.map((opt) => {
                  const active = answers[question.key] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectOption(opt.id)}
                      className={`w-full text-left rounded-xl border px-4 py-3.5 text-sm transition-all duration-200 ${
                        active
                          ? "border-accent bg-accent/10 text-foreground scale-[1.01] shadow-sm"
                          : "border-border/60 hover:border-accent/40 hover:bg-accent/5"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })
              : null}
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={index === 0}
              onClick={() => {
                if (advanceTimer.current) clearTimeout(advanceTimer.current);
                setIndex((i) => Math.max(0, i - 1));
              }}
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Précédent
            </Button>
            {index === bank.questions.length - 1 && answers[question.key] ? (
              <Button
                type="button"
                className="rounded-xl"
                onClick={() => {
                  if (advanceTimer.current) clearTimeout(advanceTimer.current);
                  setPhase("review");
                }}
              >
                Vérifier & valider
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground self-center">
                Choisissez une réponse — avance automatique
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
