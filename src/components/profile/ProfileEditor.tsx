"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileProgress } from "@/components/evoraa/ProfileProgress";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Sparkles, ShieldCheck, Camera, CheckCircle2, Heart } from "lucide-react";

export function ProfileEditor() {
  const [testimony, setTestimony] = React.useState(
    "J'ai découvert une foi personnelle durant mes études universitaires. Aujourd'hui, elle est le pilier d'amour et de paix qui guide chacun de mes choix personnels et professionnels."
  );
  const [favoriteVerses, setFavoriteVerses] = React.useState(
    "Philippiens 4:7 - Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs..."
  );
  const [photoUploaded, setPhotoUploaded] = React.useState(true);
  const [is100Percent, setIs100Percent] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIs100Percent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      {/* Dynamic EVA reassurance based on completion */}
      <EvaCompanion
        title="EVA - Maturité de votre Profil"
        variant={is100Percent ? "reassurance" : "suggestion"}
        message={
          is100Percent
            ? "Félicitations ! Vous avez atteint le niveau suprême ⭐ Sincérité Totale (100%). Votre témoignage et vos photos vérifiées inspirent une confiance maximale au sein de la plateforme."
            : "Il ne vous manque que la validation finale de votre témoignage personnel et de vos photos pour atteindre 100% de complétion et débloquer la confiance totale d'Evoraa."
        }
      />

      <ProfileProgress percentage={is100Percent ? 100 : 78} />

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Testimony & Spiritual Journey */}
        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              Témoignage & Parcours de Foi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Votre témoignage spirituel en quelques phrases
              </label>
              <Textarea
                value={testimony}
                onChange={(e) => setTestimony(e.target.value)}
                placeholder="Partagez avec authenticité comment votre foi s'exprime dans votre vie..."
                className="rounded-xl min-h-28 bg-background border-border/80 text-sm leading-relaxed"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Versets bibliques, méditations ou cantiques qui vous inspirent
              </label>
              <Input
                type="text"
                value={favoriteVerses}
                onChange={(e) => setFavoriteVerses(e.target.value)}
                placeholder="Ex: Psaume 23, cantique favori..."
                className="h-11 rounded-xl bg-background border-border/80 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Verified Photo Section */}
        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
              <Camera className="h-5 w-5 text-accent" />
              Authenticité & Photos Vérifiées
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/60 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-serif text-lg font-bold">
                  L
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-foreground block">
                    Laure (Portrait principal)
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Photo vérifiée par l&apos;équipe et EVA
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPhotoUploaded(!photoUploaded)}
                  className="rounded-xl text-xs border-border/80"
                >
                  {photoUploaded ? "Modifier la photo" : "Ajouter un portrait"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <span>
                Conformément au respect V1, vos photos sont floutées par défaut auprès des visiteurs libres tant que vous n&apos;accordez pas l&apos;accès.
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="h-12 px-8 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-base"
          >
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            <span>{is100Percent ? "Enregistrer les modifications" : "Valider et Atteindre 100% de Sincérité"}</span>
          </Button>
        </div>

      </form>
    </div>
  );
}
