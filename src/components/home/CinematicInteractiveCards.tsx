"use client";

import * as React from "react";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

export function CinematicInteractiveCards() {
  const cards = [
    {
      title: "Confidentialité Absolue",
      desc: "Floutage par défaut des photos, contrôle total sur qui peut consulter vos informations.",
      icon: <Lock className="h-6 w-6 text-primary" />,
      features: ["Photos protégées", "Contrôle d'accès"],
      color: "border-border",
    },
    {
      title: "Modération Stricte",
      desc: "Une équipe dédiée veille au respect de la charte de bienveillance. Tolérance zéro.",
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      features: ["Signalement 24/7", "Bouclier EVA"],
      color: "border-primary",
      elevated: true,
    },
    {
      title: "Profils Certifiés",
      desc: "Chaque membre est validé manuellement. Le sérieux et l'authenticité sont de rigueur.",
      icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
      features: ["Vérification d'identité", "Charte signée"],
      color: "border-border",
    }
  ];

  return (
    <section className="py-24 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto space-y-16">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-sm font-sans font-semibold text-primary uppercase tracking-widest">
          SÉCURITÉ & DIGNITÉ
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          L&apos;assurance d&apos;un environnement sain
        </h2>
        <p className="text-lg text-muted-foreground">
          Nous prenons la sécurité de nos membres très au sérieux pour que vous puissiez vous concentrer sur l&apos;essentiel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={cn(
              "group relative p-8 rounded-lg bg-white border flex flex-col transition-all duration-300",
              card.color,
              card.elevated ? "shadow-elevated md:-translate-y-2 z-10" : "shadow-card"
            )}
          >
            <div className="p-3.5 rounded-xl bg-secondary w-fit mb-6 border border-border">
              {card.icon}
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-foreground mb-3">{card.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1">
              {card.desc}
            </p>

            <div className="space-y-3 pt-6 border-t border-border/60">
              {card.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  {feat}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}
