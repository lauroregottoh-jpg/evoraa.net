"use client";

import * as React from "react";
import { Sparkles, BookOpen, Send, HelpCircle, HeartHandshake } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QAPair {
  question: string;
  answer: string;
  verse: string;
}

const PREDEFINED_TOPICS: QAPair[] = [
  {
    question: "Quand et comment aborder la question des finances dans le couple ?",
    answer: "Sur KELIAA, nous conseillons d'aborder la question de la gestion matérielle dès que le discernement s'oriente vers un projet de fiançailles. Parlez-en non pas sous l'angle de l'avoir, mais sous l'angle de l'intendance chrétienne et de la générosité.",
    verse: "« Là où est votre trésor, là aussi sera votre cœur. » (Matthieu 6:21)",
  },
  {
    question: "Comment cultiver la paix intérieure pendant la période d'attente ?",
    answer: "L'attente n'est pas un temps vide : c'est souvent la saison où l'on clarifie qui l'on est et ce que l'on cherche vraiment. Servez, grandissez, soignez vos amitiés — vous arriverez plus libre face à une rencontre sérieuse.",
    verse: "« C'est dans le calme et la confiance que sera votre force. » (Ésaïe 30:15)",
  },
  {
    question: "Quelle place donner à la prière commune lors de nos premiers échanges ?",
    answer: "Commencez par partager simplement vos requêtes et vos sujets de gratitude. Prier ensemble avec humilité crée une transparence spirituelle qui dépasse les simples affinités psychologiques.",
    verse: "« Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. » (Matthieu 18:20)",
  },
];

export function EvaSpiritualAdvisor() {
  const [selectedTopic, setSelectedTopic] = React.useState<QAPair | null>(PREDEFINED_TOPICS[0]);
  const [customQuestion, setCustomQuestion] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsTyping(true);
    setTimeout(() => {
      const newAnswer: QAPair = {
        question: customQuestion,
        answer: `Merci pour cette question. Sur KELIAA, on recommande souvent la même chose : clarifier vos intentions, avancer sans précipitation, et en parler avec des personnes de confiance qui vous connaissent vraiment — coach, conseiller, amis matures.`,
        verse: "« La sagesse d'en haut est d'abord pure, ensuite pacifique, modérée, conciliante. » (Jacques 3:17)",
      };
      setSelectedTopic(newAnswer);
      setIsTyping(false);
      setCustomQuestion("");
    }, 800);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      
      {/* Topics list */}
      <div className="lg:col-span-5 space-y-3">
        <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-accent" />
          Questions de Discernement
        </h3>
        
        {PREDEFINED_TOPICS.map((topic, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedTopic(topic)}
            className={`w-full text-left p-4 rounded-2xl border transition-all ${
              selectedTopic?.question === topic.question
                ? "border-accent bg-accent/10 shadow-xs"
                : "border-border/60 bg-background/80 hover:border-border"
            }`}
          >
            <span className="font-serif font-semibold text-sm text-foreground block leading-snug">
              {topic.question}
            </span>
            <span className="text-[11px] text-accent font-sans block mt-1">
              Conseil & Verset d&apos;appui →
            </span>
          </button>
        ))}

        <form onSubmit={handleAskCustom} className="pt-3 space-y-2">
          <label className="text-xs font-semibold text-muted-foreground block">
            Poser une question spirituelle à EVA
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ex: Comment discerner la paix..."
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="h-10 rounded-xl bg-background text-xs"
            />
            <Button type="submit" size="sm" className="h-10 px-3.5 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground shrink-0">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </form>
      </div>

      {/* Answer Display Card */}
      <div className="lg:col-span-7">
        <Card className="rounded-2xl border-accent/40 bg-gradient-to-br from-background via-secondary/40 to-primary/5 shadow-sm h-full flex flex-col justify-between">
          <CardHeader className="space-y-2 border-b border-border/40 pb-5">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4 fill-accent" />
              <span className="text-xs uppercase tracking-wider font-semibold">EVA — coach &amp; conseil</span>
            </div>
            <CardTitle className="font-serif text-xl sm:text-2xl text-foreground">
              {selectedTopic?.question || "Sélectionnez un sujet"}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
            {isTyping ? (
              <div className="py-12 text-center text-muted-foreground text-sm font-serif italic animate-pulse">
                EVA recherche la sagesse biblique pour vous accompagner...
              </div>
            ) : selectedTopic ? (
              <>
                <p className="font-serif text-base sm:text-lg text-foreground leading-relaxed italic">
                  « {selectedTopic.answer} »
                </p>

                <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 space-y-1 mt-auto">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-accent">
                    <BookOpen className="h-3.5 w-3.5" /> Éclairage Biblique
                  </div>
                  <p className="text-xs sm:text-sm font-serif text-foreground italic">
                    {selectedTopic.verse}
                  </p>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
