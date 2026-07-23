"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileProgress } from "@/components/evoraa/ProfileProgress";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { StepEssential } from "@/components/onboarding/StepEssential";
import { StepValues } from "@/components/onboarding/StepValues";
import { saveOnboardingAction, type OnboardingPayload } from "@/app/actions/onboarding";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type OnboardingFormState = Partial<OnboardingPayload>;

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = React.useState<1 | 2>(1);
  const [formData, setFormData] = React.useState<OnboardingFormState>({});
  const [error, setError] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const handleNextFromEssential = (data: Partial<OnboardingPayload>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextFromValues = async (data: Partial<OnboardingPayload>) => {
    const finalData = { ...formData, ...data } as OnboardingPayload;
    setError("");
    setIsSaving(true);

    try {
      const result = await saveOnboardingAction(finalData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push("/onboarding/magic-screen");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Dynamic EVA message depending on step */}
      <EvaCompanion
        title={`EVA - Progression de votre Profil (${step === 1 ? "Étape 1/2" : "Étape 2/2"})`}
        variant="suggestion"
        message={
          step === 1
            ? "Ces premières informations posent la base de votre profil (60%). Elles nous permettent de vérifier la cohérence et l'ancrage spirituel de votre démarche."
            : "Magnifique. Nous atteignons ici le cœur de KELIA (78%). Votre vision du foyer et du mariage est ce qui permettra un vrai discernement conjugal."
        }
      />

      {/* Infinite Profile Progress Component right in the wizard */}
      <ProfileProgress percentage={step === 1 ? 60 : 78} />

      {error && (
        <Alert variant="destructive" className="rounded-xl border-destructive/40 bg-destructive/10 text-destructive text-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form Steps Card */}
      <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm">
        <CardContent className="p-6 sm:p-8">
          {step === 1 ? (
            <StepEssential
              onNext={handleNextFromEssential}
              defaultValues={formData}
            />
          ) : (
            <StepValues
              onNext={handleNextFromValues}
              onBack={() => setStep(1)}
              defaultValues={formData}
              isSubmitting={isSaving}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
