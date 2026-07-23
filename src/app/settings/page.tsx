"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Moon, Bell, Sliders, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [retreatMode, setRetreatMode] = React.useState(false);
  const [maxDistance, setMaxDistance] = React.useState("100");
  const [ageRange, setAgeRange] = React.useState("26-36");
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <MainLayout maxWidth="3xl">
      <div className="space-y-8 py-6">
        
        <div className="space-y-2">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
            Sprint 6 : Réglages & Discrétion
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Préférences de votre Compte
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ajustez vos critères spirituels et activez le mode retraite à tout moment.
          </p>
        </div>

        {/* EVA Reassurance on Retreat Mode */}
        <EvaCompanion
          title="EVA - Le Respect des Saisons spirituelles"
          variant="reflection"
          message="Sur Evoraa, nous comprenons qu'il y a des temps de recherche active et des temps de silence, de jeûne ou de discernement exclusif avec une personne. Le Mode Retraite vous permet de masquer votre profil en toute paix."
        />

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Spiritual Retreat Mode Card */}
          <Card className={`rounded-2xl border transition-all duration-300 ${retreatMode ? "border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/20 shadow-sm" : "border-border/60 bg-background/90 backdrop-blur-md shadow-xs"}`}>
            <CardHeader className="border-b border-border/40 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
                  <Moon className="h-5 w-5 text-accent" />
                  Mode Retraite Spirituelle (Discrétion)
                </CardTitle>
                <Badge className={retreatMode ? "bg-amber-600 text-white" : "bg-secondary text-muted-foreground"}>
                  {retreatMode ? "Retraite Activée (Profil Masqué)" : "Recherche Active"}
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Mettez votre profil en pause temporaire sans perdre vos conversations ni vos réponses au questionnaire.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-lg">
                <span className="text-sm font-semibold text-foreground block">
                  Masquer mon profil des nouvelles compatibilités
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Idéal lorsque vous souhaitez approfondir l&apos;échange avec un partenaire unique, ou prendre un temps de recul dans la prière.
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setRetreatMode(!retreatMode)}
                variant={retreatMode ? "default" : "outline"}
                className={`rounded-xl h-10 px-5 font-medium shrink-0 ${retreatMode ? "bg-amber-600 hover:bg-amber-700 text-white" : "border-border/80"}`}
              >
                {retreatMode ? "Désactiver la retraite" : "Activer la retraite"}
              </Button>
            </CardContent>
          </Card>

          {/* Criteria & Distance */}
          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
            <CardHeader className="border-b border-border/40 pb-4">
              <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
                <Sliders className="h-5 w-5 text-accent" />
                Critères d&apos;Harmonie & Distance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Rayon géographique maximum (km)
                  </label>
                  <select
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
                  >
                    <option value="50">50 km autour de ma ville</option>
                    <option value="100">100 km (Région proche)</option>
                    <option value="300">300 km (Inter-régional)</option>
                    <option value="1000">Toute la France / Suisse / Belgique (Ouverture totale)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Tranche d&apos;âge recherchée
                  </label>
                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
                  >
                    <option value="22-30">22 - 30 ans</option>
                    <option value="26-36">26 - 36 ans</option>
                    <option value="30-42">30 - 42 ans</option>
                    <option value="38-55">38 - 55 ans</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Vos préférences spirituelles ont été enregistrées en paix.
              </div>
            ) : <div />}

            <Button
              type="submit"
              className="h-11 px-8 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs shrink-0 ml-auto"
            >
              <span>Enregistrer mes paramètres</span>
            </Button>
          </div>

        </form>

      </div>
    </MainLayout>
  );
}
