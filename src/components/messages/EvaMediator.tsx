"use client";

import * as React from "react";
import { Sparkles, MessageCircleHeart, RefreshCw, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EvaMediatorProps {
  partnerName: string;
  onSelectSuggestion: (text: string) => void;
  className?: string;
}

const SUGGESTIONS = [
  "Qu'est-ce qui vous aide à garder la paix de Dieu dans vos journées bien remplies ?",
  "Quelle est la valeur ou l'habitude spirituelle que vous aimeriez absolument vivre en couple ?",
  "Comment imaginez-vous concrètement l'hospitalité et l'accueil dans votre futur foyer ?",
  "Quel est le passage biblique ou le cantique qui a marqué votre parcours spirituel récent ?",
];

export function EvaMediator({ partnerName, onSelectSuggestion, className }: EvaMediatorProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [inserted, setInserted] = React.useState(false);

  const currentSuggestion = SUGGESTIONS[currentIndex];

  const handleCycle = () => {
    setInserted(false);
    setCurrentIndex((prev) => (prev + 1) % SUGGESTIONS.length);
  };

  const handleUse = () => {
    onSelectSuggestion(currentSuggestion);
    setInserted(true);
    setTimeout(() => setInserted(false), 3000);
  };

  return (
    <Card className={`rounded-2xl border-accent/40 bg-gradient-to-r from-accent/10 via-background to-primary/5 shadow-2xs overflow-hidden ${className || ""}`}>
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-4 w-4 fill-accent shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Médiation spirituelle EVA</span>
          </div>
          <p className="font-serif text-sm sm:text-base text-foreground italic leading-relaxed">
            « {currentSuggestion} »
          </p>
          <span className="text-[11px] text-muted-foreground block">
            Sujet inspiré par vos réponses communes au questionnaire sur l&apos;engagement conjugal.
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCycle}
            className="h-9 px-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            title="Suggérer un autre sujet"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            onClick={handleUse}
            size="sm"
            className="h-9 px-4 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-xs font-medium shadow-2xs"
          >
            {inserted ? (
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Inséré</span>
            ) : (
              <span className="flex items-center gap-1.5"><MessageCircleHeart className="h-3.5 w-3.5" /> Proposer à {partnerName}</span>
            )}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
