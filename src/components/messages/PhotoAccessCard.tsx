"use client";

import * as React from "react";
import { Eye, ShieldCheck, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PhotoAccessCardProps {
  requesterName: string;
  status: "pending" | "granted" | "postponed";
  onGrant: () => void;
  onPostpone: () => void;
  className?: string;
}

export function PhotoAccessCard({
  requesterName,
  status,
  onGrant,
  onPostpone,
  className,
}: PhotoAccessCardProps) {
  return (
    <Card className={`rounded-2xl border-border/80 bg-secondary/60 backdrop-blur-sm p-4 sm:p-5 shadow-2xs ${className || ""}`}>
      <CardContent className="p-0 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent/15 text-accent shrink-0">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-foreground">
                Demande de visibilité en clarté
              </h4>
              <p className="text-xs text-muted-foreground">
                {requesterName} souhaite découvrir votre photo nette pour progresser dans le discernement.
              </p>
            </div>
          </div>

          <span className="text-[10px] uppercase font-semibold tracking-wider bg-background/80 px-2.5 py-1 rounded-full border border-border/60 shrink-0">
            Respect V1
          </span>
        </div>

        {status === "pending" && (
          <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-border/40">
            <Button
              type="button"
              size="sm"
              onClick={onGrant}
              className="rounded-xl h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-2xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Accorder l&apos;accès photo</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onPostpone}
              className="rounded-xl h-9 px-3 text-xs border-border/80 text-muted-foreground hover:text-foreground flex items-center gap-1.5"
            >
              <Clock className="h-3.5 w-3.5 text-accent" />
              <span>Attendre en douceur</span>
            </Button>
          </div>
        )}

        {status === "granted" && (
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Vous avez accordé l&apos;accès à votre photo vérifiée. La confiance mutuelle s&apos;approfondit.</span>
          </div>
        )}

        {status === "postponed" && (
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-background/60 p-2.5 rounded-xl border border-border/40">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            <span>Vous avez choisi de poursuivre l&apos;échange avant d&apos;afficher votre photo. Votre rythme est respecté.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
