import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaWeeklyReflection } from "@/components/dashboard/EvaWeeklyReflection";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { ProfileProgress } from "@/components/evoraa/ProfileProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Heart,
  User,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Moon,
} from "lucide-react";
import { getDashboardData } from "@/app/actions/dashboard";

export default async function DashboardPage() {
  const { data, error } = await getDashboardData();

  if (error || !data) {
    return (
      <MainLayout maxWidth="3xl">
        <div className="py-10 space-y-4">
          <p className="text-sm text-destructive">{error || "Espace indisponible."}</p>
          <Link href="/login">
            <Button variant="outline" className="rounded-xl">
              Se connecter
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout maxWidth="6xl">
      <div className="space-y-10 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className="border-accent/40 text-accent bg-accent/5 font-sans uppercase tracking-wider text-xs"
            >
              Centre de discernement
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Espace de {data.firstName}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              {data.isVerified ? "Membre vérifié(e)" : "Profil en cours de maturité"}
              {data.retreatMode ? " • Mode retraite actif" : " • Charte signée"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/settings">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-10 px-4 text-xs font-medium border-border/80 flex items-center gap-1.5"
              >
                <Sliders className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Préférences & Retraite</span>
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                size="sm"
                className="rounded-xl h-10 px-4 text-xs font-medium bg-accent hover:bg-accent/90 text-accent-foreground flex items-center gap-1.5 shadow-2xs"
              >
                <User className="h-3.5 w-3.5" />
                <span>
                  {data.completionPercentage >= 100
                    ? "Éditer mon profil"
                    : "Compléter mon profil"}
                </span>
              </Button>
            </Link>
          </div>
        </div>

        <EvaWeeklyReflection />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Maturité de votre Profil
            </h2>
            <Link
              href="/profile"
              className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
            >
              <span>Éditer mon témoignage et mes photos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ProfileProgress percentage={data.completionPercentage} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary dark:text-accent">
                  <MessageCircle className="h-5 w-5" />
                </div>
                {data.unreadMessages > 0 ? (
                  <Badge className="bg-accent/15 text-accent border-0">
                    {data.unreadMessages} non lu{data.unreadMessages > 1 ? "s" : ""}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">
                    {data.conversationCount} conversation
                    {data.conversationCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <CardTitle className="font-serif text-xl">Messagerie Digne</CardTitle>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.latestPartnerName
                  ? `Dernier échange avec ${data.latestPartnerName}.`
                  : "Aucun dialogue ouvert pour l’instant. Explorez les compatibilités pour initier un échange."}
              </p>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <Link
                href={
                  data.latestConversationId
                    ? `/messages/${data.latestConversationId}`
                    : "/messages"
                }
                className="w-full block"
              >
                <Button
                  variant="outline"
                  className="w-full rounded-xl text-xs font-medium border-border/80 hover:bg-primary hover:text-primary-foreground"
                >
                  <span>Accéder à mes dialogues</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-accent/15 text-accent">
                  <Heart className="h-5 w-5 fill-accent/20" />
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-0">
                  {data.topHarmonyScore > 0
                    ? `Top ${data.topHarmonyScore}%`
                    : "À découvrir"}
                </Badge>
              </div>
              <CardTitle className="font-serif text-xl">Espace de Rencontres</CardTitle>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.topHarmonyCount > 0
                  ? `${data.topHarmonyCount} suggestion${data.topHarmonyCount > 1 ? "s" : ""} selon votre questionnaire.`
                  : "Complétez votre profil pour recevoir des suggestions d’harmonie."}
              </p>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <Link href="/compatibility" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full rounded-xl text-xs font-medium border-border/80 hover:bg-accent hover:text-accent-foreground"
                >
                  <span>Explorer les compatibilités</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-secondary text-foreground">
                  <Moon className="h-5 w-5 text-accent" />
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {data.retreatMode ? "Retraite" : "Visible"}
                </Badge>
              </div>
              <CardTitle className="font-serif text-xl">Discrétion</CardTitle>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.retreatMode
                  ? "Votre profil est masqué des nouvelles suggestions. Vous pouvez désactiver la retraite dans les paramètres."
                  : "Vos photos restent en modération avant affichage public. Activez le mode retraite si vous avez besoin de silence."}
              </p>
            </CardHeader>
            <CardContent className="pt-0 pb-5">
              <Link href="/settings" className="w-full block">
                <Button
                  variant="outline"
                  className="w-full rounded-xl text-xs font-medium border-border/80 hover:bg-secondary/80"
                >
                  <span>Gérer mes préférences</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <EvaCompanion
          title="EVA - Discernement Serein"
          message={
            data.retreatMode
              ? "Le mode retraite est actif : prenez ce temps en paix. Vos conversations existantes restent accessibles."
              : "Explorez les compatibilités avec patience. Si vous avez besoin d’un temps de silence, activez le Mode Retraite dans vos préférences."
          }
          variant="suggestion"
        />
      </div>
    </MainLayout>
  );
}
