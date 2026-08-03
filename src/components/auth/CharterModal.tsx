"use client";

import * as React from "react";
import { ShieldCheck, Heart, Eye, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface CharterModalProps {
  onAccept: () => void;
  isAccepted: boolean;
  className?: string;
}

export function CharterModal({ onAccept, isAccepted, className }: CharterModalProps) {
  const [localCheck, setLocalCheck] = React.useState(isAccepted);

  const handleToggle = (checked: boolean) => {
    setLocalCheck(checked);
    if (checked) {
      onAccept();
    }
  };

  return (
    <Card className={`rounded-2xl border-accent/40 bg-background/95 backdrop-blur-md shadow-sm ${className || ""}`}>
      <CardHeader className="space-y-2 border-b border-border/40 pb-5">
        <div className="flex items-center gap-2 text-accent">
          <ShieldCheck className="h-6 w-6" />
          <span className="text-xs uppercase tracking-widest font-sans font-semibold">Plateforme Éthique</span>
        </div>
        <CardTitle className="font-serif text-2xl text-foreground">
          La Charte de Bienveillance & Dignité de KELLIA
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          Avant d&apos;entrer, chaque membre s&apos;engage solennellement à préserver cet espace de discernement chrétien.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-5 sm:grid-cols-2">
          
          <div className="space-y-2 p-3.5 rounded-xl bg-secondary/50 border border-border/40">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <Heart className="h-4 w-4 text-accent shrink-0" />
              <span>1. Dignité & Respect</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chaque personne est créée à l&apos;image de Dieu. Aucun mot blessant, jugement ou attitude consumériste n&apos;est toléré.
            </p>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-secondary/50 border border-border/40">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <Eye className="h-4 w-4 text-accent shrink-0" />
              <span>2. Authenticité & Clarté</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Vos photos et réponses reflètent votre vraie personne. Les profils sont vérifiés par l&apos;équipe et par EVA pour préserver la confiance.
            </p>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-secondary/50 border border-border/40">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <Sparkles className="h-4 w-4 text-accent shrink-0" />
              <span>3. Discernement & Sincérité</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              KELLIA n&apos;est pas un espace de collection de matches, mais de discernement sérieux en vue d&apos;un projet de vie conjugal.
            </p>
          </div>

          <div className="space-y-2 p-3.5 rounded-xl bg-secondary/50 border border-border/40">
            <div className="flex items-center gap-2 text-primary dark:text-accent font-serif font-medium text-base">
              <ShieldCheck className="h-4 w-4 text-accent shrink-0" />
              <span>4. Zéro Pression</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Un refus ou un silence s&apos;accueille avec paix et courtoisie. Notre IA EVA veille à la sérénité des échanges.
            </p>
          </div>

        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border/40 pt-5 bg-accent/5 rounded-b-2xl">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="accept-charter"
            checked={localCheck}
            onCheckedChange={(checked) => handleToggle(checked === true)}
            className="rounded-md border-accent text-accent data-[state=checked]:bg-accent"
          />
          <label htmlFor="accept-charter" className="text-sm font-medium text-foreground cursor-pointer select-none">
            Je donne ma parole et j&apos;accepte les 4 piliers de la Charte de KELLIA.
          </label>
        </div>

        <Button
          onClick={() => handleToggle(true)}
          disabled={localCheck}
          className="rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-medium shrink-0 shadow-xs"
        >
          {localCheck ? (
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4" /> Charte Acceptée</span>
          ) : (
            <span>Signer la Charte</span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
