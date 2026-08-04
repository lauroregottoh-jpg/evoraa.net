"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

const PILLARS = [
  {
    icon: Heart,
    title: "Respect mutuel",
    text: "Chaque personne est créée à l’image de Dieu. Aucun mot blessant ni attitude consumériste.",
  },
  {
    icon: Eye,
    title: "Authenticité",
    text: "Photos et réponses fidèles à qui vous êtes. Profils vérifiés pour préserver la confiance.",
  },
  {
    icon: Sparkles,
    title: "Discernement",
    text: "KELIAA n’est pas un jeu de matches : c’est un espace de projet de vie conjugal.",
  },
  {
    icon: ShieldCheck,
    title: "Zéro pression",
    text: "Un refus ou un silence s’accueille avec paix. EVA veille à la sérénité des échanges.",
  },
] as const

export function StepCharter({
  accepted,
  onAcceptedChange,
  onBack,
  onContinue,
  continueLabel = "Continuer",
}: {
  accepted: boolean
  onAcceptedChange: (v: boolean) => void
  onBack?: () => void
  onContinue: () => void
  continueLabel?: string
}) {
  const [touched, setTouched] = React.useState(false)

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Charte de respect & bienveillance
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-foreground leading-tight">
          Quatre piliers pour un espace digne
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground leading-relaxed">
          Avant de renseigner votre profil, prenez un instant pour lire et
          accepter ces engagements.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PILLARS.map((p, idx) => (
          <article
            key={p.title}
            className="group rounded-2xl border border-border/60 bg-background/70 p-5 backdrop-blur-sm transition-shadow duration-300 hover:shadow-card"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-accent/20 group-hover:text-accent">
              <p.icon className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-xl text-foreground mb-1.5">
              {idx + 1}. {p.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {p.text}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="charter-accept"
            checked={accepted}
            onCheckedChange={(c) => {
              setTouched(true)
              onAcceptedChange(c === true)
            }}
            className="mt-0.5 border-accent data-[state=checked]:bg-accent"
          />
          <label
            htmlFor="charter-accept"
            className="text-sm font-medium text-foreground cursor-pointer leading-relaxed select-none"
          >
            J’ai lu et j’accepte la Charte de Respect et de Bienveillance de
            KELIAA.
          </label>
        </div>
        {touched && !accepted ? (
          <p className="mt-2 text-xs text-red-700">
            Cochez la case pour continuer.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between pt-1">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="h-11 rounded-xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        ) : (
          <span />
        )}
        <Button
          type="button"
          disabled={!accepted}
          onClick={() => {
            if (!accepted) {
              setTouched(true)
              return
            }
            onContinue()
          }}
          className="h-11 rounded-xl bg-primary text-primary-foreground px-8 disabled:opacity-40"
        >
          {continueLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
