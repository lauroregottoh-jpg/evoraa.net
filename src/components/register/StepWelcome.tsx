"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Heart, Shield, Sparkles } from "lucide-react"

export function StepWelcome({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="space-y-10">
      <div className="space-y-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Rencontres chrétiennes sérieuses
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] leading-tight text-foreground">
          Bienvenue sur{" "}
          <span className="text-primary">KELIAA</span>
        </h1>
        <p className="mx-auto max-w-md text-base text-muted-foreground leading-relaxed">
          Un espace de discernement pour celles et ceux qui cherchent un
          projet de vie conjugal sincère, ancré dans la foi — sans pression,
          sans superficialité.
        </p>
      </div>

      <ul className="mx-auto grid max-w-lg gap-4">
        {[
          {
            icon: Heart,
            title: "Intention claire",
            text: "Des membres engagés pour le mariage, pas pour collectionner des likes.",
          },
          {
            icon: Shield,
            title: "Cadre bienveillant",
            text: "Une charte de respect et une modération humaine + EVA.",
          },
          {
            icon: Sparkles,
            title: "Compatibilités profondes",
            text: "Des questionnaires qui vont au-delà des photos.",
          },
        ].map((item) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-2xl border border-border/50 bg-background/60 px-4 py-4 backdrop-blur-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <item.icon className="h-5 w-5" />
            </div>
            <div className="space-y-0.5 text-left">
              <p className="font-serif text-lg text-foreground">{item.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-center gap-3 pt-2">
        <Button
          type="button"
          onClick={onContinue}
          className="h-12 w-full max-w-sm rounded-xl bg-primary text-primary-foreground text-base font-medium shadow-elevated hover:bg-primary/90"
        >
          Commencer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground">
          2 minutes pour créer votre compte · Sans engagement
        </p>
      </div>
    </div>
  )
}
