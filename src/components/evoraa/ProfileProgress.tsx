"use client";

import * as React from "react";
import { Star, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

export type ProfileLevel = "essential" | "complete" | "premium" | "expert" | "optimized";

interface ProfileProgressProps {
  percentage: number;
  onEnrichClick?: () => void;
  className?: string;
}

export function ProfileProgress({
  percentage = 78,
  onEnrichClick,
  className,
}: ProfileProgressProps) {
  const getLevelInfo = (pct: number) => {
    if (pct >= 100) return { stars: 5, label: "Profil Optimisé", level: "optimized" };
    if (pct >= 92) return { stars: 4, label: "Profil Expert", level: "expert" };
    if (pct >= 85) return { stars: 3, label: "Profil Premium", level: "premium" };
    if (pct >= 78) return { stars: 2, label: "Profil Complet", level: "complete" };
    return { stars: 1, label: "Profil Essentiel", level: "essential" };
  };

  const { stars, label } = getLevelInfo(percentage);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-background/80 backdrop-blur-md p-5 shadow-xs space-y-4",
        className
      )}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="flex text-accent">
            {[1, 2, 3, 4, 5].map((starIdx) => (
              <Star
                key={starIdx}
                className={cn(
                  "h-4 w-4 transition-colors",
                  starIdx <= stars
                    ? "fill-accent text-accent"
                    : "fill-muted text-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <span className="font-serif font-medium text-base text-foreground">
            {label} ({percentage}%)
          </span>
        </div>

        {percentage >= 78 && (
          <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium px-2.5 py-1 rounded-full border border-emerald-500/20">
            ✓ Prêt pour les compatibilités
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Psychological Reassurance + Infinite Profile Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-border/40 text-xs">
        <p className="text-muted-foreground leading-relaxed">
          {percentage < 78 ? (
            <span>Complétez les champs de base pour atteindre le statut <b>Profil Complet</b>.</span>
          ) : (
            <span>
              Votre profil est <b className="text-foreground">complet</b>. Débloquez encore plus de précision en répondant à quelques nouvelles questions.
            </span>
          )}
        </p>

        {onEnrichClick && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onEnrichClick}
            className="text-accent hover:text-accent hover:bg-accent/10 h-8 px-3 rounded-lg self-start sm:self-auto shrink-0 font-medium"
          >
            Enrichir mon profil <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
