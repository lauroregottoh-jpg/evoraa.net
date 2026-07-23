"use client";

import * as React from "react";
import { Users, ShieldCheck, Image as ImageIcon, AlertTriangle, TrendingUp, Sparkles, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AdminStats() {
  return (
    <div className="space-y-6">
      
      {/* 4 Key KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Membres Actifs
            </CardTitle>
            <div className="p-2 rounded-xl bg-primary/10 text-primary dark:text-accent">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-foreground">1,482</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+14.2%</span> ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Sincérité ⭐⭐⭐ (100%)
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-foreground">89.4%</div>
            <p className="text-xs text-muted-foreground mt-1">
              des profils ont la caution pastorale
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Photos à Modérer
            </CardTitle>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ImageIcon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-foreground">14</div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
              ⚠️ File d&apos;attente prioritaire
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Signalements Ouverts
            </CardTitle>
            <div className="p-2 rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-destructive">1</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enquête de sécurité en cours
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Sanctuary Health Breakdown */}
      <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" /> Santé Éthique & Répartition des Profils
            </h3>
            <p className="text-xs text-muted-foreground">
              Statistiques des 4 piliers de notre charte sur l&apos;ensemble de la base
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary dark:text-accent">Mise à jour en direct</Badge>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 pt-2">
          <div className="space-y-2 p-4 rounded-xl bg-secondary/40 border border-border/40">
            <span className="text-xs font-semibold text-muted-foreground">Charte Signée (4 Piliers)</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-serif font-bold text-foreground">100%</span>
              <span className="text-[10px] text-emerald-500 font-semibold">Obligatoire</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-full" />
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-secondary/40 border border-border/40">
            <span className="text-xs font-semibold text-muted-foreground">Harmonie &gt; 85% lors des rencontres</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-serif font-bold text-foreground">92.8%</span>
              <span className="text-[10px] text-accent font-semibold">Excellence EVA</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full w-[93%]" />
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-secondary/40 border border-border/40">
            <span className="text-xs font-semibold text-muted-foreground">Rétention en Salon Digne</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-serif font-bold text-foreground">84.1%</span>
              <span className="text-[10px] text-primary font-semibold">Dialogue serein</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[84%]" />
            </div>
          </div>
        </div>
      </Card>

    </div>
  );
}
