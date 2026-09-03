"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Moon, Sliders, CheckCircle2, Search } from "lucide-react";
import {
  ageRangeLabel,
  DENOMINATION_OPEN_OPTIONS,
  DESIRE_CHILDREN_OPTIONS,
  FAITH_PRACTICE_OPTIONS,
  MARRIAGE_TIMELINE_OPTIONS,
  RELOCATE_OPTIONS,
  type DesireChildrenPref,
  type DenominationOpenPref,
  type FaithPracticePref,
  type MarriageTimeline,
  type RelocatePref,
  type SettingsData,
} from "@/lib/settings";
import { saveSettingsAction } from "@/app/actions/settings";

export function SettingsForm({
  initial,
  isAlliance = false,
}: {
  initial: SettingsData
  isAlliance?: boolean
}) {
  const [retreatMode, setRetreatMode] = React.useState(initial.retreatMode);
  const [sameSexFriendship, setSameSexFriendship] = React.useState(
    initial.sameSexFriendship
  );
  const [maxDistance, setMaxDistance] = React.useState(String(initial.maxDistance));
  const [ageRange, setAgeRange] = React.useState(
    ageRangeLabel(initial.ageMin, initial.ageMax)
  );
  const [marriageTimeline, setMarriageTimeline] = React.useState<MarriageTimeline>(
    initial.marriageTimeline
  );
  const [desireChildren, setDesireChildren] = React.useState<DesireChildrenPref>(
    initial.desireChildren
  );
  const [faithPractice, setFaithPractice] = React.useState<FaithPracticePref>(
    initial.faithPractice
  );
  const [relocate, setRelocate] = React.useState<RelocatePref>(initial.relocate);
  const [denominationOpen, setDenominationOpen] = React.useState<DenominationOpenPref>(
    initial.denominationOpen
  );
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const result = await saveSettingsAction({
      retreatMode,
      sameSexFriendship: isAlliance ? sameSexFriendship : false,
      maxDistance,
      ageRange,
      marriageTimeline,
      desireChildren,
      faithPractice,
      relocate,
      denominationOpen,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card
        className={`rounded-2xl border transition-all duration-300 ${
          retreatMode
            ? "border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/20 shadow-sm"
            : "border-border/60 bg-background/90 backdrop-blur-md shadow-xs"
        }`}
      >
        <CardHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
              <Moon className="h-5 w-5 text-accent" />
              Respect de votre intimité
            </CardTitle>
            <Badge
              className={
                retreatMode
                  ? "bg-amber-600 text-white"
                  : "bg-secondary text-muted-foreground"
              }
            >
              {retreatMode ? "Pause activée (profil masqué)" : "Recherche active"}
            </Badge>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Besoin de retraite ou de silence ? Masquez temporairement votre profil sans perdre vos
            conversations.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-lg">
            <span className="text-sm font-semibold text-foreground block">
              Masquer mon profil des nouvelles compatibilités
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Idéal pour approfondir un échange unique, ou prendre un temps de recul.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setRetreatMode(!retreatMode)}
            variant={retreatMode ? "default" : "outline"}
            className={`rounded-xl h-10 px-5 font-medium shrink-0 ${
              retreatMode
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "border-border/80"
            }`}
          >
            {retreatMode ? "Reprendre la recherche" : "Activer la pause"}
          </Button>
        </CardContent>
      </Card>

      {isAlliance ? (
        <Card
          className={`rounded-2xl border transition-all ${
            sameSexFriendship
              ? "border-[#B8954A]/50 bg-[#B8954A]/10"
              : "border-[#B8954A]/30 bg-background/90"
          }`}
        >
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
              <Badge className="bg-[#B8954A] text-[#7F5557]">Alliance</Badge>
              Amitiés même sexe
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Dans la Communauté KELIAA, likez aussi des membres du même sexe
              (amitié chrétienne). Les messages s’ouvrent uniquement en like
              mutuel — pas de contact direct.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-lg">
              <span className="text-sm font-semibold text-foreground block">
                Activer les amitiés entre personnes du même sexe
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Option Alliance. Le Matching mariage reste centré sur
                l’autre sexe.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setSameSexFriendship(!sameSexFriendship)}
              variant={sameSexFriendship ? "default" : "outline"}
              className={`rounded-xl h-10 px-5 font-medium shrink-0 ${
                sameSexFriendship
                  ? "bg-[#7F5557] hover:bg-[#7F5557]/90 text-[#F5EDE0]"
                  : "border-[#B8954A]/40"
              }`}
            >
              {sameSexFriendship ? "Activé" : "Débloquer"}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs">
        <CardHeader className="border-b border-border/40 pb-4">
          <CardTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
            <Search className="h-5 w-5 text-accent" />
            Critères de recherche
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Affinez qui peut vous être proposé. Ces filtres aident le Matching — ils ne remplacent
            pas les questionnaires.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Rayon géographique maximum
              </label>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
              >
                <option value="50">50 km autour de ma ville</option>
                <option value="100">100 km (région proche)</option>
                <option value="300">300 km (inter-régional)</option>
                <option value="1000">Ouverture large (1000 km)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tranche d&apos;âge recherchée
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
              >
                <option value="22-30">22 - 30 ans</option>
                <option value="26-36">26 - 36 ans</option>
                <option value="30-42">30 - 42 ans</option>
                <option value="38-55">38 - 55 ans</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Projet de mariage (horizon)
              </label>
              <select
                value={marriageTimeline}
                onChange={(e) => setMarriageTimeline(e.target.value as MarriageTimeline)}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
              >
                {MARRIAGE_TIMELINE_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Partenaire avec enfants déjà présents ?
              </label>
              <select
                value={desireChildren}
                onChange={(e) => setDesireChildren(e.target.value as DesireChildrenPref)}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
              >
                {DESIRE_CHILDREN_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Pratique de foi recherchée
              </label>
              <select
                value={faithPractice}
                onChange={(e) => setFaithPractice(e.target.value as FaithPracticePref)}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
              >
                {FAITH_PRACTICE_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Famille d&apos;église / dénomination
              </label>
              <select
                value={denominationOpen}
                onChange={(e) =>
                  setDenominationOpen(e.target.value as DenominationOpenPref)
                }
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
              >
                {DENOMINATION_OPEN_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Mobilité géographique
              </label>
              <select
                value={relocate}
                onChange={(e) => setRelocate(e.target.value as RelocatePref)}
                className="w-full h-11 px-3.5 rounded-xl bg-background border border-border/80 text-sm text-foreground focus:ring-accent"
              >
                {RELOCATE_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground flex items-start gap-2">
            <Sliders className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            Le genre recherché suit votre profil (homme ↔ femme). Les filtres foi / mobilité
            affinent les propositions sans remplacer les questionnaires.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2 gap-4 flex-wrap">
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : saved ? (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-4 w-4" /> Préférences enregistrées.
          </div>
        ) : (
          <div />
        )}
        <Button
          type="submit"
          disabled={saving}
          className="rounded-xl h-11 px-6 font-semibold"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
