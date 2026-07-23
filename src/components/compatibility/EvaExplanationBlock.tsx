"use client";

import * as React from "react";
import { Sparkles, Heart, Home, MessageCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EvaExplanationBlockProps {
  partnerName: string;
  harmonyScore: number;
  pillars: {
    spirituality: string;
    familyVision: string;
    dialogue: string;
  };
  className?: string;
}

export function EvaExplanationBlock({
  partnerName,
  harmonyScore,
  pillars,
  className,
}: EvaExplanationBlockProps) {
  return (
    <Card className={`rounded-2xl border-accent/50 bg-gradient-to-br from-accent/10 via-background to-primary/5 shadow-sm overflow-hidden ${className || ""}`}>
      <CardHeader className="border-b border-border/40 pb-4 bg-background/60 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-5 w-5 fill-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider">Transparence EVA</span>
          </div>
          <span className="text-xs font-serif font-bold px-3 py-1 rounded-full bg-accent text-accent-foreground">
            {harmonyScore}% d&apos;harmonie constatée
          </span>
        </div>
        <CardTitle className="font-serif text-2xl text-foreground pt-1">
          Pourquoi {partnerName} vous est proposé(e) ?
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Conformément à notre charte de clarté, voici l&apos;analyse croisée de vos réponses au questionnaire.
        </p>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid gap-5 md:grid-cols-3">
          
          {/* Pillar 1: Spirituality */}
          <div className="space-y-2 p-4 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <Heart className="h-4 w-4 text-accent shrink-0" />
              <span>Spiritualité & Foi</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {pillars.spirituality}
            </p>
          </div>

          {/* Pillar 2: Family Vision */}
          <div className="space-y-2 p-4 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <Home className="h-4 w-4 text-accent shrink-0" />
              <span>Projet de Foyer</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {pillars.familyVision}
            </p>
          </div>

          {/* Pillar 3: Dialogue & Communication */}
          <div className="space-y-2 p-4 rounded-xl bg-background/80 border border-border/60 shadow-2xs">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <MessageCircle className="h-4 w-4 text-accent shrink-0" />
              <span>Dialogue & Sincérité</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {pillars.dialogue}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground italic border-t border-border/40">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 not-italic" />
          <span>
            Cet appariement respecte les critères de distance et d&apos;engagement spirituel indiqués dans votre profil.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
