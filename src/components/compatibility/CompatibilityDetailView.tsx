"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EvaExplanationBlock } from "@/components/compatibility/EvaExplanationBlock";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  Shield,
  MessageSquareText,
  Eye,
  MapPin,
  BookOpen,
} from "lucide-react";
import { startConversationFromProfile } from "@/app/actions/messaging";
import { FavoriteButton } from "@/components/social/FavoriteButton";
import type { DomainScore, MatchInsight } from "@/lib/matching/types";

export type CompatibilityDetailData = {
  id: string;
  name: string;
  age: number;
  city: string;
  community: string;
  harmonyScore: number;
  bio: string;
  pillars: {
    spirituality: string;
    familyVision: string;
    dialogue: string;
  };
  domainScores?: DomainScore[];
  insights?: MatchInsight[];
  answers: { question: string; answer: string }[];
  isVerified: boolean;
};

export function CompatibilityDetailView({
  profile,
  error,
}: {
  profile?: CompatibilityDetailData;
  error?: string;
}) {
  const router = useRouter();
  const [photoRequested, setPhotoRequested] = React.useState(false);
  const [isStarting, setIsStarting] = React.useState(false);
  const [startError, setStartError] = React.useState("");

  const handleStart = async () => {
    if (!profile) return;
    setIsStarting(true);
    setStartError("");
    try {
      const result = await startConversationFromProfile(profile.id);
      if (result.error || !result.conversationId) {
        setStartError(result.error || "Impossible d'ouvrir la conversation.");
        return;
      }
      router.push(`/messages/${result.conversationId}`);
    } finally {
      setIsStarting(false);
    }
  };

  if (error || !profile) {
    return (
      <div className="space-y-6 py-2 max-w-4xl mx-auto">
        <Link href="/compatibility">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground">{error || "Profil introuvable."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      <Link href="/compatibility">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux compatibilités
        </Button>
      </Link>

      <Card className="rounded-2xl overflow-hidden border-border bg-card">
        <div className="grid md:grid-cols-3">
          <div className="relative h-64 md:h-auto bg-secondary flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border/40">
            <div className="w-28 h-28 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-serif text-5xl text-primary/70">{profile.name[0]}</span>
            </div>
            <div className="absolute top-4 left-4 bg-background/90 px-3 py-1 rounded-full text-xs border border-accent/30 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent fill-accent" />
              {profile.harmonyScore}% d&apos;harmonie
            </div>
            {profile.isVerified && (
              <Badge variant="outline" className="mt-4 text-[10px]">
                <Shield className="h-3 w-3 mr-1 text-accent" /> Vérifié
              </Badge>
            )}
            <Button
              size="sm"
              variant="outline"
              className="mt-3 text-xs"
              onClick={() => setPhotoRequested(true)}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              {photoRequested ? "Demande envoyée" : "Demander photo nette"}
            </Button>
          </div>

          <div className="md:col-span-2 p-6 sm:p-8 space-y-4">
            <div>
              <h1 className="font-serif text-3xl font-bold">
                {profile.name}
                {profile.age > 0 ? `, ${profile.age} ans` : ""}
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <MapPin className="h-4 w-4" /> {profile.city}
                <span>•</span>
                <BookOpen className="h-4 w-4" /> {profile.community}
              </p>
            </div>
            <p className="text-sm italic bg-secondary/30 p-3.5 rounded-xl border border-border/40 font-serif">
              « {profile.bio} »
            </p>
            <p className="text-xs text-muted-foreground">
              Score détaillé ci-dessous — domaines, interactions et points de vigilance.
            </p>
            <Button
              onClick={handleStart}
              disabled={isStarting}
              className="w-full h-11 rounded-xl"
            >
              <MessageSquareText className="mr-2 h-4 w-4" />
              {isStarting ? "Ouverture…" : "Écrire"}
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              Échange respectueux — soumis à vos quotas du mois
            </p>
            <FavoriteButton targetProfileId={profile.id} />
            {startError && <p className="text-xs text-destructive">{startError}</p>}
          </div>
        </div>
      </Card>

      <EvaExplanationBlock
        partnerName={profile.name}
        harmonyScore={profile.harmonyScore}
        pillars={profile.pillars}
        domainScores={profile.domainScores}
        insights={profile.insights}
      />

      <Card className="rounded-2xl bg-card">
        <CardHeader className="border-b border-border/40">
          <CardTitle className="font-serif text-xl">Questionnaire de discernement</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {profile.answers.map((item, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-border/30 pb-4 last:border-0">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {item.question}
              </span>
              <p className="text-sm">{item.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <EvaCompanion
        title="EVA - Protection"
        variant="reflection"
        message={`Les échanges avec ${profile.name} restent soumis à la Charte Keliaa.`}
      />
    </div>
  );
}
