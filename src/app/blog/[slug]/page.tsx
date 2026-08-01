"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ArrowLeft, Clock, Share2, Sparkles, ArrowRight } from "lucide-react";
import { getBlogArticle } from "@/lib/blog/articles";

export default function BlogReadingPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const article = getBlogArticle(slug);

  if (!article) {
    return (
      <CinematicLayout>
        <div className="pt-36 pb-24 px-6 text-center space-y-6 max-w-xl mx-auto">
          <h1 className="font-serif text-3xl font-bold text-foreground">Article introuvable</h1>
          <p className="text-sm text-muted-foreground">
            Cet article n&apos;existe pas ou a été déplacé.
          </p>
          <MagneticButton href="/blog" variant="primary" size="md">
            Retour au journal
          </MagneticButton>
        </div>
      </CinematicLayout>
    );
  }

  return (
    <CinematicLayout>
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

          <p className="font-serif text-lg sm:text-xl text-muted-foreground leading-relaxed italic max-w-3xl">
            {article.subtitle}
          </p>

          <div className="flex items-center justify-between border-y border-border py-4 text-xs text-muted-foreground">
            <span>
              Rédigé par <strong className="text-foreground">{article.author}</strong>
            </span>
            <button
              type="button"
              onClick={async () => {
                const url =
                  typeof window !== "undefined"
                    ? window.location.href
                    : `https://evoraa-net.vercel.app/blog/${article.slug}`
                const text = `${article.title} — ${url}`
                try {
                  if (navigator.share) {
                    await navigator.share({ title: article.title, text: article.subtitle, url })
                  } else {
                    await navigator.clipboard.writeText(text)
                    alert("Lien de l'article copié.")
                  }
                } catch {
                  try {
                    await navigator.clipboard.writeText(text)
                    alert("Lien de l'article copié.")
                  } catch {
                    /* ignore */
                  }
                }
              }}
              className="flex items-center gap-1.5 hover:text-accent transition-colors"
            >
              <Share2 className="h-4 w-4" /> Partager
            </button>
          </div>
        </div>

        <div className="relative h-72 sm:h-96 rounded-[3rem] overflow-hidden bg-muted shadow-2xl border border-border/40">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${article.image}')` }}
          />
        </div>

        <div
          className="prose prose-lg max-w-none font-sans text-foreground space-y-6 leading-relaxed
                     [&>h3]:font-serif [&>h3]:text-2xl [&>h3]:text-primary [&>h3]:font-bold [&>h3]:mt-10 [&>h3]:mb-4
                     [&>blockquote]:font-serif [&>blockquote]:italic [&>blockquote]:border-l-2 [&>blockquote]:border-accent [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:bg-secondary/30 [&>blockquote]:rounded-r-2xl [&>blockquote]:text-foreground
                     [&>.lead]:font-serif [&>.lead]:text-xl [&>.lead]:text-foreground [&>.lead]:leading-relaxed [&>.lead]:italic
                     [&>p]:text-foreground/90 [&>p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="mt-16 p-10 rounded-[3rem] bg-white border border-accent/30 shadow-elevated text-center space-y-6">
          <div className="h-12 w-12 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center text-accent mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Continuez votre chemin avec discernement.
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Sur KELIAA, chaque étape est pensée pour les célibataires chrétiens qui veulent avancer
            vers une rencontre digne, fondée sur la foi, les valeurs et un vrai projet de mariage.
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
