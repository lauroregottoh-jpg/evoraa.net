"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Heart } from "lucide-react"

export type FaithPayload = {
  practice: string
  community: string
  churchName: string
  pastorName: string
  pastorContact: string
}

interface StepFaithProps {
  onNext: (data: FaithPayload) => void | Promise<void>
  onBack: () => void
  defaultValues?: Partial<FaithPayload>
  isSubmitting?: boolean
}

export function StepFaith({
  onNext,
  onBack,
  defaultValues,
  isSubmitting = false,
}: StepFaithProps) {
  const [practice, setPractice] = React.useState(
    String(defaultValues?.practice || "regulier")
  )
  const [community, setCommunity] = React.useState(
    String(defaultValues?.community || "Protestant Évangélique")
  )
  const [churchName, setChurchName] = React.useState(
    String(defaultValues?.churchName || "")
  )
  const [pastorName, setPastorName] = React.useState(
    String(defaultValues?.pastorName || "")
  )
  const [pastorContact, setPastorContact] = React.useState(
    String(defaultValues?.pastorContact || "")
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onNext({
          practice,
          community,
          churchName,
          pastorName,
          pastorContact,
        })
      }}
      className="space-y-7"
    >
      <div className="space-y-2">
        <h3 className="font-serif text-2xl sm:text-3xl font-medium text-foreground">
          Votre chemin de foi
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
          Ces repères aident EVA à comprendre votre ancrage spirituel.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Heart className="h-4 w-4 text-accent" />
          Pratique spirituelle
        </label>
        <select
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          className="w-full h-12 px-3.5 rounded-xl bg-background border border-border/80 text-sm"
        >
          <option value="regulier">Pratiquant régulier</option>
          <option value="cheminement">En cheminement actif</option>
          <option value="occasionnel">Occasionnel, foi centrale</option>
          <option value="engagement_fort">Engagement ministériel / leadership</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Dénomination</label>
        <select
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          required
          className="w-full h-12 px-3.5 rounded-xl bg-background border border-border/80 text-sm"
        >
          <option value="Catholique">Catholique</option>
          <option value="Protestant">Protestant</option>
          <option value="Protestant Évangélique">Protestant Évangélique</option>
          <option value="Assemblées de Dieu">Assemblées de Dieu</option>
          <option value="Baptiste">Baptiste</option>
          <option value="Pentecôtiste">Pentecôtiste</option>
          <option value="Autre chrétien">Autre chrétien</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Église (optionnel pour l’instant)</label>
        <Input
          value={churchName}
          onChange={(e) => setChurchName(e.target.value)}
          placeholder="Ex. Église de la Grâce — Cocody"
          className="h-12 rounded-xl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pasteur / référent (optionnel)</label>
          <Input
            value={pastorName}
            onChange={(e) => setPastorName(e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Contact (optionnel)</label>
          <Input
            value={pastorContact}
            onChange={(e) => setPastorContact(e.target.value)}
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="h-12 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 rounded-xl bg-primary text-primary-foreground"
        >
          Continuer
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
