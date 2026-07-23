"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { Badge } from "@/components/ui/badge";

export default function OnboardingPage() {
  return (
    <MainLayout maxWidth="2xl" showFooter={false}>
      <div className="space-y-6 py-4">
        <div className="space-y-2">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
            Sprint 3 : Profil Progressif
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-foreground">
            Questionnaire d&apos;Accueil et de Compatibilité
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Répondez en toute sincérité. EVA prépare votre diagnostic et vos premières compatibilités.
          </p>
        </div>

        <OnboardingWizard />
      </div>
    </MainLayout>
  );
}
