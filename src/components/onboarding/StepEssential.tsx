"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Calendar, Heart, User } from "lucide-react";

interface StepEssentialProps {
  onNext: (data: any) => void;
  defaultValues?: any;
}

export function StepEssential({ onNext, defaultValues }: StepEssentialProps) {
  const [age, setAge] = React.useState(defaultValues?.age || "28");
  const [gender, setGender] = React.useState(defaultValues?.gender || "F");
  const [city, setCity] = React.useState(defaultValues?.city || "");
  const [country, setCountry] = React.useState(defaultValues?.country || "Côte d'Ivoire");
  const [practice, setPractice] = React.useState(defaultValues?.practice || "regulier");
  const [community, setCommunity] = React.useState(
    defaultValues?.community || "Protestant Évangélique"
  );
  const [churchName, setChurchName] = React.useState(defaultValues?.churchName || "");
  const [pastorName, setPastorName] = React.useState(defaultValues?.pastorName || "");
  const [pastorContact, setPastorContact] = React.useState(
    defaultValues?.pastorContact || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({
      age,
      gender,
      city,
      country,
      practice,
      community,
      churchName,
      pastorName,
      pastorContact,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h3 className="font-serif text-2xl font-medium text-foreground">
          Étape 1 : Les Fondations Essentielles
        </h3>
        <p className="text-sm text-muted-foreground">
          Ces quelques repères permettent à EVA d&apos;orienter votre espace géographique et spirituel initial.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 pt-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" /> Votre âge
          </label>
          <Input
            type="number"
            min={18}
            max={99}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="h-11 rounded-xl bg-background border-border/80"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" /> Genre
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            <option value="F">Femme</option>
            <option value="M">Homme</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 pt-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" /> Ville ou Région
          </label>
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex: Abidjan, Lyon..."
            className="h-11 rounded-xl bg-background border-border/80"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Pays</label>
          <Input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Ex: Côte d'Ivoire, France..."
            className="h-11 rounded-xl bg-background border-border/80"
            required
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Heart className="h-4 w-4 text-accent" /> Rythme et Pratique spirituelle
        </label>
        <select
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="regulier">Pratiquant régulier (Culte hebdomadaire, prière active)</option>
          <option value="cheminement">En cheminement et approfondissement actif</option>
          <option value="occasionnel">Pratiquant occasionnel mais foi centrale</option>
          <option value="engagement_fort">Engagement ministériel ou leadership actif</option>
        </select>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-foreground">
          Appartenance / dénomination
        </label>
        <select
          value={community}
          onChange={(e) => setCommunity(e.target.value)}
          className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm"
          required
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

      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-foreground">Nom de votre Église</label>
        <Input
          type="text"
          value={churchName}
          onChange={(e) => setChurchName(e.target.value)}
          placeholder="Ex: Église de la Grâce — Cocody"
          className="h-11 rounded-xl bg-background border-border/80"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Pasteur / responsable (optionnel)
          </label>
          <Input
            type="text"
            value={pastorName}
            onChange={(e) => setPastorName(e.target.value)}
            placeholder="Nom du référent"
            className="h-11 rounded-xl bg-background border-border/80"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Contact référent</label>
          <Input
            type="text"
            value={pastorContact}
            onChange={(e) => setPastorContact(e.target.value)}
            placeholder="Email ou téléphone"
            className="h-11 rounded-xl bg-background border-border/80"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border/40 flex justify-end">
        <Button
          type="submit"
          className="h-11 px-8 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
        >
          <span>Continuer vers Valeurs & Foyer</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
