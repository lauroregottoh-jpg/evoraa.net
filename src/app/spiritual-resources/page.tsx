"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { EvaSpiritualAdvisor } from "@/components/spiritual/EvaSpiritualAdvisor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Sparkles, HeartHandshake, Compass, ArrowRight } from "lucide-react";

const GUIDES = [
  {
    title: "Construire sur le Roc : Les 4 Piliers d'une Fréquentation Chrétienne",
    category: "Fondations",
    summary: "Comment avancer dans la clarté, la pureté d'intention et la prière mutuelle dès les premiers échanges en ligne.",
    readTime: "6 min de lecture",
  },
  {
    title: "Discerner la Paix de Dieu dans le Choix du Conjoint",
    category: "Discernement",
    summary: "Apprendre à faire la distinction entre l'enthousiasme passager et la paix biblique durable qui confirme une union.",
    readTime: "8 min de lecture",
  },
  {
    title: "L'Importance du Dialogue sur la Vision du Foyer et l'Hospitalité",
    category: "Projet de Vie",
    summary: "Pourquoi partager concrètement ses attentes spirituelles, familiales et financières protège l'harmonie conjugale future.",
    readTime: "5 min de lecture",
  },
];

export default function SpiritualResourcesPage() {
  return (
    <MainLayout maxWidth="5xl">
      <div className="space-y-12 py-6">
        
        <div className="space-y-2">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
            Sprint 9 : Discernement & conseils
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Ressources & sagesse pour avancer
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Des repères clairs pour fonder vos rencontres sur la lucidité, la paix intérieure et un projet de vie solide.
          </p>
        </div>

        {/* EVA Spiritual Guidance Intro */}
        <EvaCompanion
          title="EVA — votre compagnon de discernement"
          message="Je suis là pour répondre à vos questions sur la fréquentation chrétienne et vous aider à clarifier ce qui compte vraiment avant de vous engager."
          variant="reflection"
        />

        {/* Interactive Q&A Advisor */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            Interroger EVA
          </h2>
          <EvaSpiritualAdvisor />
        </section>

        {/* Guides & Meditation Library */}
        <section className="space-y-6 border-t border-border/40 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" /> Guides & Articles Fondamentaux
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Lectures sélectionnées pour préparer votre cœur et votre vision au mariage.
              </p>
            </div>
            <Badge className="bg-primary/10 text-primary dark:text-accent border border-primary/20">
              3 Guides d&apos;excellence
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {GUIDES.map((guide, idx) => (
              <Card key={idx} className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                <CardHeader className="space-y-2 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-accent/40 text-accent bg-accent/5">
                      {guide.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground font-sans">
                      {guide.readTime}
                    </span>
                  </div>
                  <CardTitle className="font-serif text-lg leading-snug group-hover:text-accent transition-colors">
                    {guide.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 pb-5 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {guide.summary}
                  </p>
                  <button type="button" className="text-xs font-semibold text-foreground flex items-center gap-1 group-hover:underline pt-2">
                    <span>Consulter le guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
