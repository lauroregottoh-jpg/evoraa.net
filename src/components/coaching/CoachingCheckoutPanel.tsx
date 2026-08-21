"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CreditCard,
  FileText,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react"
import {
  COACHING_DURATIONS,
  getCoachingPacks,
  type CoachingDurationMinutes,
  type CoachingPackId,
} from "@/lib/billing/coachingOffers"
import { creditsFromPackSessions } from "@/lib/coaching/domain"
import { startCoachingCheckoutAction } from "@/app/actions/coaching"
import { PaymentModePicker } from "@/components/billing/PaymentModePicker"
import type { BictorysPaymentMode } from "@/lib/billing/bictorys"
import { cn } from "@/utils/cn"

/** 30 min → 2 questions | 1 h → 4 questions */
function objectiveCount(minutes: CoachingDurationMinutes) {
  return minutes === 30 ? 2 : 4
}

const STEPS = [
  {
    n: 1 as const,
    label: "Brief",
    title: "Votre demande",
    icon: FileText,
  },
  {
    n: 2 as const,
    label: "Formule",
    title: "Choisir la séance",
    icon: Clock,
  },
  {
    n: 3 as const,
    label: "Paiement",
    title: "Régler et confirmer",
    icon: CreditCard,
  },
]

type StepN = 1 | 2 | 3

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
  const [step, setStep] = React.useState<StepN>(1)
  const [direction, setDirection] = React.useState<"next" | "prev">("next")
  const [minutes, setMinutes] = React.useState<CoachingDurationMinutes>(30)
  const [packId, setPackId] = React.useState<CoachingPackId>("c4")
  const [mode, setMode] = React.useState<BictorysPaymentMode>(suggestedMode)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")
  const [stepError, setStepError] = React.useState("")

  const [firstName, setFirstName] = React.useState(initialFirstName)
  const [lastName, setLastName] = React.useState(initialLastName)
  const [subject, setSubject] = React.useState(
    moduleTitle ? `Académie — ${moduleTitle}` : ""
  )
  const [message, setMessage] = React.useState("")
  const [objectives, setObjectives] = React.useState<string[]>(["", "", "", ""])
  const [phone, setPhone] = React.useState("")
  const [displayAnonymous, setDisplayAnonymous] = React.useState(false)
  /** Répartition : séances de 30 min vs 60 min à partir des crédits du pack. */
  const [splitMode, setSplitMode] = React.useState<"as_pack" | "all_30" | "mix_60">(
    "as_pack"
  )

  const packs = React.useMemo(() => getCoachingPacks(minutes), [minutes])
  const selected = packs.find((p) => p.id === packId) || packs[0]
  const objCount = objectiveCount(minutes)
  const totalCredits = creditsFromPackSessions(
    selected.sessions,
    selected.minutes
  )
  const splitSummary = React.useMemo(() => {
    if (splitMode === "as_pack") {
      return `${selected.sessions}× ${selected.minutes} min (${totalCredits} crédit${totalCredits > 1 ? "s" : ""})`
    }
    if (splitMode === "all_30") {
      return `${totalCredits}× 30 min (${totalCredits} crédit${totalCredits > 1 ? "s" : ""})`
    }
    const sessions60 = Math.floor(totalCredits / 2)
    const rem30 = totalCredits % 2
    return [
      sessions60 > 0 ? `${sessions60}× 60 min` : null,
      rem30 > 0 ? `${rem30}× 30 min` : null,
    ]
      .filter(Boolean)
      .join(" + ")
  }, [splitMode, selected, totalCredits])

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

  const goTo = (target: StepN) => {
    setDirection(target > step ? "next" : "prev")
    setStepError("")
    setError("")
    setStep(target)
  }

  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !subject.trim()) {
      setStepError("Renseignez prénom, nom, téléphone et objet.")
      return false
    }
    const cleaned = objectives
      .slice(0, objCount)
      .map((o) => o.trim())
      .filter(Boolean)
    if (cleaned.length < objCount) {
      setStepError(
        `Pour ${minutes === 30 ? "30 minutes" : "1 heure"}, indiquez ${objCount} questions.`
      )
      return false
    }
    return true
  }

  const next = () => {
    if (step === 1 && !validateStep1()) return
    if (step < 3) goTo((step + 1) as StepN)
  }

  const prev = () => {
    if (step > 1) goTo((step - 1) as StepN)
  }

  const pay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep1()) {
      goTo(1)
      return
    }
    setLoading(true)
    setError("")

    const cleanedObjectives = objectives
      .slice(0, objCount)
      .map((o) => o.trim())
      .filter(Boolean)

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
        splitPlan: {
          mode: splitMode,
          summary: splitSummary,
          totalCredits,
          displayAnonymous,
        },
        displayAnonymous,
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

  const slideClass =
    direction === "next"
      ? "animate-in fade-in slide-in-from-right-4 duration-400"
      : "animate-in fade-in slide-in-from-left-4 duration-400"

  return (
    <form
      onSubmit={(e) => {
        if (step !== 3) {
          e.preventDefault()
          next()
          return
        }
        void pay(e)
      }}
      className="rounded-[1.5rem] border border-border/80 bg-white shadow-elevated overflow-hidden"
    >
      {/* Step tabs — même encart, navigation */}
      <div className="border-b border-border/60 bg-[#F8F4EE] px-3 sm:px-4 pt-3 pb-0">
        <ol className="grid grid-cols-3 gap-1 sm:gap-2">
          {STEPS.map((s) => {
            const Icon = s.icon
            const active = step === s.n
            const done = step > s.n
            return (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => {
                    if (s.n > 1 && s.n > step && !validateStep1()) {
                      goTo(1)
                      return
                    }
                    goTo(s.n)
                  }}
                  className={cn(
                    "w-full rounded-t-xl px-2 py-3 text-left transition-all duration-300",
                    active
                      ? "bg-white shadow-[0_-2px_12px_-4px_rgba(92,31,40,0.12)] border border-b-0 border-border/70 -mb-px relative z-10"
                      : "hover:bg-white/60 text-muted-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                        active || done
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {s.n}
                    </span>
                    <div className="min-w-0 hidden xs:block sm:block">
                      <p
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider truncate",
                          active ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {s.label}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-semibold truncate flex items-center gap-1",
                          active ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3 w-3 shrink-0 opacity-70" />
                        <span className="hidden sm:inline">{s.title}</span>
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="relative overflow-hidden min-h-[28rem]">
        <div key={step} className={cn("p-5 sm:p-7 space-y-5", slideClass)}>
          {step === 1 && (
            <>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold">Votre demande</h2>
                <p className="text-sm text-muted-foreground">
                  Qui vous êtes, le sujet, puis vos questions — selon la durée
                  choisie.
                </p>
              </div>

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
                <span className="font-medium">Téléphone (WhatsApp)</span>
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
                  placeholder="Ex. Discernement, communication…"
                />
              </label>
              <label className="block space-y-1.5 text-sm">
                <span className="font-medium">Message (contexte)</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-border/80 bg-white px-3 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  placeholder="Quelques lignes pour situer votre situation…"
                />
              </label>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Durée de séance
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {COACHING_DURATIONS.map((d) => {
                    const active = d.minutes === minutes
                    const q = objectiveCount(d.minutes)
                    return (
                      <button
                        key={d.minutes}
                        type="button"
                        onClick={() => setMinutes(d.minutes)}
                        className={cn(
                          "relative rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                          active
                            ? "border-primary bg-primary/[0.06] ring-1 ring-primary shadow-card scale-[1.01]"
                            : "border-border hover:border-primary/30 bg-[#FBF8F3]"
                        )}
                      >
                        {active ? (
                          <span className="absolute -top-2 right-3 rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5">
                            Choisi
                          </span>
                        ) : null}
                        <p className="font-serif text-lg font-bold">{d.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {q} question{q > 1 ? "s" : ""} à préparer
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div
                key={minutes}
                className="rounded-2xl border border-primary/10 bg-[#FBF8F3] p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex items-start gap-2">
                  <MessageSquareQuote className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">
                      Questions auxquelles vous avez besoin de réponses
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {objCount} question{objCount > 1 ? "s" : ""} pour{" "}
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
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold">Choisir la séance</h2>
                <p className="text-sm text-muted-foreground">
                  Pack pour vos séances de{" "}
                  <strong className="text-foreground">
                    {minutes === 30 ? "30 minutes" : "1 heure"}
                  </strong>
                  . Vous pouvez encore changer la durée ici.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {COACHING_DURATIONS.map((d) => {
                  const active = d.minutes === minutes
                  return (
                    <button
                      key={d.minutes}
                      type="button"
                      onClick={() => setMinutes(d.minutes)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left transition-all duration-300",
                        active
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border hover:border-accent/40 bg-[#FBF8F3]"
                      )}
                    >
                      <p className="font-serif text-lg font-bold">{d.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {d.unitXof.toLocaleString("fr-FR")} FCFA / séance
                      </p>
                    </button>
                  )
                })}
              </div>

              <div
                key={minutes}
                className="space-y-2 animate-in fade-in slide-in-from-right-2 duration-300"
              >
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
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {p.hint} ·{" "}
                            {creditsFromPackSessions(p.sessions, p.minutes)} crédit
                            {creditsFromPackSessions(p.sessions, p.minutes) > 1
                              ? "s"
                              : ""}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-serif text-xl font-bold text-primary">
                            {p.amountXof.toLocaleString("fr-FR")}
                            <span className="text-xs font-sans font-semibold">
                              {" "}
                              FCFA
                            </span>
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

              <div className="rounded-2xl border border-primary/15 bg-[#FBF8F3] p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold">Répartition des séances</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    1 crédit = 30 min. Choisissez comment utiliser vos{" "}
                    {totalCredits} crédit{totalCredits > 1 ? "s" : ""} dès
                    l’achat.
                  </p>
                </div>
                <div className="grid gap-2">
                  {(
                    [
                      {
                        id: "as_pack" as const,
                        label: `Comme l’offre · ${selected.sessions}× ${selected.minutes} min`,
                      },
                      {
                        id: "all_30" as const,
                        label: `Tout en 30 min · ${totalCredits} séance${totalCredits > 1 ? "s" : ""}`,
                      },
                      {
                        id: "mix_60" as const,
                        label: "Privilégier des séances d’1 h (2 crédits)",
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSplitMode(opt.id)}
                      className={cn(
                        "text-left rounded-xl border px-3 py-2.5 text-sm font-medium",
                        splitMode === opt.id
                          ? "border-primary bg-primary/[0.06]"
                          : "border-border bg-white"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-primary font-semibold">{splitSummary}</p>
              </div>

              <label className="flex items-start gap-2 text-sm rounded-xl border bg-white px-3 py-3">
                <input
                  type="checkbox"
                  checked={displayAnonymous}
                  onChange={(e) => setDisplayAnonymous(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  <strong className="font-semibold">Anonymat d’affichage</strong>
                  <span className="block text-xs text-muted-foreground mt-0.5">
                    Votre nom n’apparaît pas dans la salle. KELIAA et le coach
                    conservent votre identité pour le suivi.
                  </span>
                </span>
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-1">
                <h2 className="font-serif text-2xl font-bold">Régler et confirmer</h2>
                <p className="text-sm text-muted-foreground">
                  Votre brief part avec la commande. Choisissez le mode de
                  paiement.
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-[#F4F6F3] px-4 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Formule</p>
                  <p className="text-sm font-semibold">
                    {selected.label} · {minutes === 30 ? "30 min" : "1 h"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Répartition : {splitSummary}
                    {displayAnonymous ? " · anonymat d’affichage" : ""}
                  </p>
                </div>
                <p className="font-serif text-2xl font-bold text-primary">
                  {selected.amountXof.toLocaleString("fr-FR")}{" "}
                  <span className="text-sm font-sans font-semibold">FCFA</span>
                </p>
              </div>

              <PaymentModePicker value={mode} onChange={setMode} />

              {error ? (
                <p className="text-xs text-destructive rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
                  {error}
                </p>
              ) : null}
            </>
          )}

          {stepError ? (
            <p className="text-xs text-destructive rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2">
              {stepError}
            </p>
          ) : null}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="border-t border-border/60 bg-[#F8F4EE] px-5 sm:px-7 py-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all",
            step === 1
              ? "opacity-40 cursor-not-allowed text-muted-foreground"
              : "border border-border bg-white hover:bg-secondary/60"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 text-sm font-bold hover:brightness-95 transition-all"
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 text-sm font-bold disabled:opacity-60 hover:brightness-95 transition-all"
          >
            {loading
              ? "Préparation…"
              : `Payer ${selected.amountXof.toLocaleString("fr-FR")} FCFA`}
          </button>
        )}
      </div>
    </form>
  )
}
