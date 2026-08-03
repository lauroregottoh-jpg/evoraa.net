"use client";

import * as React from "react";
import Link from "next/link";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { PageHero } from "@/components/marketing/PageHero";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Search, BookOpen, Clock, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { getAllBlogArticles } from "@/lib/blog/articles";

/** Copy source: software-architecture/KELIA - Page d'accueil.docx — PAGE BLOG */
export default function BlogListPage() {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("Tous");

  const categories = ["Tous", "Foi & Mariage", "Discernement", "Témoignages", "Conseils"];
  const articles = getAllBlogArticles();

  const filteredArticles = articles.filter((art) => {
    const matchesCat = activeCategory === "Tous" || art.category === activeCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <CinematicLayout>
      <PageHero
        eyebrow="Journal d'inspiration"
        title="Préparez-vous à la rencontre"
        highlight="que Dieu a peut-être déjà préparée."
        subtitle="Découvrez des articles, des témoignages et des conseils inspirés de la Bible pour grandir dans votre foi, discerner avec sagesse et construire les fondations d'un mariage durable."
        imageSrc="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2000&auto=format&fit=crop"
        imageAlt="Inspiration et méditation"
      >
        <div className="pt-6 max-w-xl">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Recherchez un thème, un verset, un conseil ou un témoignage..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-full bg-black/40 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:border-accent text-sm backdrop-blur-md"
            />
          </div>
        </div>
        <div className="pt-4 flex flex-wrap items-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300",
                activeCategory === cat
                  ? "bg-accent text-background"
                  : "bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="py-10 px-6 sm:px-12 lg:px-20 max-w-4xl mx-auto">
        <div className="encart-kelia p-6 sm:p-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-xl font-semibold text-foreground">
                Une question sur votre parcours ?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Notre assistante EVA est disponible 24h/24 pour répondre à vos questions sur les
                relations, la plateforme et votre parcours sur Keliaa.
              </p>
            </div>
          </div>
          <MagneticButton href="/contact" variant="primary" size="md">
            Discuter avec EVA
          </MagneticButton>
        </div>
      </section>

      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-border space-y-4">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-foreground">Aucun article trouvé</h3>
            <p className="text-muted-foreground text-sm">
              Essayez de modifier vos mots-clés de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <Link
                key={art.slug}
                href={`/blog/${art.slug}`}
                className="group flex flex-col rounded-[2.5rem] bg-white border border-border hover:border-accent/40 overflow-hidden shadow-card transition-all duration-500 hover:-translate-y-2 select-none"
              >
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${art.image}')` }}
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-border text-[10px] font-mono text-accent uppercase font-semibold">
                    {art.category}
                  </span>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {art.readTime}
                      </span>
                      <span>•</span>
                      <span>{art.date}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Lire l&apos;article</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="py-24 px-6 text-center max-w-3xl mx-auto space-y-8 bg-secondary/30 border-y border-border">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">
          Et si votre prochain témoignage commençait aujourd&apos;hui ?
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Rejoignez une communauté de célibataires chrétiens qui avancent vers le mariage avec foi,
          discernement et espérance.
        </p>
        <div className="pt-4">
          <MagneticButton href="/register" variant="primary" size="lg">
            <span>Créer gratuitement mon profil</span>
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
