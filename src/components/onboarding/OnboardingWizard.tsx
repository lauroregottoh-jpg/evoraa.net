"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { EvaCompanion } from "@/components/evoraa/EvaCompanion"
import { StepBasics, type BasicsPayload } from "@/components/onboarding/StepBasics"
import { StepFaith, type FaithPayload } from "@/components/onboarding/StepFaith"
import { StepValues } from "@/components/onboarding/StepValues"
import { StepCharter } from "@/components/register/StepCharter"
import { acceptCharterAction } from "@/app/actions/auth"
import {
  saveOnboardingBasicsAction,
  saveOnboardingAction,
  type OnboardingPayload,
} from "@/app/actions/onboarding"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { cn } from "@/utils/cn"

type Phase = "charter" | "basics" | "faith" | "values"

const PHASE_META: Record<
  Exclude<Phase, "charter">,
  { label: string; pct: number; index: number }
> = {
  basics: { label: "Essentiel", pct: 12, index: 0 },
  faith: { label: "Foi", pct: 22, index: 1 },
  values: { label: "Vision", pct: 35, index: 2 },
}

export function OnboardingWizard({
  needsCharter = true,
  initialBasics,
  essentialsComplete = false,
}: {
  needsCharter?: boolean
  initialBasics?: Partial<BasicsPayload>
  /** Si l’essentiel est déjà rempli (ex. Découverte → Alliance), on ne le re-demande pas. */
  essentialsComplete?: boolean
}) {
  const router = useRouter()
  const startPhase: Phase = needsCharter
    ? "charter"
    : essentialsComplete
      ? "faith"
      : "basics"
  const [phase, setPhase] = React.useState<Phase>(startPhase)
  const [charterAccepted, setCharterAccepted] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<OnboardingPayload>>({
    firstName: initialBasics?.firstName,
    lastName: initialBasics?.lastName,
    gender: initialBasics?.gender,
    birthDate: initialBasics?.birthDate,
    city: initialBasics?.city,
    country: initialBasics?.country,
  })
  const [error, setError] = React.useState("")
  const [isSaving, setIsSaving] = React.useState(false)

  const handleCharterContinue = async () => {
    setError("")
    setIsSaving(true)
    try {
      const result = await acceptCharterAction()
      if (result.error) {
        setError(result.error)
        return
      }
      setPhase(essentialsComplete ? "faith" : "basics")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleBasics = async (data: BasicsPayload) => {
    setError("")
    setIsSaving(true)
    try {
      const result = await saveOnboardingBasicsAction(data)
      if (result?.error) {
        setError(result.error)
        return
      }
      setFormData((prev) => ({
        ...prev,
        firstName: data.firstName,
        gender: data.gender,
        birthDate: data.birthDate,
        city: data.city,
        country: data.country,
      }))
      setPhase("faith")
      window.scrollTo({ top: 0, behavior: "smooth" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFaith = (data: FaithPayload) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setPhase("values")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleValues = async (data: Partial<OnboardingPayload>) => {
    const finalData = {
      ...formData,
      ...data,
      age: ageFromBirthDate(String(formData.birthDate || "")),
    } as OnboardingPayload
    setError("")
    setIsSaving(true)
    try {
      const result = await saveOnboardingAction(finalData)
      if (result?.error) {
        setError(result.error)
        return
      }
      router.push("/onboarding/magic-screen")
    } finally {
      setIsSaving(false)
    }
  }

  const profilePhase = phase === "charter" ? null : PHASE_META[phase]

  return (
    <div className="space-y-8">
      {phase !== "charter" && profilePhase ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Étape {profilePhase.index + 1} sur 3 · {profilePhase.label}
            </span>
            <span className="font-medium text-foreground">
              {profilePhase.pct}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out"
              style={{ width: `${profilePhase.pct}%` }}
            />
          </div>
          <div className="flex gap-2">
            {(["basics", "faith", "values"] as const).map((key) => (
              <div
                key={key}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-500",
                  PHASE_META[key].index <= profilePhase.index
                    ? "bg-accent"
                    : "bg-border"
                )}
              />
            ))}
          </div>
        </div>
      ) : null}

      <EvaCompanion
        title="EVA vous accompagne"
        variant="suggestion"
        message={
          phase === "charter"
            ? "Lisez la charte avec attention — c’est le socle de la communauté Keliaa."
            : phase === "basics"
              ? "Nom, prénom, sexe et pays : seulement l’essentiel pour démarrer."
              : phase === "faith"
                ? "Parlez un peu de votre ancrage spirituel — vous pourrez enrichir plus tard."
                : "Votre vision du foyer compte beaucoup pour des compatibilités sincères."
        }
      />

      {error ? (
        <Alert
          variant="destructive"
          className="rounded-xl border-destructive/40 bg-destructive/10 text-destructive text-xs"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card className="rounded-3xl border-border/50 bg-background/90 backdrop-blur-md shadow-sm">
        <CardContent className="p-6 sm:p-10">
          {phase === "charter" ? (
            <StepCharter
              accepted={charterAccepted}
              onAcceptedChange={setCharterAccepted}
              onContinue={() => {
                if (isSaving) return
                void handleCharterContinue()
              }}
              continueLabel={isSaving ? "Enregistrement…" : "J’accepte et je continue"}
            />
          ) : null}
          {phase === "basics" ? (
            <StepBasics
              onNext={handleBasics}
              defaultValues={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                gender: formData.gender,
                birthDate: formData.birthDate,
                city: formData.city,
                country: formData.country,
              }}
              isSubmitting={isSaving}
            />
          ) : null}
          {phase === "faith" ? (
            <StepFaith
              onNext={handleFaith}
              onBack={() => {
                if (essentialsComplete) {
                  if (needsCharter) setPhase("charter")
                  return
                }
                setPhase("basics")
              }}
              defaultValues={formData}
              isSubmitting={isSaving}
            />
          ) : null}
          {phase === "values" ? (
            <StepValues
              onNext={handleValues}
              onBack={() => setPhase("faith")}
              defaultValues={formData}
              isSubmitting={isSaving}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

function ageFromBirthDate(iso: string): string {
  if (!iso) return "28"
  const birth = new Date(iso)
  if (Number.isNaN(birth.getTime())) return "28"
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1
  return String(Math.max(18, Math.min(99, age)))
}
