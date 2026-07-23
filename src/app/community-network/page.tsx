"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Church, Calendar, MapPin, Sparkles, Users, ArrowRight } from "lucide-react";

const EVENTS = [
  {
    title: "Retraite de Discernement : 'Bâtir son Foyer sur la Parole'",
    location: "Abbaye d'Hautecombe (Savoie)",
    date: "14 - 17 Octobre 2026",
    type: "Retraite Spirituelle (26-38 ans)",
    description: "4 jours de ressourcement, de prière pastorale et de rencontres fraternelles dans un cadre de paix et de beauté sacrée.",
  },
  {
    title: "Soirée Conférence & Louange : 'Le Rythme de la Rencontre'",
    location: "Espace Protestant de l'Étoile (Paris 17)",
    date: "28 Novembre 2026 • 19h30",
    type: "Rencontre Fraternelle en Salle",
    description: "Une soirée modérée par nos pasteurs partenaires pour échanger sur les enjeux du discernement et faire des connaissances en toute liberté.",
  },
  {
    title: "Week-end Service & Randonnée Biblique",
    location: "Parc Naturel du Vercors",
    date: "12 - 14 Décembre 2026",
    type: "Activité Fraternelle de Plein Air",
    description: "Marcher ensemble dans la création divine, prier et partager des temps de louange autour d'un feu de camp bienveillant.",
  },
];

export default function CommunityNetworkPage() {
  return (
    <MainLayout maxWidth="5xl">
      <div className="space-y-12 py-6">
        
        <div className="space-y-2">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs">
            Sprint 10 : Réseau Fraternel
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Événements & Églises Partenaires
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Parce que la rencontre chrétienne s&apos;épanouit aussi dans le monde réel sous le regard de la communauté ecclésiale.
          </p>
        </div>

        <EvaCompanion
          title="EVA - Rencontres Physiques Dignes"
          message="Evoraa s'associe avec des églises et des mouvements pastoraux reconnus pour organiser des retraites et des temps forts où vous pouvez vous rencontrer en personne, loin de la pression des rendez-vous classiques."
          variant="reassurance"
        />

        {/* Events Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" /> Retraites & Événements à Venir
            </h2>
            <Badge className="bg-primary/10 text-primary dark:text-accent border border-primary/20">
              3 Événements certifiés
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {EVENTS.map((ev, i) => (
              <Card key={i} className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
                <CardHeader className="space-y-2 pb-4">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-accent/40 text-accent bg-accent/5 w-fit">
                    {ev.type}
                  </Badge>
                  <CardTitle className="font-serif text-lg leading-snug group-hover:text-accent transition-colors">
                    {ev.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 pb-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 text-xs text-muted-foreground font-sans">
                    <p className="flex items-center gap-1.5 text-foreground font-medium">
                      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" /> {ev.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-accent shrink-0" /> {ev.date}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
                    {ev.description}
                  </p>

                  <Button variant="outline" className="w-full rounded-xl text-xs font-medium border-border/80 hover:bg-accent hover:text-accent-foreground mt-2">
                    <span>S&apos;inscrire à l&apos;événement</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
