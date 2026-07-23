"use client";

import * as React from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileProgress } from "@/components/evoraa/ProfileProgress";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Sparkles, ShieldCheck, Camera, CheckCircle2, Heart } from "lucide-react";
import {
  saveProfileAction,
  uploadProfilePhotoAction,
  type ProfileEditorData,
} from "@/app/actions/profile";

export function ProfileEditor({ initial }: { initial: ProfileEditorData }) {
  const [testimony, setTestimony] = React.useState(initial.testimony);
  const [favoriteVerses, setFavoriteVerses] = React.useState(initial.favoriteVerses);
  const [photos, setPhotos] = React.useState(initial.photos);
  const [completion, setCompletion] = React.useState(initial.completionPercentage);
  const [status, setStatus] = React.useState<"idle" | "saving" | "uploading" | "saved">("idle");
  const [error, setError] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  const primary = photos.find((p) => p.isPrimary) || photos[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    const result = await saveProfileAction({ testimony, favoriteVerses });
    if (result.error) {
      setError(result.error);
      setStatus("idle");
      return;
    }
    if (result.completionPercentage != null) {
      setCompletion(result.completionPercentage);
    }
    setStatus("saved");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePhotoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    setError("");
    const formData = new FormData();
    formData.set("photo", file);
    const result = await uploadProfilePhotoAction(formData);
    if (result.error) {
      setError(result.error);
      setStatus("idle");
      return;
    }
    if (result.photoUrl) {
      setPhotos((prev) => [
        {
          id: `local-${Date.now()}`,
          photoUrl: result.photoUrl!,
          status: "pending",
          isPrimary: true,
        },
        ...prev.map((p) => ({ ...p, isPrimary: false })),
      ]);
    }
    setStatus("saved");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-8">
      <EvaCompanion
        title="EVA - Maturité de votre Profil"
        variant={completion >= 100 ? "reassurance" : "suggestion"}
        message={
          completion >= 100
            ? "Félicitations ! Votre témoignage et vos photos sont en place. Les photos restent en attente de validation humaine."
            : "Complétez votre témoignage et ajoutez un portrait. Les photos passent par une modération minimale avant affichage public."
        }
      />

      <ProfileProgress percentage={completion} />

      <form onSubmit={handleSave} className="space-y-6">
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

        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
              <Camera className="h-5 w-5 text-accent" />
              Authenticité & Photos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/60 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-serif text-lg font-bold">
                  {primary?.photoUrl ? (
                    <Image
                      src={primary.photoUrl}
                      alt="Portrait"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    initial.firstName[0]
                  )}
                </div>
                <div>
                  <span className="font-serif font-bold text-base text-foreground block">
                    {initial.firstName} (Portrait principal)
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    {primary
                      ? primary.status === "approved"
                        ? "Photo approuvée"
                        : "En attente de modération"
                      : "Aucun portrait pour l’instant"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoPick}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={status === "uploading"}
                  onClick={() => fileRef.current?.click()}
                  className="rounded-xl text-xs border-border/80"
                >
                  {status === "uploading"
                    ? "Envoi…"
                    : primary
                      ? "Modifier la photo"
                      : "Ajouter un portrait"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
              <span>
                JPEG / PNG / WebP, max 5 Mo. Statut initial : pending — validation humaine avant affichage public.
              </span>
            </div>
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {status === "saved" && !error && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Enregistré.
          </p>
        )}

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={status === "saving"}
            className="h-12 px-8 rounded-xl font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-base"
          >
            <Sparkles className="mr-2 h-4 w-4 text-accent" />
            <span>
              {status === "saving" ? "Enregistrement…" : "Enregistrer mon profil"}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
