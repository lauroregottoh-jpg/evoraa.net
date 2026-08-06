"use client"

import * as React from "react"
import {
  getCoachingPaymentForForm,
  submitCoachingBriefAction,
} from "@/app/actions/coaching"

export function CoachingBriefForm({
  paymentId,
  initialName,
}: {
  paymentId: string
  initialName?: string
}) {
  const [loading, setLoading] = React.useState(true)
  const [status, setStatus] = React.useState<string>("")
  const [packLabel, setPackLabel] = React.useState("")
  const [amount, setAmount] = React.useState(0)
  const [done, setDone] = React.useState(false)
  const [error, setError] = React.useState("")
  const [busy, setBusy] = React.useState(false)

  const [fullName, setFullName] = React.useState(initialName || "")
  const [phone, setPhone] = React.useState("")
  const [city, setCity] = React.useState("")
  const [preferredSlots, setPreferredSlots] = React.useState("")
  const [topic, setTopic] = React.useState("")
  const [notes, setNotes] = React.useState("")

  React.useEffect(() => {
    void (async () => {
      const r = await getCoachingPaymentForForm(paymentId)
      setLoading(false)
      if (r.error || !r.payment) {
        setError(r.error || "Paiement introuvable.")
        return
      }
      setStatus(r.payment.status)
      setPackLabel(
        r.payment.sessions
          ? `${r.payment.sessions} séance(s) de 30 min`
          : r.payment.packId
      )
      setAmount(r.payment.amount)
      if (r.payment.briefSubmitted) setDone(true)
      if (r.payment.moduleTitle) {
        setTopic((t) => t || `Module : ${r.payment!.moduleTitle}`)
      }
    })()
  }, [paymentId])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError("")
    const r = await submitCoachingBriefAction({
      paymentId,
      fullName,
      phone,
      city,
      preferredSlots,
      topic,
      notes,
    })
    setBusy(false)
    if (r.error) {
      setError(r.error)
      return
    }
    setDone(true)
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Chargement…</p>
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-2">
        <h2 className="font-serif text-xl font-bold">Brief reçu</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Merci. L’équipe vous recontacte pour fixer vos séances ({packLabel}
          {amount ? ` · ${amount.toLocaleString("fr-FR")} FCFA` : ""}).
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="space-y-1">
        <h2 className="font-serif text-xl font-bold">Informations pour démarrer</h2>
        <p className="text-xs text-muted-foreground">
          Statut paiement : <strong>{status}</strong>
          {status === "pending"
            ? " (la confirmation Mobile Money peut prendre quelques secondes — envoyez quand même le brief)."
            : ""}
          {" · "}
          {packLabel}
        </p>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Nom complet</span>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full h-11 rounded-xl border border-border px-3"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Téléphone (WhatsApp de préférence)</span>
        <input
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full h-11 rounded-xl border border-border px-3"
          placeholder="+228…"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Ville</span>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full h-11 rounded-xl border border-border px-3"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Sujet / besoin</span>
        <textarea
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border px-3 py-2"
          placeholder="Ex. discernement, communication, projet de mariage…"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Disponibilités (créneaux 30 min)</span>
        <textarea
          required
          value={preferredSlots}
          onChange={(e) => setPreferredSlots(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-border px-3 py-2"
          placeholder="Jours / heures possibles (fuseau)"
        />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Notes (optionnel)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-border px-3 py-2"
        />
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-60"
      >
        {busy ? "Envoi…" : "Envoyer mon brief"}
      </button>
    </form>
  )
}
