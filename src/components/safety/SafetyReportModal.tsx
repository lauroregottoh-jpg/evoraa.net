"use client";

import * as React from "react";
import { ShieldAlert, CheckCircle2, Lock, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitSafetyReportAction } from "@/app/actions/reports";

interface SafetyReportModalProps {
  partnerName: string;
  reportedUserId?: string;
  onClose?: () => void;
  className?: string;
}

export function SafetyReportModal({
  partnerName,
  reportedUserId,
  onClose,
  className,
}: SafetyReportModalProps) {
  const [reason, setReason] = React.useState("propos_deplaces");
  const [details, setDetails] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportedUserId) {
      setError("Identifiant du membre manquant — ouvrez le signalement depuis une conversation.");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = await submitSafetyReportAction({
      reportedUserId,
      reasonCode: reason,
      details,
    });
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSubmitted(true);
  };

  return (
    <Card className={`rounded-2xl border-destructive/40 bg-background/95 backdrop-blur-md shadow-sm ${className || ""}`}>
      <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Modération & Sécurité</span>
          </div>
          <CardTitle className="font-serif text-xl text-foreground">
            Signaler un écart à la Charte concernant {partnerName}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Votre signalement est confidentiel et enregistré pour l&apos;équipe de modération.
          </CardDescription>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Motif principal de votre signalement
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-destructive"
              >
                <option value="propos_deplaces">Propos déplacés, impatients ou contraires au respect chrétien</option>
                <option value="authenticite_suspecte">Doute sur la véracité du profil ou des photos</option>
                <option value="sollicitation_commerciale">Sollicitation commerciale ou demande financière suspecte</option>
                <option value="pression_externe">Pression insistante pour échanger hors de KELIAA</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                Précisions complémentaires (facultatif)
              </label>
              <Textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Indiquez brièvement le contexte pour aider notre équipe d'éthique à agir..."
                className="rounded-xl min-h-24 bg-background border-border/80 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 p-3 rounded-xl border border-border/60">
              <Lock className="h-4 w-4 text-accent shrink-0" />
              <span>
                Notre équipe examine chaque alerte. Le membre signalé ne voit pas votre identité.
              </span>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-border/40 pt-4 bg-secondary/20">
            {onClose && (
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="rounded-xl h-9 text-xs">
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="rounded-xl h-9 px-5 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-medium shadow-2xs"
            >
              {submitting ? "Envoi…" : "Transmettre à la modération"}
            </Button>
          </CardFooter>
        </form>
      ) : (
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-foreground">Signalement enregistré</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Merci de préserver la sécurité de la plateforme. L&apos;équipe a reçu votre alerte concernant {partnerName}.
            </p>
          </div>
          {onClose && (
            <Button onClick={onClose} variant="outline" className="rounded-xl text-xs mt-2">
              Fermer cet écran
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}
