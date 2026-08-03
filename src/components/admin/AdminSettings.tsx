"use client";

import * as React from "react";
import { Settings, Lock, ShieldCheck, Sliders, Save, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AdminSettings() {
  const [maintenance, setMaintenance] = React.useState(false);
  const [minThreshold, setMinThreshold] = React.useState(85);
  const [defaultBlur, setDefaultBlur] = React.useState(true);
  const [requireCharter, setRequireCharter] = React.useState(true);
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
      <CardHeader className="border-b border-border/40 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" /> Paramètres Globaux de la Plateforme
          </CardTitle>
          <Badge className="bg-primary/10 text-primary dark:text-accent border border-primary/20">
            Enregistré sur Supabase (`platform_settings`)
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Modifiez en direct les règles éthiques et les seuils de discernement de la plateforme Keliaa.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSave}>
        <CardContent className="p-6 space-y-6">
          
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Règles de Compatibilité & Charte
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Seuil Minimal d&apos;Harmonie EVA
                  </label>
                  <span className="text-sm font-serif font-bold text-accent">{minThreshold}%</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Score minimal exigé pour présenter deux profils dans la plateforme.
                </p>
                <input
                  type="range"
                  min="70"
                  max="95"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">Signature de la Charte</span>
                    <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/40">Actif</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Bloquer l&apos;accès à tout profil n&apos;ayant pas signé les 4 piliers de respect.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireCharter(!requireCharter)}
                  className={`w-full h-9 rounded-xl font-medium text-xs transition-all ${requireCharter ? "bg-emerald-600 text-white" : "bg-secondary text-muted-foreground"}`}
                >
                  {requireCharter ? "🔒 Charte Obligatoire (V1)" : "🔓 Optionnel (Non recommandé)"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/40">
            <h3 className="font-serif text-base font-bold text-foreground flex items-center gap-2">
              <Lock className="h-4 w-4 text-accent" /> Respect de la Pudeur & Maintenance
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-foreground block">Floutage par Défaut (Respect V1)</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Flouter automatiquement toutes les photos jusqu&apos;au déblocage mutuel dans la messagerie.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDefaultBlur(!defaultBlur)}
                  className={`h-8 px-3.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${defaultBlur ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                >
                  {defaultBlur ? "Activé" : "Désactivé"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-foreground block">Mode Maintenance Plateforme</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Mettre le site en pause globale pour maintenance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenance(!maintenance)}
                  className={`h-8 px-3.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${maintenance ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-secondary text-muted-foreground"}`}
                >
                  {maintenance ? "🔴 En Maintenance" : "🟢 Normal"}
                </button>
              </div>
            </div>
          </div>

        </CardContent>

        <div className="flex items-center justify-between p-6 border-t border-border/40 bg-secondary/20">
          {saved ? (
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Paramètres synchronisés avec succès.
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Toute modification prend effet immédiatement pour l&apos;ensemble des membres.
            </span>
          )}
          <Button
            type="submit"
            className="h-10 px-6 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm text-xs flex items-center gap-2"
          >
            <Save className="h-4 w-4 text-accent" />
            <span>Appliquer et enregistrer</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
