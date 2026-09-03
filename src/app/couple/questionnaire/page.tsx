"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CouplePageFrame } from "@/components/couple/CouplePageFrame"
import { CoupleShell } from "@/components/couple/CoupleShell"
import {
  CoupleDeadlineBanner,
  coupleIsQuestionnaireHardClosed,
} from "@/components/couple/CoupleDeadlineBanner"
import {
  getCoupleLikertOptions,
  getCoupleQuestions,
} from "@/lib/couple/questionBank"
import type { CouplePrefillSuggestion } from "@/lib/couple/prefill"
import {
  getCouplePrefillSuggestionsAction,
  getMyCoupleStateAction,
  loadMyCoupleAnswersAction,
  saveCoupleAnswersAction,
} from "@/app/actions/couple"
import { CouplePaywallOverlay } from "@/components/couple/CouplePaywallOverlay"
import { CoupleHeroCard } from "@/components/couple/CoupleHeroCard"
import { cn } from "@/utils/cn"

type Phase = "loading" | "locked" | "done" | "closed" | "review" | "questions"

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
  const [createdAt, setCreatedAt] = React.useState<string | null>(null)

  React.useEffect(() => {
    void (async () => {
      const state = await getMyCoupleStateAction()
      if (!("couple" in state) || !state.couple) {
        setPhase("locked")
        return
      }
      const ca = (state.couple as { created_at?: string }).created_at ?? null
      setCreatedAt(ca)
      if (
        ca &&
        coupleIsQuestionnaireHardClosed(ca) &&
        state.me?.questionnaireStatus !== "COMPLETED"
      ) {
        setPhase("closed")
        return
      }

      const existing = await loadMyCoupleAnswersAction()
      if (existing.completed) {
        setPhase("done")
        return
      }
      const saved = existing.answers || {}
      setAnswers(saved)

      if (Object.keys(saved).length > 0) {
        const firstUnanswered = questions.findIndex((q) => !saved[q.id])
        setIndex(
          firstUnanswered >= 0
            ? firstUnanswered
            : Math.max(0, questions.length - 1)
        )
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
    if (!q || saving) return
    const next = { ...answers, [q.id]: value }
    setAnswers(next)
    setError(null)
    setSaving(true)
    const res = await saveCoupleAnswersAction({ answers: { [q.id]: value } })
    setSaving(false)
    if (res.error) {
      if (/déjà terminé/i.test(res.error)) {
        setPhase("done")
        return
      }
      setError(res.error)
      return
    }
    if (index < questions.length - 1) {
      setIndex((i) => i + 1)
    }
  }

  const complete = async () => {
    setSaving(true)
    setError(null)
    const res = await saveCoupleAnswersAction({ answers, complete: true })
    setSaving(false)
    if (res.error) {
      if (/déjà terminé/i.test(res.error)) {
        setPhase("done")
        return
      }
      setError(res.error)
      return
    }
    setPhase("done")
    router.push("/couple/attente")
  }

  if (phase === "loading") {
    return (
      <CouplePageFrame>
        <p className="p-8 text-sm text-muted-foreground">Chargement…</p>
      </CouplePageFrame>
    )
  }

  if (phase === "locked") {
    return (
      <CouplePageFrame>
        <CoupleShell activeHref="/couple/questionnaire">
          <CouplePaywallOverlay
            title="Questionnaire verrouillé"
            body="72 questions vous attendent. Débloquez le bilan pour commencer — le paiement s’ouvre depuis ce bouton."
          >
            <div className="max-w-lg space-y-4">
              <CoupleHeroCard
                eyebrow="Questionnaire"
                title="Questionnaire Premium"
                body="72 questions individuelles et confidentielles — pour croiser vos deux regards."
                status={`Aperçu · 1 / ${questions.length}`}
              />
              <div className="space-y-4 rounded-2xl border bg-[#F2EBE0] p-6">
                <div className="h-2 rounded-full bg-[#A07070]/10" />
                <p className="font-serif text-lg font-semibold text-[#A07070]/50">
                  Aperçu de la première question…
                </p>
                <div className="space-y-2 opacity-40">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="h-11 rounded-xl border border-[#A07070]/10 bg-white"
                    />
                  ))}
                </div>
              </div>
            </div>
          </CouplePaywallOverlay>
        </CoupleShell>
      </CouplePageFrame>
    )
  }

  if (phase === "closed") {
    return (
      <CouplePageFrame>
        <CoupleShell activeHref="/couple/questionnaire">
          <div className="max-w-xl mx-auto space-y-5 py-8">
            <CoupleDeadlineBanner createdAt={createdAt} variant="hard" />
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Questionnaire fermé
            </p>
            <h1 className="font-serif text-3xl font-bold">
              Délai dépassé — questionnaire fermé
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Les 30 jours + 10 jours de marge sont écoulés. Vous ne pouvez plus
              modifier le questionnaire. Si un rapport a déjà été généré, il
              reste consultable dans votre fenêtre d’accès.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/couple/dossier"
                className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold"
              >
                Voir le dossier
              </Link>
              <Link
                href="/couple/rapport"
                className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-semibold"
              >
                Rapport
              </Link>
            </div>
          </div>
        </CoupleShell>
      </CouplePageFrame>
    )
  }

  if (phase === "done") {
    return (
      <CouplePageFrame>
        <CoupleShell activeHref="/couple/questionnaire">
          <div className="max-w-xl mx-auto space-y-5 py-8">
            <CoupleHeroCard
              eyebrow="Questionnaire"
              title="Votre questionnaire est terminé"
              body="Vos réponses sont enregistrées et restent confidentielles. Le rapport croisé se prépare lorsque votre partenaire a aussi terminé."
              status="Questionnaire fermé"
            />
            <CoupleDeadlineBanner createdAt={createdAt} variant="info" />
            <div className="flex flex-wrap gap-3">
              <Link
                href="/couple/dossier"
                className="inline-flex h-11 items-center rounded-xl bg-primary text-primary-foreground px-5 text-sm font-semibold"
              >
                Voir le dossier
              </Link>
              <Link
                href="/couple/attente"
                className="inline-flex h-11 items-center rounded-xl border px-5 text-sm font-semibold"
              >
                Voir l’attente
              </Link>
            </div>
          </div>
        </CoupleShell>
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
                      className={cn(
                        "w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors",
                        selected
                          ? "border-primary bg-primary/5 font-semibold"
                          : "border-border/70 hover:bg-foreground/[0.03]"
                      )}
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
                onClick={() => void acceptAllPrefill()}
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
  const answeredCount = questions.filter((qq) => answers[qq.id] != null).length
  const progress = Math.round((answeredCount / questions.length) * 100)
  const allAnswered = answeredCount >= questions.length
  const canGoNext = index < questions.length - 1 && answers[q?.id ?? ""] != null

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
          <CoupleHeroCard
            eyebrow="Questionnaire"
            title="Questionnaire Premium"
            body="Répondez honnêtement, seul(e). Vos réponses restent confidentielles jusqu’au rapport croisé."
            status={`Question ${index + 1} / ${questions.length} · ${progress}%`}
          />
          <CoupleDeadlineBanner createdAt={createdAt} variant="warning" />
          <div className="space-y-2">
            <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Choisissez une réponse pour avancer automatiquement. Vos réponses
              restent privées.
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
                    disabled={saving}
                    onClick={() => void select(opt.value)}
                    className={cn(
                      "w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors disabled:opacity-60",
                      selected
                        ? "border-primary bg-primary/5 font-semibold"
                        : "border-border/70 hover:bg-foreground/[0.03]"
                    )}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-3">
            <button
              type="button"
              disabled={index === 0 || saving}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="h-10 px-4 rounded-xl border text-sm font-medium disabled:opacity-40"
            >
              Précédent
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!canGoNext || saving}
                onClick={() =>
                  setIndex((i) => Math.min(questions.length - 1, i + 1))
                }
                className="h-10 px-4 rounded-xl border text-sm font-medium disabled:opacity-40"
              >
                Suivant
              </button>
              {allAnswered ? (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void complete()}
                  className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
                >
                  {saving ? "Envoi…" : "Terminer le questionnaire"}
                </button>
              ) : null}
            </div>
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
