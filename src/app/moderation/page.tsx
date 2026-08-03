"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { SafetyReportModal } from "@/components/safety/SafetyReportModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, UserCheck, AlertCircle, Sparkles, HeartHandshake } from "lucide-react";

export default function ModerationPage() {
  const [showDemoReport, setShowDemoReport] = React.useState(false);

  return (
    <MainLayout maxWidth="4xl">
      <div className="space-y-10 py-6">
        
        <div className="space-y-2">
          <Badge variant="outline" className="border-destructive/40 text-destructive bg-destructive/5 font-sans uppercase tracking-wider text-xs">
            Sprint 8 : Sécurité de la Plateforme
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Modération & Protection Éthique
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Découvrez comment Keliaa garantit un environnement de confiance absolue à travers nos 3 cercles de protection.
          </p>
        </div>

        <EvaCompanion
          title="EVA - Veille Éthique Continue"
          message="Je travaille avec l'équipe de modération et les coachs de KELIAA pour veiller sur la sincérité des profils. Harcèlement, pression et manque de respect n'ont pas leur place ici."
          variant="reassurance"
        />

        {/* 3 Rings of Protection */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
            <CardHeader className="space-y-2">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary dark:text-accent w-fit">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="font-serif text-xl">1. Le Filtre d&apos;Entrée</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>
                La signature de la Charte de Bienveillance & Respect est un prérequis strict. Chaque nouveau profil passe par une vérification par analyse sémantique.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
            <CardHeader className="space-y-2">
              <div className="p-2.5 rounded-xl bg-accent/15 text-accent w-fit">
                <Sparkles className="h-5 w-5 fill-accent/20" />
              </div>
              <CardTitle className="font-serif text-xl">2. Bouclier EVA en Direct</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>
                Dans la messagerie, notre bouclier détecte instantanément les pressions pour obtenir un numéro ou des propos précipités afin d&apos;adoucir le dialogue.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
            <CardHeader className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 w-fit">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="font-serif text-xl">3. Zéro Tolérance 24/7</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-2">
              <p>
                Notre équipe humaine intervient en moins de 2 heures suite à tout signalement confidentiel pour exclure définitivement tout profil frauduleux.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Reporting Flow */}
        <div className="space-y-4 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Tester le Signalement Confidentiel
              </h2>
              <p className="text-xs text-muted-foreground">
                Vous pouvez tester ici la fluidité de notre module de signalement respectueux tel qu&apos;il apparaît dans une conversation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDemoReport(!showDemoReport)}
              className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-semibold border border-destructive/30 transition-colors"
            >
              {showDemoReport ? "Masquer le test" : "Ouvrir le module de signalement"}
            </button>
          </div>

          {showDemoReport && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Aperçu UI uniquement. Pour un signalement réel persisté, utilisez le bouton « Signaler » dans une conversation.
              </p>
              <SafetyReportModal
                partnerName="Alexandre (Test)"
                onClose={() => setShowDemoReport(false)}
              />
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}
