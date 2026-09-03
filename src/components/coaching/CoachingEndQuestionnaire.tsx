"use client"

import * as React from "react"
import {
  COACHING_RATING_PROMPTS,
  COACHING_REPORT_FIELDS,
} from "@/lib/coaching/domain"
import { submitEndQuestionnaireAction } from "@/lib/coaching/actions"

export function CoachingEndQuestionnaire({
  sessionId,
  role,
  onDone,
  aborted,
}: {
  sessionId: string
  role: "client" | "coach"
  onDone: () => void
  /** Séance interrompue / non validée — pas de rapport « complet ». */
  aborted?: boolean
}) {
  const prompts = COACHING_RATING_PROMPTS[role]
  const [score, setScore] = React.useState(5)
  const [checks, setChecks] = React.useState<Record<string, boolean>>({})
  const [freeText, setFreeText] = React.useState("")
  const [report, setReport] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [done, setDone] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (aborted) {
      onDone()
      return
    }
    if (role === "coach") {
      const missing = COACHING_REPORT_FIELDS.filter(
        (f) => !(report[f.id] || "").trim()
      )
      if (missing.length > 0) {
        setError("Merci de remplir les 4 points du rapport de coaching.")
        return
      }
    }
    setLoading(true)
    setError("")
    const r = await submitEndQuestionnaireAction({
      sessionId,
      role,
      score,
      answers: checks,
      freeText,
      coachReport: role === "coach" ? report : undefined,
    })
    setLoading(false)
    if (r.error) {
      setError(r.error)
      return
    }
    setDone(true)
  }

  if (aborted) {
    return (
      <div className="rounded-2xl border bg-white p-6 space-y-3 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#A07070]">
          Séance non validée
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          La séance n’a pas été marquée comme complète (connexion audio
          incomplète ou durée non écoulée). Aucun crédit n’a été consommé.
        </p>
        <button
          type="button"
          onClick={onDone}
          className="h-11 rounded-xl bg-[#A07070] px-5 text-sm font-bold text-[#F2EBE0]"
        >
          Retour
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="rounded-2xl border bg-white p-6 space-y-3 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#A07070]">Merci</h2>
        <p className="text-sm text-muted-foreground">
          {role === "coach"
            ? "Votre rapport de coaching est enregistré."
            : "Votre retour est enregistré."}
        </p>
        <button
          type="button"
          onClick={onDone}
          className="h-11 rounded-xl bg-[#A07070] px-5 text-sm font-bold text-[#F2EBE0]"
        >
          Retour
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border bg-white p-6 space-y-5"
    >
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8954A]">
          {role === "coach" ? "Rapport de coaching" : "Fin de séance"}
        </p>
        <h2 className="font-serif text-2xl font-bold text-[#A07070] mt-1">
          {role === "coach" ? "Canevas de rédaction" : "Votre retour"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {role === "coach"
            ? "Quatre points pour formaliser la séance : déroulement, avancées, travail du client, recommandations."
            : "Quelques questions pour ancrer la séance — uniquement après une séance complète."}
        </p>
      </div>

      {role === "coach" ? (
        <div className="space-y-4">
          {COACHING_REPORT_FIELDS.map((f) => (
            <label key={f.id} className="block space-y-1.5 text-sm">
              <span className="font-semibold text-[#A07070]">{f.label}</span>
              <span className="block text-xs text-muted-foreground">{f.hint}</span>
              <textarea
                value={report[f.id] || ""}
                onChange={(e) =>
                  setReport((prev) => ({ ...prev, [f.id]: e.target.value }))
                }
                rows={3}
                required
                className="w-full rounded-xl border px-3 py-2 text-sm"
                placeholder="Votre rédaction…"
              />
            </label>
          ))}
        </div>
      ) : null}

      <label className="block space-y-2 text-sm">
        <span className="font-medium">Note globale (1–5)</span>
        <input
          type="range"
          min={1}
          max={5}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-muted-foreground">{score} / 5</span>
      </label>

      <div className="space-y-2">
        {prompts.map((p) => (
          <label
            key={p.id}
            className="flex items-start gap-2 text-sm rounded-xl border px-3 py-2"
          >
            <input
              type="checkbox"
              checked={Boolean(checks[p.id])}
              onChange={(e) =>
                setChecks((prev) => ({ ...prev, [p.id]: e.target.checked }))
              }
              className="mt-0.5"
            />
            <span>{p.label}</span>
          </label>
        ))}
      </div>

      {role === "client" ? (
        <label className="block space-y-1.5 text-sm">
          <span className="font-medium">Commentaire (optionnel)</span>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border px-3 py-2 text-sm"
          />
        </label>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-[#A07070] text-sm font-bold text-[#F2EBE0] disabled:opacity-60"
      >
        {loading
          ? "Envoi…"
          : role === "coach"
            ? "Enregistrer le rapport"
            : "Envoyer"}
      </button>
    </form>
  )
}
