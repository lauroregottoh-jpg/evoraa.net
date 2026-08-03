"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, HeartHandshake, Home, MessageCircle } from "lucide-react";

interface StepValuesProps {
  onNext: (data: any) => void | Promise<void>;
  onBack: () => void;
  defaultValues?: any;
  isSubmitting?: boolean;
}

export function StepValues({ onNext, onBack, defaultValues, isSubmitting = false }: StepValuesProps) {
  const [marriageVision, setMarriageVision] = React.useState(
    defaultValues?.marriageVision || "Un engagement sacré, un partenariat fondé sur la prière commune et le soutien mutuel dans toutes les saisons."
  );
  const [familyProject, setFamilyProject] = React.useState(
    defaultValues?.familyProject || "Désir d'accueillir des enfants et d'instaurer un foyer chaleureux et hospitalier."
  );
  const [communicationStyle, setCommunicationStyle] = React.useState(
    defaultValues?.communicationStyle || "dialogue_doux"
  );
  const [marriageTimeline, setMarriageTimeline] = React.useState(
    defaultValues?.marriageTimeline || "1_year"
  );
  const [partnerChildren, setPartnerChildren] = React.useState(
    defaultValues?.partnerChildren || "open"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      marriageVision,
      familyProject,
      communicationStyle,
      marriageTimeline,
      partnerChildren,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-serif text-2xl font-medium text-foreground">
          Étape 2 : Vision de la Relation & du Foyer
        </h3>
        <p className="text-sm text-muted-foreground">
          Ce sont ces éléments profonds qui permettent d&apos;éviter les rencontres superficielles et d&apos;aligner vos projets de vie.
        </p>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <HeartHandshake className="h-4 w-4 text-accent" /> Votre vision du mariage chrétien
        </label>
        <Textarea
          value={marriageVision}
          onChange={(e) => setMarriageVision(e.target.value)}
          placeholder="Exprimez avec vos mots ce que représente l'engagement conjugal à vos yeux..."
          className="rounded-xl min-h-24 bg-background border-border/80 text-sm leading-relaxed"
          required
        />
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Home className="h-4 w-4 text-accent" /> Projet de famille & éducation
        </label>
        <Textarea
          value={familyProject}
          onChange={(e) => setFamilyProject(e.target.value)}
          placeholder="Souhaitez-vous des enfants ? Comment imaginez-vous l'ambiance de votre futur foyer ?"
          className="rounded-xl min-h-24 bg-background border-border/80 text-sm leading-relaxed"
          required
        />
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Home className="h-4 w-4 text-accent" /> Horizon de projet de mariage
        </label>
        <select
          value={marriageTimeline}
          onChange={(e) => setMarriageTimeline(e.target.value)}
          className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="3_months">Dans les 3 mois</option>
          <option value="6_months">Dans les 6 mois</option>
          <option value="1_year">Dans l&apos;année</option>
          <option value="2_years">Dans les 2 ans</option>
          <option value="open">Sans échéance précise</option>
        </select>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Home className="h-4 w-4 text-accent" /> Partenaire avec enfants déjà présents ?
        </label>
        <select
          value={partnerChildren}
          onChange={(e) => setPartnerChildren(e.target.value)}
          className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="without">Je préfère sans enfants déjà présents</option>
          <option value="with">Ouvert(e) à un partenaire avec enfants</option>
          <option value="open">Pas de préférence</option>
        </select>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-accent" /> Gestion du dialogue en cas de désaccord
        </label>
        <select
          value={communicationStyle}
          onChange={(e) => setCommunicationStyle(e.target.value)}
          className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="dialogue_doux">Dialogue posé immédiat après un temps de prière ou de calme</option>
          <option value="ecoute_active">Écoute active en priorité pour comprendre le ressenti de l&apos;autre</option>
          <option value="reflexion_puis_echange">Besoin d&apos;un court recul personnel avant de revenir échanger en paix</option>
          <option value="mediateur_ou_conseil">Ouverture au conseil d&apos;un coach ou d&apos;un mentor de confiance</option>
        </select>
      </div>

      <div className="pt-6 border-t border-border/40 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="h-11 px-6 rounded-xl font-medium border-border/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-8 rounded-xl font-medium bg-accent hover:bg-accent/90 text-accent-foreground shadow-xs"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span>{isSubmitting ? "Enregistrement..." : "Finaliser et Lancer le Diagnostic EVA"}</span>
        </Button>
      </div>
    </form>
  );
}
