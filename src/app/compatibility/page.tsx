"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { CompatibilityCard, CompatibilityProfile } from "@/components/compatibility/CompatibilityCard";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Shield, Eye, EyeOff } from "lucide-react";

const MOCK_PROFILES: CompatibilityProfile[] = [
  {
    id: "1",
    name: "Alexandre",
    age: 31,
    city: "Paris (75)",
    community: "Protestant Évangélique",
    harmonyScore: 94,
    reasons: [
      "Vision partagée du culte en couple",
      "Désir d'accueil et d'hospitalité",
      "Dialogue posé et prière commune",
    ],
    isBlurred: true,
  },
  {
    id: "2",
    name: "Thomas",
    age: 33,
    city: "Lyon (69)",
    community: "Protestant Réformé",
    harmonyScore: 89,
    reasons: [
      "Attachement biblique régulier",
      "Projet familial équilibré",
      "Valeur d'entraide et service",
    ],
    isBlurred: true,
  },
  {
    id: "3",
    name: "Nicolas",
    age: 30,
    city: "Genève / Frontalier",
    community: "Protestant Évangélique",
    harmonyScore: 85,
    reasons: [
      "Engagement musical / ministère",
      "Recherche d'un ancrage conjugal stable",
      "Douceur dans la communication",
    ],
    isBlurred: true,
  },
];

export default function CompatibilityGridPage() {
  const [globalBlur, setGlobalBlur] = React.useState(true);

  return (
    <MainLayout maxWidth="7xl">
      <div className="space-y-10 py-6">
        
        {/* Sanctuary Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
          <div className="space-y-3">
            <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
              Sprint 4 : Espace de Compatibilités
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground">
              Vos Rencontres en Résonance
            </h1>
            <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
              Ici, pas de défilement superficiel. Seuls les profils présentant une réelle harmonie de valeurs spirituelles et conjugales vous sont présentés.
            </p>
          </div>

          {/* Privacy Level Toggle */}
          <div className="flex items-center gap-3 bg-secondary/60 p-3 rounded-2xl border border-border/60 shrink-0 self-start md:self-auto">
            <Shield className="h-5 w-5 text-accent shrink-0" />
            <div className="text-xs">
              <span className="font-semibold block text-foreground">Confidentialité Photos</span>
              <span className="text-muted-foreground">Respect de l&apos;image V1</span>
            </div>
            <button
              onClick={() => setGlobalBlur(!globalBlur)}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border/80 text-xs font-medium hover:border-accent transition-colors shadow-2xs"
            >
              {globalBlur ? (
                <>
                  <EyeOff className="h-3.5 w-3.5 text-accent" />
                  <span>Flouter tout</span>
                </>
              ) : (
                <>
                  <Eye className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Tout afficher</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* EVA Reassurance message */}
        <EvaCompanion
          title="EVA - Présentation transparente"
          message="Chaque profil ci-dessous a été vérifié. Vous pouvez cliquer sur une carte pour lire mon diagnostic complet expliquant pourquoi nos algorithmes ont perçu cette harmonie de vie."
          variant="default"
        />

        {/* Compatibility Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PROFILES.map((profile) => (
            <CompatibilityCard
              key={profile.id}
              profile={{ ...profile, isBlurred: globalBlur }}
            />
          ))}
        </div>

      </div>
    </MainLayout>
  );
}
