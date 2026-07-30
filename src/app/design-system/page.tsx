"use client";

import * as React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { ProfileProgress } from "@/components/evoraa/ProfileProgress";
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DesignSystemShowcasePage() {
  const [profilePct, setProfilePct] = React.useState(78);
  const [companionVariant, setCompanionVariant] = React.useState<"default" | "suggestion" | "reflection" | "reassurance">("default");

  return (
    <MainLayout maxWidth="7xl">
      <div className="space-y-16 pb-12">
        
        {/* Header Section */}
        <div className="space-y-4 border-b border-border/40 pb-8">
          <Badge variant="outline" className="border-accent/40 text-accent bg-accent/5 px-3 py-1 font-sans uppercase tracking-wider text-xs">
            Sprint 1 : Foundation UI
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-serif text-foreground font-semibold">
            Design System & Socle UI
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed font-sans">
            Validation visuelle des tokens, de la typographie, des thèmes (Clair / Sombre), et des composants natifs d&apos;Evoraa (EVA & Profil Infini) avant le développement des écrans métier.
          </p>
        </div>

        {/* 1. KELIAA / EVA Companion Component Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-serif font-semibold">1. L&apos;Accompagnatrice (EVA / KELIAA)</h2>
              <p className="text-sm text-muted-foreground">Présence bienveillante, explicative et non intrusive.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant={companionVariant === "default" ? "default" : "outline"} onClick={() => setCompanionVariant("default")}>Accueil</Button>
              <Button size="sm" variant={companionVariant === "suggestion" ? "default" : "outline"} onClick={() => setCompanionVariant("suggestion")}>Suggestion</Button>
              <Button size="sm" variant={companionVariant === "reflection" ? "default" : "outline"} onClick={() => setCompanionVariant("reflection")}>Réflexion / Modération</Button>
              <Button size="sm" variant={companionVariant === "reassurance" ? "default" : "outline"} onClick={() => setCompanionVariant("reassurance")}>Rassurance</Button>
            </div>
          </div>

          <div className="max-w-2xl">
            {companionVariant === "default" && (
              <EvaCompanion
                title="EVA"
                message="Bonjour Laure 👋 Je suis EVA. Je serai votre guide tout au long de votre parcours sur Evoraa. Prenez votre temps pour découvrir la plateforme."
              />
            )}
            {companionVariant === "suggestion" && (
              <EvaCompanion
                title="EVA - Conseil"
                variant="suggestion"
                message="Ajouter une photo en extérieur ou en activité améliore généralement de 40% la qualité des compatibilités proposées."
                actions={[{ label: "Ajouter une photo", onClick: () => alert("Action cliquée") }]}
              />
            )}
            {companionVariant === "reflection" && (
              <EvaCompanion
                title="EVA - Protection de la conversation"
                variant="reflection"
                message="Ce message pourrait être perçu comme blessant ou irrespectueux par votre interlocuteur. Souhaitez-vous le reformuler avec plus de douceur avant de l'envoyer ?"
                actions={[
                  { label: "Modifier mon message", onClick: () => {}, variant: "default" },
                  { label: "Envoyer quand même", onClick: () => {}, variant: "ghost" },
                ]}
              />
            )}
            {companionVariant === "reassurance" && (
              <EvaCompanion
                title="EVA - Vérification réussie"
                variant="reassurance"
                message="Parfait ! Votre photo de profil respecte notre charte de dignité et de visibilité. Elle est prête pour la validation humaine."
              />
            )}
          </div>
        </section>

        {/* 2. Profile Progression System Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-serif font-semibold">2. Le Profil Infini & Micro-Récompenses</h2>
              <p className="text-sm text-muted-foreground">Le profil est toujours complet, mais incité à être enrichi (avec niveaux ⭐ et pourcentages).</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Simuler :</span>
              {[60, 78, 85, 92, 100].map((pct) => (
                <Button
                  key={pct}
                  size="sm"
                  variant={profilePct === pct ? "default" : "outline"}
                  onClick={() => setProfilePct(pct)}
                  className="h-7 px-2.5 text-xs"
                >
                  {pct}%
                </Button>
              ))}
            </div>
          </div>

          <div className="max-w-2xl">
            <ProfileProgress
              percentage={profilePct}
              onEnrichClick={() => alert("Ouverture du questionnaire d'enrichissement")}
            />
          </div>
        </section>

        {/* 3. Color Palette & Tokens */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-semibold">3. Tokens Colorimétriques (Thème Bleu Nuit & Sable Doré)</h2>
            <p className="text-sm text-muted-foreground">Conçus pour inspirer la sérénité, la confiance et l&apos;élégance sans agresser l&apos;œil.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ColorSwatch bgClass="bg-primary" textClass="text-primary-foreground" name="Primaire" hex="#0F172A (Midnight Blue)" />
            <ColorSwatch bgClass="bg-accent" textClass="text-accent-foreground" name="Accent" hex="#C5A059 (Champagne/Gold)" />
            <ColorSwatch bgClass="bg-background border border-border" textClass="text-foreground" name="Fond (Background)" hex="#FAFAFA / Dark #0F172A" />
            <ColorSwatch bgClass="bg-secondary" textClass="text-secondary-foreground" name="Secondaire" hex="#F1F5F9 (Light Slate)" />
            <ColorSwatch bgClass="bg-destructive" textClass="text-destructive-foreground" name="Alerte/Erreur" hex="#EF4444 (Doux)" />
          </div>
        </section>

        {/* 4. Form Controls & shadcn/ui */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-semibold">4. Formulaires & Charge Mentale Minimale</h2>
            <p className="text-sm text-muted-foreground">Composants avec arrondis adoucis (`rounded-xl` / `rounded-lg`) et contrastes stricts AA.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="rounded-2xl border-border/60 shadow-xs">
              <CardHeader>
                <CardTitle className="font-serif">Exemple d&apos;entrée de données</CardTitle>
                <CardDescription>Les champs sont spacieux et clairs pour éviter le stress.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adresse email</label>
                  <Input placeholder="laure@exemple.com" className="h-11 rounded-xl bg-background" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quelle place la foi occupe-t-elle dans votre quotidien ?</label>
                  <Textarea placeholder="Partagez quelques mots sur votre marche spirituelle..." className="rounded-xl min-h-24 bg-background" />
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <Checkbox id="charter" className="rounded-md border-border/80 text-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent" />
                  <label htmlFor="charter" className="text-sm font-normal leading-relaxed cursor-pointer">
                    J&apos;accepte la <b>Charte de bienveillance, de respect et de dignité</b> d&apos;Evoraa.
                  </label>
                </div>

                <div className="pt-3">
                  <Button className="w-full h-11 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                    Valider mon étape
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border/60 shadow-xs flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="font-serif">Boutons & États</CardTitle>
                <CardDescription>Hiérarchie claire des actions sur un même écran.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block">Boutons d&apos;action</span>
                  <div className="flex flex-wrap gap-3">
                    <Button className="rounded-xl">Action Primaire</Button>
                    <Button variant="secondary" className="rounded-xl">Secondaire</Button>
                    <Button variant="outline" className="rounded-xl">Outline</Button>
                    <Button variant="ghost" className="rounded-xl">Ghost</Button>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block">Badges & Statuts</span>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary text-primary-foreground rounded-full px-3">Vérifié par EVA</Badge>
                    <Badge variant="outline" className="border-accent text-accent rounded-full px-3">⭐ Profil Avancé</Badge>
                    <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full px-3">En ligne</Badge>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Flouter mes photos pour les membres gratuits</label>
                    <p className="text-xs text-muted-foreground">Respect de la confidentialité par défaut.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5. Feedback Alerts */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-serif font-semibold">5. Alertes et Transparence</h2>
            <p className="text-sm text-muted-foreground">Explicabilité des algorithmes de compatibilité et de sécurité.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Alert className="rounded-2xl border-accent/40 bg-accent/5">
              <Sparkles className="h-4 w-4 text-accent" />
              <AlertTitle className="font-serif font-medium text-foreground">Transparence de compatibilité</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground mt-1">
                Lorsque nous vous proposerons un profil, nous vous expliquerons toujours <b>pourquoi</b> (ex: valeurs partagées, vision commune du mariage, style relationnel compatible).
              </AlertDescription>
            </Alert>

            <Alert className="rounded-2xl border-emerald-500/40 bg-emerald-500/5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <AlertTitle className="font-serif font-medium text-foreground">Espace Sécurisé</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground mt-1">
                Toutes les photos sont vérifiées automatiquement et par l&apos;équipe humaine. Les conversations sont protégées par EVA contre tout irrespect.
              </AlertDescription>
            </Alert>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}

function ColorSwatch({ bgClass, textClass, name, hex }: { bgClass: string, textClass: string, name: string, hex: string }) {
  return (
    <div className="space-y-2">
      <div className={`h-24 w-full rounded-2xl flex items-center justify-center shadow-xs border border-border/30 ${bgClass} ${textClass}`}>
        <span className="font-semibold px-2 text-center text-sm">{name}</span>
      </div>
      <p className="text-xs text-muted-foreground font-mono truncate">{hex}</p>
    </div>
  );
}
