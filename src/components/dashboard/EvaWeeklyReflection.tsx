"use client";

import * as React from "react";
import { Sparkles, BookOpen, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EvaWeeklyReflection() {
  return (
    <Card className="rounded-2xl border-accent/50 bg-gradient-to-br from-accent/15 via-background to-primary/10 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
      
      <CardContent className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-5 w-5 fill-accent" />
            <span className="text-xs uppercase tracking-widest font-semibold">Méditation de la Semaine</span>
          </div>
          <span className="text-xs font-serif italic text-muted-foreground bg-background/80 px-3 py-1 rounded-full border border-border/60">
            Saison du Discernement
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            « La Patience dans la Rencontre et la Promesse de Paix »
          </h3>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Dans un monde qui exige la vitesse et la consommation instantanée des profils, le discernement chrétien nous rappelle que les fondations d&apos;un foyer solide se posent dans la patience. Ne craignez pas les temps de silence ou d&apos;attente : ils purifient notre intention et préparent nos cœurs à un accueil authentique.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs font-serif text-foreground/90 italic border-t border-border/40">
          <BookOpen className="h-4 w-4 text-accent shrink-0 not-italic" />
          <span>
            « Attends-toi à l&apos;Éternel, fortifie-toi, et que ton cœur s&apos;affermisse. » (Psaume 27:14)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
