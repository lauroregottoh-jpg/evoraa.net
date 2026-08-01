"use client";

import * as React from "react";
import Link from "next/link";
import { CompatibilityCard } from "@/components/compatibility/CompatibilityCard";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff, RefreshCw } from "lucide-react";
import type { CompatibilityListItem } from "@/app/actions/matching";
import { refreshCompatibilitySuggestions } from "@/app/actions/matching";

interface CompatibilityGridProps {
  initialSuggestions: CompatibilityListItem[];
  error?: string;
  needsOnboarding?: boolean;
  /** From platform_settings.default_photo_blur */
  defaultBlurred?: boolean;
}

export function CompatibilityGrid({
  initialSuggestions,
  error,
  needsOnboarding,
  defaultBlurred = true,
}: CompatibilityGridProps) {
  const [globalBlur, setGlobalBlur] = React.useState(defaultBlurred);
  const [suggestions, setSuggestions] = React.useState(initialSuggestions);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [localError, setLocalError] = React.useState(error ?? "");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLocalError("");
    try {
      const result = await refreshCompatibilitySuggestions();
      if (result.error && result.suggestions.length === 0) {
        setLocalError(result.error);
      }
      setSuggestions(result.suggestions);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
        <div className="space-y-3">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
            Découvrir
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-foreground">
            Vos Rencontres en Résonance
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            Suggestions calculées à partir de votre profil et de vos questionnaires (foi,
            localisation, vision du foyer, piliers). Seuls les profils ≥ 60&nbsp;% d&apos;harmonie
            vous sont présentés.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing || needsOnboarding}
            className="rounded-xl h-11 text-xs"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Recalculer
          </Button>

          <div className="flex items-center gap-3 bg-secondary/60 p-3 rounded-2xl border border-border/60">
            <Shield className="h-5 w-5 text-accent shrink-0" />
            <div className="text-xs">
              <span className="font-semibold block text-foreground">Confidentialité Photos</span>
              <span className="text-muted-foreground">
                {defaultBlurred ? "Flou par défaut (réglage plateforme)" : "Photos visibles"}
              </span>
            </div>
            <button
              type="button"
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
      </div>

      <EvaCompanion
        title="EVA - Présentation transparente"
        message="Chaque score s'explique : communauté de foi, proximité, rythme spirituel et vision du mariage croisés avec vos réponses et vos 5 piliers de discernement."
        variant="default"
      />

      {needsOnboarding && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-sm space-y-3">
          <p className="text-foreground font-medium">{localError || "Complétez votre onboarding pour activer le matching."}</p>
          <Link href="/onboarding" className="text-accent font-semibold underline underline-offset-2">
            Continuer mon questionnaire d&apos;accueil
          </Link>
        </div>
      )}

      {!needsOnboarding && localError && suggestions.length === 0 && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {localError}
        </div>
      )}

      {!needsOnboarding && !localError && suggestions.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center space-y-4">
          <p className="font-serif text-xl text-foreground">Aucune suggestion pour le moment</p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Complétez vos questionnaires pour affiner le matching, ou revenez quand d&apos;autres
            profils éligibles (harmonie ≥ 60&nbsp;%) seront présents.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/assessments"
              className="inline-flex h-10 items-center px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Faire les tests
            </Link>
            <Link
              href="/profile"
              className="inline-flex h-10 items-center px-4 rounded-xl border border-border text-sm font-semibold"
            >
              Enrichir mon profil
            </Link>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((profile) => (
            <CompatibilityCard
              key={profile.id}
              profile={{
                id: profile.id,
                name: profile.name,
                age: profile.age || 0,
                city: profile.city,
                community: profile.community,
                harmonyScore: profile.harmonyScore,
                reasons: profile.reasons,
                photoUrl: profile.photoUrl,
                isBlurred: globalBlur,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
