"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { EvaExplanationBlock } from "@/components/compatibility/EvaExplanationBlock";
import { EvaCompanion } from "@/components/evoraa/EvaCompanion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Heart, Shield, MessageSquareText, Eye, Lock, MapPin, Calendar, BookOpen } from "lucide-react";

export default function CompatibilityDetailPage() {
  const params = useParams();
  const id = params?.id || "1";
  const [photoRequested, setPhotoRequested] = React.useState(false);
  const [messageSent, setMessageSent] = React.useState(false);

  // Mock data for ID 1 (Alexandre)
  const profile = {
    name: "Alexandre",
    age: 31,
    city: "Paris (75)",
    community: "Protestant Évangélique",
    harmonyScore: 94,
    bio: "Passionné de théologie, de randonnée en montagne et d'accueil convivial. Je cherche à fonder un foyer où le dialogue et la prière sont les moteurs du quotidien.",
    pillars: {
      spirituality: "Pratiquant régulier avec attachement à la lecture biblique quotidienne. Partage votre souhait de culte en couple.",
      familyVision: "Souhaite accueillir des enfants et construire une vie familiale fondée sur l'hospitalité et l'entraide.",
      dialogue: "Adopte le dialogue posé et la recherche de paix rapide en cas de désaccord, en harmonie avec votre style de communication.",
    },
    answers: [
      { question: "La place de la foi dans mon quotidien", answer: "Elle inspire mes décisions professionnelles et mes relations humaines chaque jour." },
      { question: "Ma vision du mariage", answer: "Un alliance sacrée de soutien inconditionnel et d'épanouissement mutuel sous le regard de Dieu." },
      { question: "Mes moments de ressourcement", answer: "Le culte du dimanche matin et les longues marches en pleine nature." },
    ],
  };

  return (
    <MainLayout maxWidth="4xl">
      <div className="space-y-8 py-6">
        
        {/* Navigation Back */}
        <div>
          <Link href="/compatibility">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'Espace de Compatibilités
            </Button>
          </Link>
        </div>

        {/* Profile Header Card */}
        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-3">
            
            {/* Left Box: Photo area (Blurred by default with unlock option) */}
            <div className="relative h-64 md:h-auto bg-secondary flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-border/40">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-secondary flex items-center justify-center filter blur-md shadow-inner select-none">
                <span className="font-serif text-5xl text-primary/40">{profile.name[0]}</span>
              </div>
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-accent/30 flex items-center gap-1.5 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-accent fill-accent" />
                <span>{profile.harmonyScore}%</span>
              </div>

              <div className="mt-4 text-center space-y-2">
                <Badge variant="outline" className="text-[10px] bg-background/80">
                  <Shield className="h-3 w-3 mr-1 text-accent" /> Vérifié par l&apos;équipe
                </Badge>
                {!photoRequested ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPhotoRequested(true)}
                    className="w-full text-xs h-8 rounded-lg border-accent/40 text-accent hover:bg-accent/10"
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" /> Demander accès photo nette
                  </Button>
                ) : (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block">
                    ✓ Demande d&apos;accès envoyée
                  </span>
                )}
              </div>
            </div>

            {/* Right 2/3 Box: Main Profile Info */}
            <div className="md:col-span-2 p-6 sm:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="font-serif text-3xl font-bold text-foreground">
                      {profile.name}, {profile.age} ans
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" /> {profile.city}
                      <span className="mx-1">•</span>
                      <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" /> {profile.community}
                    </p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs">
                    ⭐ Profil Premium
                  </Badge>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed italic bg-secondary/30 p-3.5 rounded-xl border border-border/40 font-serif">
                  « {profile.bio} »
                </p>
              </div>

              {/* Dignified Contact Actions */}
              <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center gap-3">
                {!messageSent ? (
                  <Button
                    onClick={() => setMessageSent(true)}
                    className="w-full sm:flex-1 h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-xs"
                  >
                    <MessageSquareText className="mr-2 h-4 w-4 text-accent" />
                    <span>Initiation d&apos;échange respectueuse</span>
                  </Button>
                ) : (
                  <div className="w-full sm:flex-1 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center font-medium">
                    ✓ Message d'invitation courtois transmis dans le respect de la plateforme.
                  </div>
                )}
              </div>
            </div>

          </div>
        </Card>

        {/* EVA's Transparent Explanation Block */}
        <EvaExplanationBlock
          partnerName={profile.name}
          harmonyScore={profile.harmonyScore}
          pillars={profile.pillars}
        />

        {/* Detailed Q&A Card */}
        <Card className="rounded-2xl border-border/60 bg-background/90 backdrop-blur-md shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="font-serif text-xl text-foreground">
              Réponses au Questionnaire de Discernement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {profile.answers.map((item, idx) => (
              <div key={idx} className="space-y-1.5 border-b border-border/30 pb-4 last:border-0 last:pb-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block font-sans">
                  {item.question}
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conversation Protection Reassurance */}
        <EvaCompanion
          title="EVA - Protection & Sérénité"
          variant="reflection"
          message="Si vous décidez d'entamer une conversation avec Alexandre, sachez que je veillerai personnellement à ce que chaque échange se déroule dans une parfaite dignité et bienveillance."
        />

      </div>
    </MainLayout>
  );
}
