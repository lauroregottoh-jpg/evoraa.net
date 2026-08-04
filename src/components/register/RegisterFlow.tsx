"use client"

import * as React from "react"
import { AuthHeroShell } from "@/components/auth/AuthHeroShell"
import { RegisterProgress } from "@/components/register/RegisterProgress"
import { StepWelcome } from "@/components/register/StepWelcome"
import { StepAccount } from "@/components/register/StepAccount"

type Step = 0 | 1

/**
 * Parcours inscription:
 * 1) Bienvenue → 2) Compte (Google ou e-mail)
 * Puis after login: Charte → profil (onboarding).
 */
export function RegisterFlow() {
  const [step, setStep] = React.useState<Step>(0)

  return (
    <AuthHeroShell>
      <div className="mb-8 w-full max-w-2xl">
        <RegisterProgress step={step} />
      </div>

      <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-[#F3EFE8]/95 p-6 sm:p-10 shadow-premium backdrop-blur-xl">
        {step === 0 ? (
          <StepWelcome onContinue={() => setStep(1)} />
        ) : (
          <StepAccount onBack={() => setStep(0)} />
        )}
      </div>
    </AuthHeroShell>
  )
}
