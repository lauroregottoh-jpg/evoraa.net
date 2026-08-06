"use client";

import * as React from "react";
import Link from "next/link";
import { CompatibilityCard } from "@/components/compatibility/CompatibilityCard";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
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
  defaultBlurred = false,
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
    <div className="space-y-8 py-6">
      <div className="space-y-3 border-b border-border/40 pb-6">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Découvrir vos compatibilités
        </h1>
        <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
          Suggestions calculées à partir de votre profil et de vos questionnaires (foi,
          communication, foyer, finances…). Cliquez un profil pour voir les points de match.
          Seuls les profils ≥ 60&nbsp;% vous sont proposés.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || needsOnboarding}
            className="rounded-xl"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
          <button
            type="button"
            onClick={() => setGlobalBlur(!globalBlur)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium"
          >
            {globalBlur ? (
              <>
                <Eye className="h-3.5 w-3.5" /> Afficher les photos
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" /> Flouter (optionnel)
              </>
            )}
          </button>
        </div>
      </div>

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
            Complétez vos questionnaires pour affiner le matching, ou revenez plus tard.
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
                domainScores: profile.domainScores,
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
