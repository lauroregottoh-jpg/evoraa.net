"use client";

import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

const EVENTS = [
  {
    title: "Week-end discernement : bâtir un foyer solide",
    location: "Lyon — salle partenaire",
    date: "14 - 17 octobre 2026",
    type: "Retraite (26-38 ans)",
    description:
      "Quatre jours pour clarifier vos attentes, échanger avec d'autres célibataires sérieux, et repartir avec des outils concrets — sans pression, sans spectacle.",
  },
  {
    title: "Soirée échanges : le rythme d'une rencontre digne",
    location: "Paris 17",
    date: "28 novembre 2026 · 19h30",
    type: "Rencontre en salle",
    description:
      "Une soirée animée par nos coachs partenaires : questions de discernement, témoignages sobres, et le temps de faire connaissance en personne.",
  },
  {
    title: "Week-end service & marche",
    location: "Parc naturel du Vercors",
    date: "12 - 14 décembre 2026",
    type: "Plein air",
    description:
      "Marcher, servir, parler vrai. Un format simple pour se rencontrer autrement que derrière un écran.",
  },
];

export default function CommunityNetworkPage() {
  return (
    <MainLayout maxWidth="5xl">
      <div className="space-y-12 py-6">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs"
          >
            Communauté
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Événements & rencontres en vrai
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Parce qu&apos;une relation sérieuse a aussi besoin d&apos;espaces réels — sobres, bien
            encadrés, et alignés sur vos valeurs.
          </p>
        </div>

        <EvaCompanion
          title="EVA — hors ligne aussi"
          message="KELLIA collabore avec des coachs et des organisateurs de confiance pour proposer des temps forts où vous pouvez vous rencontrer en personne, sans la pression d'un rendez-vous classique."
          variant="reassurance"
        />

        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-serif text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" /> À venir
            </h2>
            <Badge className="bg-primary/10 text-primary border border-primary/20">
              3 événements
            </Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {EVENTS.map((ev) => (
              <Card
                key={ev.title}
                className="rounded-2xl border-border/60 bg-background/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <CardHeader className="space-y-2 pb-4">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wider border-accent/40 text-accent bg-accent/5 w-fit"
                  >
                    {ev.type}
                  </Badge>
                  <CardTitle className="font-serif text-lg leading-snug group-hover:text-accent transition-colors">
                    {ev.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p className="leading-relaxed">{ev.description}</p>
                  <div className="space-y-1.5 text-xs">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-accent" /> {ev.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-accent" /> {ev.date}
                    </p>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-1 w-full h-10 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
                  >
                    Demander des infos <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
