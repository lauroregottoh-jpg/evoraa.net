"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Clock,
  CreditCard,
  FileText,
  MessageSquareQuote,
  Sparkles,
  UserRound,
} from "lucide-react"
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

const STEPS = [
  {
    n: 1,
    label: "Brief",
    title: "Votre demande",
    hint: "Qui vous êtes et ce que vous voulez clarifier",
    icon: FileText,
    tone: "#5C1F28",
    soft: "rgba(92, 31, 40, 0.07)",
  },
  {
    n: 2,
    label: "Formule",
    title: "Choisir la séance",
    hint: "Durée, nombre de rendez-vous, tarif",
    icon: Clock,
    tone: "#B8954A",
    soft: "rgba(184, 149, 74, 0.12)",
  },
  {
    n: 3,
    label: "Paiement",
    title: "Régler et confirmer",
    hint: "Mobile Money ou carte — brief déjà enregistré",
    icon: CreditCard,
    tone: "#3D4A3A",
    soft: "rgba(61, 74, 58, 0.1)",
  },
] as const

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
        `Indiquez ${objCount} question${objCount > 1 ? "s" : ""} pour cette durée.`
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

  const inputClass =
    "w-full h-11 rounded-xl border border-border/80 bg-white px-3 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/15"

  return (
    <form onSubmit={pay} className="space-y-6">
      {/* Step rail */}
      <ol className="grid grid-cols-3 gap-2 sm:gap-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          return (
            <li
              key={s.n}
              className={cn(
                "relative rounded-2xl border px-3 py-3 sm:px-4 sm:py-3.5 text-left",
                "animate-in fade-in slide-in-from-bottom-2 fill-mode-both",
                "transition-transform duration-300 hover:-translate-y-0.5"
              )}
              style={{
                animationDelay: `${i * 80}ms`,
                background: s.soft,
                borderColor: `${s.tone}33`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ background: s.tone }}
                >
                  {s.n}
                </span>
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-wider truncate"
                    style={{ color: s.tone }}
                  >
                    {s.label}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground truncate flex items-center gap-1">
                    <Icon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    {s.title}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {/* STEP 1 — Brief */}
      <section
        className={cn(
          "rounded-[1.5rem] border overflow-hidden shadow-card",
          "animate-in fade-in slide-in-from-bottom-3 duration-500"
        )}
        style={{ borderColor: "rgba(92,31,40,0.2)" }}
      >
        <header
          className="px-5 sm:px-6 py-4 flex items-start gap-3 text-white"
          style={{
            background:
              "linear-gradient(135deg, #5C1F28 0%, #3D141A 70%, #6B3A2A 140%)",
          }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/20">
            <UserRound className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
              Étape 1 · Brief
            </p>
            <h2 className="font-serif text-2xl font-bold leading-tight">
              Votre demande de coaching
            </h2>
            <p className="text-sm text-white/75 mt-1 leading-relaxed">
              Posez le contexte. Plus c’est clair, plus la séance sera utile.
            </p>
          </div>
        </header>

        <div className="bg-[#FBF8F3] p-5 sm:p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Prénom</span>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                autoComplete="given-name"
              />
            </label>
            <label className="block space-y-1.5 text-sm">
              <span className="font-medium">Nom</span>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                autoComplete="family-name"
              />
            </label>
          </div>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Téléphone (WhatsApp de préférence)</span>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="+228…"
              autoComplete="tel"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Objet</span>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputClass}
              placeholder="Ex. Discernement, communication, timing mariage…"
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Message (contexte)</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-border/80 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              placeholder="Quelques lignes pour situer votre situation…"
            />
          </label>

          <div className="rounded-2xl border border-primary/10 bg-white p-4 space-y-3">
            <div className="flex items-start gap-2">
              <MessageSquareQuote className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <div>
                <p className="text-sm font-semibold">
                  Questions auxquelles vous avez besoin de réponses
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {objCount} question{objCount > 1 ? "s" : ""} pour une séance de{" "}
                  {minutes === 30 ? "30 minutes" : "1 heure"}
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              {Array.from({ length: objCount }).map((_, i) => (
                <label key={i} className="block space-y-1 text-sm">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary/70">
                    Question {i + 1}
                  </span>
                  <input
                    required
                    value={objectives[i] ?? ""}
                    onChange={(e) => setObjective(i, e.target.value)}
                    className={inputClass}
                    placeholder={
                      i === 0
                        ? "Ex. Comment savoir si je suis prêt(e) à m’engager ?"
                        : "Ex. Comment aborder ce sujet avec respect ?"
                    }
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STEP 2 — Formule */}
      <section
        className={cn(
          "rounded-[1.5rem] border overflow-hidden shadow-card",
          "animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
        )}
        style={{
          animationDelay: "100ms",
          borderColor: "rgba(184,149,74,0.35)",
        }}
      >
        <header
          className="px-5 sm:px-6 py-4 flex items-start gap-3"
          style={{
            background:
              "linear-gradient(135deg, #F3E6C4 0%, #E8D5A0 45%, #B8954A 160%)",
          }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5C1F28]/10 border border-[#5C1F28]/15 text-[#5C1F28]">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#5C1F28]/70">
              Étape 2 · Formule
            </p>
            <h2 className="font-serif text-2xl font-bold text-[#1C1412] leading-tight">
              Choisir votre séance
            </h2>
            <p className="text-sm text-[#1C1412]/70 mt-1 leading-relaxed">
              D’abord la durée, puis le nombre de rendez-vous.
            </p>
          </div>
        </header>

        <div className="bg-white p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            {COACHING_DURATIONS.map((d) => {
              const active = d.minutes === minutes
              return (
                <button
                  key={d.minutes}
                  type="button"
                  onClick={() => setMinutes(d.minutes)}
                  className={cn(
                    "relative rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                    "hover:-translate-y-0.5",
                    active
                      ? "border-accent bg-accent/10 shadow-elevated ring-1 ring-accent/40 scale-[1.01]"
                      : "border-border hover:border-accent/40 bg-[#FBF8F3]"
                  )}
                >
                  {active ? (
                    <span className="absolute -top-2 right-3 rounded-full bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 animate-in zoom-in-50 duration-200">
                      Choisi
                    </span>
                  ) : null}
                  <p className="font-serif text-xl font-bold">{d.label}</p>
                  <p className="text-sm mt-1">
                    <span className="font-bold text-primary">
                      {d.unitXof.toLocaleString("fr-FR")} FCFA
                    </span>
                    {d.listUnitXof > d.unitXof ? (
                      <span className="ml-1.5 text-xs line-through text-muted-foreground">
                        {d.listUnitXof.toLocaleString("fr-FR")}
                      </span>
                    ) : null}
                    <span className="text-xs text-muted-foreground"> / séance</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-2 leading-snug">
                    {d.minutes === 30
                      ? "2 questions clés · point précis"
                      : "3 questions clés · plus de profondeur"}
                  </p>
                </button>
              )
            })}
          </div>

          <div
            key={minutes}
            className="space-y-2 animate-in fade-in slide-in-from-right-2 duration-300"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Pack de séances · {minutes === 30 ? "30 min" : "1 h"}
            </p>
            {packs.map((p, i) => {
              const active = p.id === packId
              const saved = p.listXof - p.amountXof
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPackId(p.id)}
                  className={cn(
                    "w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-300",
                    "hover:-translate-y-0.5 animate-in fade-in fill-mode-both",
                    active
                      ? "border-primary bg-primary/[0.06] ring-1 ring-primary shadow-card"
                      : "border-border hover:border-primary/30 bg-[#FBF8F3]",
                    p.popular && !active && "border-accent/45"
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                        {p.label}
                        {p.popular ? (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-accent font-bold">
                            <Sparkles className="h-3 w-3" />
                            Populaire
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.hint}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-xl font-bold text-primary">
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
        </div>
      </section>

      {/* STEP 3 — Paiement */}
      <section
        className={cn(
          "rounded-[1.5rem] border overflow-hidden shadow-elevated",
          "animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both"
        )}
        style={{
          animationDelay: "180ms",
          borderColor: "rgba(61,74,58,0.25)",
        }}
      >
        <header
          className="px-5 sm:px-6 py-4 flex items-start gap-3 text-[#F8F4EE]"
          style={{
            background:
              "linear-gradient(135deg, #2F3D4A 0%, #3D4A3A 55%, #5C1F28 140%)",
          }}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 border border-white/20">
            <CreditCard className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/65">
              Étape 3 · Paiement
            </p>
            <h2 className="font-serif text-2xl font-bold leading-tight">
              Confirmer et payer
            </h2>
            <p className="text-sm text-white/75 mt-1 leading-relaxed">
              Votre brief part avec la commande. Paiement sécurisé ensuite.
            </p>
          </div>
          <div className="hidden sm:block text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-white/55">Total</p>
            <p className="font-serif text-2xl font-bold">
              {selected.amountXof.toLocaleString("fr-FR")}
            </p>
            <p className="text-xs text-white/60">FCFA</p>
          </div>
        </header>

        <div className="bg-[#F4F6F3] p-5 sm:p-6 space-y-5">
          <div className="rounded-2xl border border-border/70 bg-white px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Formule sélectionnée</p>
              <p className="text-sm font-semibold">
                {selected.label} · {minutes === 30 ? "30 min" : "1 h"}
              </p>
            </div>
            <p className="font-serif text-xl font-bold text-primary sm:hidden">
              {selected.amountXof.toLocaleString("fr-FR")} FCFA
            </p>
          </div>

          <PaymentModePicker value={mode} onChange={setMode} />

          {error ? (
            <p className="text-xs text-destructive rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-bold",
              "disabled:opacity-60 transition-all duration-300 hover:brightness-95 hover:scale-[1.01] active:scale-[0.99]"
            )}
          >
            {loading
              ? "Préparation du paiement…"
              : `Valider et payer ${selected.amountXof.toLocaleString("fr-FR")} FCFA`}
          </button>
          <p className="text-center text-[11px] text-muted-foreground">
            Paiement sécurisé · brief enregistré avec la commande
          </p>
        </div>
      </section>
    </form>
  )
}
