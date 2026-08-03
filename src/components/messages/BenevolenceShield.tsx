"use client";

import * as React from "react";
import { ShieldAlert, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface BenevolenceShieldProps {
  text: string;
  onSendAnyway: () => void;
  onModify: () => void;
  className?: string;
}

const PRESSURE_KEYWORDS = [
  "vite",
  "réponds",
  "numéro",
  "whatsapp",
  "insta",
  "instagram",
  "immédiatement",
  "t'es où",
  "dépêche",
];

export function checkBenevolence(text: string): boolean {
  if (!text) return true;
  const lower = text.toLowerCase();
  return !PRESSURE_KEYWORDS.some((kw) => lower.includes(kw));
}

export function BenevolenceShield({
  text,
  onSendAnyway,
  onModify,
  className,
}: BenevolenceShieldProps) {
  return (
    <Alert className={`rounded-2xl border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 p-4 sm:p-5 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${className || ""}`}>
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <ShieldAlert className="h-5 w-5" />
        </div>

        <div className="space-y-3 flex-1">
          <div>
            <AlertTitle className="font-serif font-bold text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent fill-accent" />
              Bouclier de Bienveillance EVA
            </AlertTitle>
            <AlertDescription className="text-xs sm:text-sm leading-relaxed mt-1 opacity-90">
              Votre message semble solliciter une réponse rapide ou une transition immédiate vers un réseau externe (ex: numéro, messagerie instantanée). Sur Kellia, nous préservons un rythme apaisé pour laisser grandir la confiance.
            </AlertDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="button"
              size="sm"
              onClick={onModify}
              className="rounded-xl h-9 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-2xs"
            >
              <span>Adoucir ma formulation</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onSendAnyway}
              className="rounded-xl h-9 px-3 text-xs opacity-75 hover:opacity-100 hover:bg-amber-500/10"
            >
              Envoyer tel quel (sans pression)
            </Button>
          </div>
        </div>
      </div>
    </Alert>
  );
}
