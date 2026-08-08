"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import {
  getCoupleLikertOptions,
  getCoupleQuestions,
} from "@/lib/couple/questionBank"
import type { CouplePrefillSuggestion } from "@/lib/couple/prefill"
import {
  getCouplePrefillSuggestionsAction,
  loadMyCoupleAnswersAction,
  saveCoupleAnswersAction,
} from "@/app/actions/couple"

type Phase = "loading" | "review" | "questions"

export default function CoupleQuestionnairePage() {
  const router = useRouter()
  const questions = React.useMemo(() => getCoupleQuestions(), [])
  const options = getCoupleLikertOptions()
  const [phase, setPhase] = React.useState<Phase>("loading")
  const [index, setIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [suggestions, setSuggestions] = React.useState<CouplePrefillSuggestion[]>(
    []
  )
  const [reviewIndex, setReviewIndex] = React.useState(0)
  const [error, setError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    void (async () => {
      const existing = await loadMyCoupleAnswersAction()
      const saved = existing.answers || {}
      setAnswers(saved)

      if (Object.keys(saved).length > 0) {
        const firstUnanswered = questions.findIndex((q) => !saved[q.id])
        setIndex(firstUnanswered >= 0 ? firstUnanswered : 0)
        setPhase("questions")
        return
      }

      const prefill = await getCouplePrefillSuggestionsAction()
      const list = prefill.suggestions || []
      if (list.length > 0) {
        setSuggestions(list)
        const draft: Record<string, number> = {}
        for (const s of list) draft[s.questionId] = s.value
        setAnswers(draft)
        setPhase("review")
      } else {
        setPhase("questions")
      }
    })()
  }, [questions])

  const acceptAllPrefill = async () => {
    setSaving(true)
    setError(null)
    const payload: Record<string, number> = {}
    for (const s of suggestions) payload[s.questionId] = answers[s.questionId] ?? s.value
    const res = await saveCoupleAnswersAction({ answers: payload })
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    const firstUnanswered = questions.findIndex((q) => !payload[q.id])
    setIndex(firstUnanswered >= 0 ? firstUnanswered : 0)
    setPhase("questions")
  }

  const skipPrefill = () => {
    setAnswers({})
    setPhase("questions")
    setIndex(0)
  }

  const select = async (value: number) => {
    const q = questions[index]
    if (!q) return
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    setError(null)
    setSaving(true)
    const res = await saveCoupleAnswersAction({ answers: { [q.id]: value } })
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    if (index < questions.length - 1) setIndex((i) => i + 1)
  }

  const complete = async () => {
    setSaving(true)
    const res = await saveCoupleAnswersAction({ answers, complete: true })
    setSaving(false)
    if (res.error) {
      setError(res.error)
      return
    }
    router.push("/couple/attente")
  }

  if (phase === "loading") {
    return (
      <CouplePageFrame>
        <p className="p-8 text-sm text-muted-foreground">Chargement…</p>
      </CouplePageFrame>
    )
  }

  if (phase === "review" && suggestions.length > 0) {
    const current = suggestions[reviewIndex]!
    const likertLabel =
      options.find((o) => o.value === (answers[current.questionId] ?? current.value))
        ?.label || ""

    return (
      <CouplePageFrame>
        <CoupleShell activeHref="/couple/questionnaire">
          <div className="max-w-xl mx-auto space-y-5">
            <header className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Réutilisation de vos tests KELIAA
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">
                Relisez et validez
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nous avons trouvé {suggestions.length} réponses proches dans vos
                tests Découverte / Alliance. Validez-les ou modifiez-les — rien
                n’est envoyé sans votre accord.
              </p>
            </header>

            <div className="rounded-2xl border bg-white/90 p-5 space-y-3">
              <p className="text-xs text-muted-foreground">
                Suggestion {reviewIndex + 1} / {suggestions.length} · source :{" "}
                {current.sourceLabel} ({current.pillarScore} %)
              </p>
              <h2 className="font-serif text-lg font-bold leading-snug">
                {current.questionText}
              </h2>
              <div className="space-y-2">
                {options.map((opt) => {
                  const selected =
                    (answers[current.questionId] ?? current.value) === opt.value
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [current.questionId]: opt.value,
                        }))
                      }
                      className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                        selected
                          ? "border-primary bg-primary/5 font-semibold"
                          : "border-border/70 hover:bg-foreground/[0.03]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Choix actuel : {likertLabel}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={reviewIndex === 0}
                onClick={() => setReviewIndex((i) => Math.max(0, i - 1))}
                className="h-10 px-4 rounded-xl border text-sm font-medium disabled:opacity-40"
              >
                Précédent
              </button>
              {reviewIndex < suggestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setReviewIndex((i) => i + 1)}
                  className="h-10 px-4 rounded-xl border text-sm font-medium"
                >
                  Suivant
                </button>
              ) : null}
              <button
                type="button"
                disabled={saving}
                onClick={acceptAllPrefill}
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
              >
                {saving ? "Enregistrement…" : "Valider ces réponses"}
              </button>
              <button
                type="button"
                onClick={skipPrefill}
                className="h-10 px-4 rounded-xl text-sm font-medium text-muted-foreground underline"
              >
                Ignorer et tout refaire
              </button>
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
        </CoupleShell>
      </CouplePageFrame>
    )
  }

  const q = questions[index]
  const answered = Object.keys(answers).length
  const progress = Math.round((answered / questions.length) * 100)

  if (!q) {
    return (
      <CouplePageFrame>
        <p className="p-8 text-sm">Chargement…</p>
      </CouplePageFrame>
    )
  }

  return (
    <CouplePageFrame>
      <CoupleShell activeHref="/couple/questionnaire">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Question {index + 1} / {questions.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Vos réponses restent privées. Votre partenaire ne verra pas vos
              choix bruts.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-white/90 p-5 sm:p-6 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
              {q.dimension.replace(/_/g, " ")}
            </p>
            <h1 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
              {q.text}
            </h1>
            <div className="space-y-2">
              {options.map((opt) => {
                const selected = answers[q.id] === opt.value
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => select(opt.value)}
                    className={`w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border/70 hover:bg-foreground/[0.03]"
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="h-10 px-4 rounded-xl border text-sm font-medium disabled:opacity-40"
            >
              Précédent
            </button>
            {answered >= questions.length ? (
              <button
                type="button"
                disabled={saving}
                onClick={complete}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
              >
                {saving ? "Envoi…" : "Terminer le questionnaire"}
              </button>
            ) : (
              <button
                type="button"
                disabled={index >= questions.length - 1 || !answers[q.id]}
                onClick={() =>
                  setIndex((i) => Math.min(questions.length - 1, i + 1))
                }
                className="h-10 px-4 rounded-xl border text-sm font-medium disabled:opacity-40"
              >
                Suivant
              </button>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
      </CoupleShell>
    </CouplePageFrame>
  )
}
