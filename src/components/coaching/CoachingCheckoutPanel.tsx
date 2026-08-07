"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  COACHING_DURATIONS,
  getCoachingPacks,
  type CoachingDurationMinutes,
  type CoachingPackId,
} from "@/lib/billing/coachingOffers"
import { startCoachingCheckoutAction } from "@/app/actions/coaching"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { cn } from "@/utils/cn"

function objectiveCount(minutes: CoachingDurationMinutes) {
  return minutes === 30 ? 2 : 3
}

export function CoachingCheckoutPanel({
  suggestedMode = "mobile_money",
  moduleId,
  moduleTitle,
  initialFirstName = "",
  initialLastName = "",
}: {
  suggestedMode?: BictorysPaymentMode
  moduleId?: string | null
  moduleTitle?: string | null
  initialFirstName?: string
  initialLastName?: string
}) {
  const router = useRouter()
  const [minutes, setMinutes] = React.useState<CoachingDurationMinutes>(30)
  const [packId, setPackId] = React.useState<CoachingPackId>("c4")
  const [mode, setMode] = React.useState<BictorysPaymentMode>(suggestedMode)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const [firstName, setFirstName] = React.useState(initialFirstName)
  const [lastName, setLastName] = React.useState(initialLastName)
  const [subject, setSubject] = React.useState(
    moduleTitle ? `Académie — ${moduleTitle}` : ""
  )
  const [message, setMessage] = React.useState("")
  const [objectives, setObjectives] = React.useState<string[]>(["", "", ""])
  const [phone, setPhone] = React.useState("")

  const packs = React.useMemo(() => getCoachingPacks(minutes), [minutes])
  const selected = packs.find((p) => p.id === packId) || packs[0]
  const objCount = objectiveCount(minutes)

  React.useEffect(() => {
    setMode(suggestedMode)
  }, [suggestedMode])

  React.useEffect(() => {
    setPackId((prev) => {
      const next = getCoachingPacks(minutes)
      return next.some((p) => p.id === prev) ? prev : "c4"
    })
  }, [minutes])

  const setObjective = (index: number, value: string) => {
    setObjectives((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const cleanedObjectives = objectives
      .slice(0, objCount)
      .map((o) => o.trim())
      .filter(Boolean)

    if (cleanedObjectives.length < objCount) {
      setError(
        `Indiquez ${objCount} question${objCount > 1 ? "s" : ""} / objectif${objCount > 1 ? "s" : ""} pour cette durée.`
      )
      setLoading(false)
      return
    }

    try {
      const r = await startCoachingCheckoutAction({
        packId,
        minutes,
        paymentMode: mode,
        moduleId,
        moduleTitle,
        brief: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          subject: subject.trim(),
          message: message.trim(),
          phone: phone.trim(),
          objectives: cleanedObjectives,
        },
      })
      if (r.error) {
        setError(r.error)
        if (r.checkoutPath?.startsWith("/login")) router.push(r.checkoutPath)
        return
      }
      if (r.checkoutPath) {
        if (r.checkoutPath.startsWith("http")) {
          window.location.href = r.checkoutPath
        } else {
          router.push(r.checkoutPath)
        }
        return
      }
      setError("URL de paiement manquante.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={pay}
      className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-7 shadow-card"
    >
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-bold">Votre demande de coaching</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Remplissez le brief, choisissez la formule, puis payez — tout sur cette
          page. Plus c’est clair, plus la séance sera utile.
        </p>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Qui êtes-vous ?
        </legend>
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Prénom</span>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background px-3"
              autoComplete="given-name"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Nom</span>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-background px-3"
              autoComplete="family-name"
            />
          </label>
        </div>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Téléphone (WhatsApp de préférence)</span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full h-11 rounded-xl border border-border bg-background px-3"
            placeholder="+228…"
            autoComplete="tel"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Votre brief
        </legend>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Objet</span>
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full h-11 rounded-xl border border-border bg-background px-3"
            placeholder="Ex. Discernement sur une relation, communication…"
          />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Message (contexte)</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2"
            placeholder="Quelques lignes pour situer votre situation…"
          />
        </label>

        <div className="space-y-2 pt-1">
          <p className="text-sm font-medium">
            Questions auxquelles vous avez besoin de réponses
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              ({objCount} pour une séance de {minutes === 30 ? "30 min" : "1 h"})
            </span>
          </p>
          {Array.from({ length: objCount }).map((_, i) => (
            <label key={i} className="block space-y-1 text-sm">
              <span className="text-xs font-semibold text-muted-foreground">
                Question {i + 1}
              </span>
              <input
                required
                value={objectives[i] ?? ""}
                onChange={(e) => setObjective(i, e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-background px-3"
                placeholder={
                  i === 0
                    ? "Ex. Comment savoir si je suis prêt(e) à m’engager ?"
                    : "Ex. Comment aborder ce sujet avec respect ?"
                }
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Choisir votre formule
        </legend>

        <div className="grid grid-cols-2 gap-2">
          {COACHING_DURATIONS.map((d) => {
            const active = d.minutes === minutes
            return (
              <button
                key={d.minutes}
                type="button"
                onClick={() => setMinutes(d.minutes)}
                className={cn(
                  "rounded-xl border px-3 py-3 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/30"
                )}
              >
                <p className="text-sm font-bold">{d.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  <span className="font-semibold text-foreground">
                    {d.unitXof.toLocaleString("fr-FR")} FCFA
                  </span>
                  {d.listUnitXof > d.unitXof ? (
                    <span className="ml-1 line-through opacity-60">
                      {d.listUnitXof.toLocaleString("fr-FR")}
                    </span>
                  ) : null}{" "}
                  / séance
                </p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  {d.minutes === 30
                    ? "2 questions clés"
                    : "Jusqu’à 3 questions clés"}{" "}
                  · {d.blurb}
                </p>
              </button>
            )
          })}
        </div>

        <div className="space-y-2">
          {packs.map((p) => {
            const active = p.id === packId
            const saved = p.listXof - p.amountXof
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPackId(p.id)}
                className={cn(
                  "w-full text-left rounded-xl border px-4 py-3 transition-colors",
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/30",
                  p.popular && !active && "border-accent/40"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {p.label}
                      {p.popular ? (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-accent font-bold">
                          Populaire
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.hint}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-serif text-lg font-bold text-primary">
                      {p.amountXof.toLocaleString("fr-FR")}
                      <span className="text-xs font-sans font-semibold"> FCFA</span>
                    </p>
                    {saved > 0 ? (
                      <p className="text-[10px] text-muted-foreground line-through">
                        {p.listXof.toLocaleString("fr-FR")} FCFA
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-4 sm:p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Paiement
          </p>
          <p className="text-sm text-muted-foreground">
            Après validation, vous serez redirigé(e) vers le paiement sécurisé.
            Votre brief est déjà enregistré avec la commande.
          </p>
        </div>
        <PaymentModePicker value={mode} onChange={setMode} />
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60"
        >
          {loading
            ? "Préparation du paiement…"
            : `Valider et payer ${selected.amountXof.toLocaleString("fr-FR")} FCFA`}
        </button>
      </div>
    </form>
  )
}
