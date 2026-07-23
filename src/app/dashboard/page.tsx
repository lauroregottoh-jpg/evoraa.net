"use client";

import * as React from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaWeeklyReflection } from "@/components/dashboard/EvaWeeklyReflection";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { ProfileProgress } from "@/components/evoraa/ProfileProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageCircle, Heart, User, Sliders, ArrowRight, ShieldCheck, Eye, Moon } from "lucide-react";

export default function DashboardPage() {
  return (
    <MainLayout maxWidth="6xl">
      <div className="space-y-10 py-6">
        
        {/* Header & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
              Sprint 7 : Centre de Discernement
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Espace de Laure
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" /> Membre vérifié(e) • Charte signée
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/settings">
              <Button variant="outline" size="sm" className="rounded-xl h-10 px-4 text-xs font-medium border-border/80 flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Préférences & Retraite</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button size="sm" className="rounded-xl h-10 px-4 text-xs font-medium bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-1.5 shadow-2xs">
                <User className="h-3.5 w-3.5" />
                <span>Compléter à 100% ⭐</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Weekly Meditation from EVA */}
        <EvaWeeklyReflection />

        {/* Profile Progress Widget */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Maturité de votre Profil
            </h2>
            <Link href="/profile" className="text-xs font-medium text-accent hover:underline flex items-center gap-1">
              <span>Éditer mon témoignage et mes photos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ProfileProgress percentage={78} />
        </div>

        {/* Quick Insights Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Card 1: Messages & Mediation */}
          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary dark:text-accent">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <Badge className="bg-accent/15 text-accent border-0">1 non lu</Badge>
              </div>
              <CardTitle className="font-serif text-xl">Messagerie Digne</CardTitle>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Alexandre a répondu à la suggestion d&apos;EVA sur l&apos;hospitalité dans le foyer.
              </p>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <Link href="/messages" className="w-full block">
                <Button variant="outline" className="w-full rounded-xl text-xs font-medium border-border/80 hover:bg-primary hover:text-primary-foreground">
                  <span>Accéder à mes dialogues</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 2: High Harmonies */}
          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-accent/15 text-accent">
                  <Heart className="h-5 w-5 fill-accent/20" />
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0">&gt; 88% d&apos;harmonie</Badge>
              </div>
              <CardTitle className="font-serif text-xl">Espace de Rencontres</CardTitle>
              <p className="text-xs text-muted-foreground leading-relaxed">
                3 profils vérifiés partagent votre attachement à la prière et à la douceur dans le dialogue.
              </p>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <Link href="/compatibility" className="w-full block">
                <Button variant="outline" className="w-full rounded-xl text-xs font-medium border-border/80 hover:bg-accent hover:text-accent-foreground">
                  <span>Explorer les 3 profils</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 3: Privacy & Retreat */}
          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-secondary text-foreground">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">Respect V1</Badge>
              </div>
              <CardTitle className="font-serif text-xl">Confidentialité & Photo</CardTitle>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Vos photos sont actuellement protégées par floutage. 1 demande d&apos;accès en attente de votre réponse.
              </p>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <Link href="/messages/1" className="w-full block">
                <Button variant="outline" className="w-full rounded-xl text-xs font-medium border-border/80 hover:bg-secondary/80">
                  <span>Gérer la demande photo</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

        </div>

        {/* EVA Advice */}
        <EvaCompanion
          title="EVA - Discernement Serein"
          message="Votre espace est en parfaite harmonie avec vos critères. N'oubliez pas que si vous avez besoin d'un temps exclusif de réflexion ou de jeûne, vous pouvez activer le Mode Retraite dans vos préférences."
          variant="suggestion"
        />

      </div>
    </MainLayout>
  );
}
