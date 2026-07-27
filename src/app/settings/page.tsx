import { MemberPage } from "@/components/layout/MemberPage";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Badge } from "@/components/ui/badge";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { getMySettings } from "@/app/actions/settings";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const { data, error } = await getMySettings();

  return (
    <MemberPage>
      <div className="space-y-8 py-2 max-w-3xl mx-auto">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs"
          >
            Réglages & discrétion
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
            Préférences de votre compte
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ajustez vos critères et activez le mode retraite à tout moment.
          </p>
        </div>

        <EvaCompanion
          title="EVA - Le Respect des Saisons spirituelles"
          variant="reflection"
          message="Sur KELIAA, il y a des temps de recherche active et des temps de silence. Le Mode Retraite masque votre profil en toute paix."
        />

        {error || !data ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{error || "Impossible de charger les réglages."}</p>
            <Link href="/login">
              <Button variant="outline" className="rounded-xl">
                Se connecter
              </Button>
            </Link>
          </div>
        ) : (
          <SettingsForm initial={data} />
        )}
      </div>
    </MemberPage>
  );
}
