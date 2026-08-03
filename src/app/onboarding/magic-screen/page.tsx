"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { ProfileProgress } from "@/components/evoraa/ProfileProgress";
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function MagicScreenPage() {
  const router = useRouter();
  const [analyzingStep, setAnalyzingStep] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const steps = [
      setTimeout(() => setAnalyzingStep(1), 800),
      setTimeout(() => setAnalyzingStep(2), 1800),
      setTimeout(() => {
        setAnalyzingStep(3);
        setIsReady(true);
      }, 2800),
    ];
    return () => steps.forEach(clearTimeout);
  }, []);

  return (
    <MainLayout maxWidth="2xl" showFooter={false}>
      <div className="space-y-8 py-8 sm:py-12">
        
        {/* Magic Glowing Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent border border-accent/30 shadow-lg animate-pulse">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground">
            L&apos;Écran Magique d&apos;EVA
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto">
            Analyse éthique et synthèse de vos compatibilités spirituelles.
          </p>
        </div>

        {/* Live Analysis Progress Indicators */}
        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-xl shadow-md p-6">
          <CardContent className="space-y-4 p-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="font-medium text-foreground">Vérification de la sincérité et signature de la Charte</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className={`h-5 w-5 shrink-0 transition-colors duration-500 ${analyzingStep >= 1 ? "text-emerald-500" : "text-muted-foreground/30 animate-pulse"}`} />
                <span className={analyzingStep >= 1 ? "font-medium text-foreground" : "text-muted-foreground"}>
                  Analyse de la vision du mariage et du rythme spirituel
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <CheckCircle2 className={`h-5 w-5 shrink-0 transition-colors duration-500 ${analyzingStep >= 2 ? "text-emerald-500" : "text-muted-foreground/30 animate-pulse"}`} />
                <span className={analyzingStep >= 2 ? "font-medium text-foreground" : "text-muted-foreground"}>
                  Mise en résonance avec les profils vérifiés de KELIAA
                </span>
              </div>
            </div>

            {/* Profile Level confirmation */}
            <div className="pt-4 border-t border-border/40">
              <ProfileProgress percentage={78} />
            </div>
          </CardContent>
        </Card>

        {/* EVA's Psychological & Value Diagnostic */}
        {isReady && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <EvaCompanion
              title="EVA - Diagnostic de Compatibilité"
              variant="reassurance"
              message={
                <div className="space-y-2">
                  <p className="font-serif text-base font-semibold text-foreground">
                    « Votre profil dégage une maturité spirituelle remarquable et une vision conjugale claire. »
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Vous accordez une importance centrale à la prière partagée et à un dialogue posé en cas de désaccord. J&apos;ai identifié dans notre plateforme des profils dont l&apos;attente de vie familiale et d&apos;engagement chrétien s&apos;harmonise parfaitement avec la vôtre.
                  </p>
                </div>
              }
            />

            <Card className="rounded-2xl border-accent/40 bg-gradient-to-br from-accent/10 via-background to-primary/5 p-6 shadow-sm text-center space-y-5">
              <div className="flex justify-center text-accent">
                <Heart className="h-8 w-8 fill-accent/20" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Prochaine étape : les questionnaires
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Trois tests courts enrichissent votre score de compatibilité avant les suggestions.
                </p>
              </div>

              <Button
                onClick={() => router.push("/assessments")}
                className="w-full sm:w-auto h-12 px-8 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-base"
              >
                <span className="flex items-center gap-2">
                  Commencer les questionnaires <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </Card>
          </div>
        )}

      </div>
    </MainLayout>
  );
}
