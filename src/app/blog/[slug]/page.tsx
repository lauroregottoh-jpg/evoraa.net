"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowLeft, Clock, Share2, Sparkles, BookOpen, Heart, ArrowRight } from "lucide-react";

export default function BlogReadingPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Mock comprehensive article content for high fidelity reading experience
  const article = {
    title: slug === "comment-reconnaitre-la-bonne-personne-selon-la-bible"
      ? "Comment reconnaître LA bonne personne selon les principes bibliques ?"
      : slug === "pourquoi-le-floutage-des-photos-transforme-les-rencontres"
      ? "Pourquoi le floutage des photos révolutionne les rencontres chrétiennes"
      : "Le rôle du discernement spirituel dans la saison du célibat chrétien",
    category: "Discernement & Sagesse",
    readTime: "6 min de lecture",
    date: "18 Juillet 2026",
    author: "Équipe conseil KELIAA",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=80",
    content: `
      <p class="lead">Au-delà des émotions passagères et de l'attraction physique initiale, la Parole de Dieu nous offre des repères clairs et éternels pour discerner la personne avec qui construire une alliance conjugale.</p>
      
      <h3>1. L'alignement spirituel fondamental (2 Corinthiens 6:14)</h3>
      <p>Le premier critère, et le plus non-négociable, est le partage sincère de la seigneurie de Jésus-Christ. Il ne s'agit pas simplement d'aller à l'église le dimanche, mais d'avoir une même vision du Royaume, une même autorité spirituelle suprême à laquelle se soumettre lors des moments de décision conjugale.</p>
      
      <blockquote>« Ne vous mettez pas avec les infidèles sous un joug étranger. Car quelle participation y a-t-il entre la justice et l'iniquité ? »</blockquote>

      <h3>2. La convergence des appels et de la vision du couple</h3>
      <p>Deux personnes peuvent être profondément chrétiennes, mais appelées à des trajectoires de vie différentes. C'est pourquoi notre diagnostic EVA interroge en profondeur l'hospitalité, le ministère, la gestion financière et l'éducation des enfants. Deux ensemble ne marchent-ils pas s'ils ne se sont pas accordés ? (Amos 3:3).</p>

      <h3>3. Le fruit de l'Esprit dans la gestion des conflits</h3>
      <p>Observez comment l'autre réagit face à la contradiction, à l'attente et au stress. La patience, la douceur, la maîtrise de soi et l'humilité (Galates 5:22) sont le véritable ciment d'un mariage qui dure toute une vie.</p>

      <h3>4. La paix intérieure et le regard de personnes de confiance</h3>
      <p>Quand une relation est juste, une forme de paix durable s'installe — même dans les zones encore floues. Et très souvent, des mentors, coachs ou amis matures confirment ce que vous discernez déjà, sans forcer votre décision.</p>
    `,
  };

  return (
    <CinematicLayout>
      {/* HEADER ARTICLE */}
      <article className="pt-36 pb-24 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto space-y-12 select-none">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux articles
        </Link>

        <div className="space-y-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <span className="px-3.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-xs font-semibold">
              {article.category}
            </span>
            <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {article.readTime}
            </span>
            <span className="text-xs font-mono text-muted-foreground">• {article.date}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between border-y border-border py-4 text-xs text-muted-foreground">
            <span>
              Rédigé par <strong className="text-foreground">{article.author}</strong>
            </span>
            <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Share2 className="h-4 w-4" /> Partager
            </button>
          </div>
        </div>

        {/* IMAGE */}
        <div className="relative h-72 sm:h-96 rounded-[3rem] overflow-hidden bg-black/60 shadow-2xl border border-border/40">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${article.image}')` }}
          />
        </div>

        {/* CONTENT */}
        <div
          className="prose prose-lg max-w-none font-sans text-foreground space-y-6 leading-relaxed
                     [&>h3]:font-serif [&>h3]:text-2xl [&>h3]:text-primary [&>h3]:font-bold [&>h3]:mt-10 [&>h3]:mb-4
                     [&>blockquote]:font-serif [&>blockquote]:italic [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:bg-secondary/30 [&>blockquote]:rounded-r-2xl [&>blockquote]:text-foreground
                     [&>.lead]:font-serif [&>.lead]:text-xl [&>.lead]:text-foreground [&>.lead]:leading-relaxed [&>.lead]:italic
                     [&>p]:text-foreground/90"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* BOTTOM AUTHOR & CTA */}
        <div className="mt-16 p-10 rounded-[3rem] bg-white border border-accent/30 shadow-elevated text-center space-y-6">
          <div className="h-12 w-12 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Vivez cette promesse dans votre propre parcours.
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Sur KELIAA, chaque questionnaire, chaque échange et chaque révélation de photo est pensé pour honorer ces principes bibliques fondamentaux.
          </p>
          <div className="pt-2">
            <MagneticButton href="/register" variant="primary" size="lg">
              <span>Créer gratuitement mon profil</span>
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </article>
    </CinematicLayout>
  );
}
