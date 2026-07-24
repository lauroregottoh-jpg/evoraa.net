"use client";

import * as React from "react";
import Link from "next/link";
import { CinematicLayout } from "@/components/layout/CinematicLayout";
import { PageHero } from "@/components/marketing/PageHero";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Search, BookOpen, Clock, ArrowRight, MessageCircle } from "lucide-react";
import { cn } from "@/utils/cn";

export default function BlogListPage() {
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("Tous");

  const categories = ["Tous", "Foi & Mariage", "Discernement", "Témoignages", "Conseils"];

  const articles = [
    {
      slug: "comment-reconnaitre-la-bonne-personne-selon-la-bible",
      title: "Comment reconnaître LA bonne personne selon les principes bibliques ?",
      excerpt: "Au-delà des émotions passagères, la Bible nous donne des critères de discernement spirituel clairs pour bâtir une alliance conjugale solide et éternelle.",
      category: "Discernement",
      readTime: "6 min de lecture",
      date: "18 Juillet 2026",
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",
    },
    {
      slug: "pourquoi-le-floutage-des-photos-transforme-les-rencontres",
      title: "Pourquoi le floutage des photos révolutionne les rencontres chrétiennes",
      excerpt: "En mettant l'accent sur l'âme, la foi et le projet de vie avant l'apparence physique, KELIAA restaure la dignité du dialogue conjugal.",
      category: "Foi & Mariage",
      readTime: "5 min de lecture",
      date: "14 Juillet 2026",
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80",
    },
    {
      slug: "le-role-de-la-prieres-dans-le-parcours-de-celibat",
      title: "Le rôle de la prière dans la saison du célibat : attente ou préparation ?",
      excerpt: "Le célibat n'est pas une salle d'attente passive. C'est un espace de croissance où Dieu forme notre cœur à aimer selon Son standard.",
      category: "Conseils",
      readTime: "7 min de lecture",
      date: "10 Juillet 2026",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80",
    },
    {
      slug: "temoignage-sarah-et-david-une-connexion-fondee-sur-la-vision",
      title: "Témoignage : « Nous avions exactement la même vision de l'hospitalité »",
      excerpt: "Découvrez l'histoire touchante de Sarah et David, qui se sont rencontrés sur KELIAA grâce à leur diagnostic spirituel commun sur l'accueil et le ministère.",
      category: "Témoignages",
      readTime: "8 min de lecture",
      date: "05 Juillet 2026",
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    },
    {
      slug: "gerer-les-finances-dans-le-couple-chretien",
      title: "Gérer les finances dans le couple chrétien : 4 principes de sagesse",
      excerpt: "L'argent est l'une des premières sources de tensions conjugales. Pourquoi l'un de nos 9 questionnaires spirituels y est entièrement consacré.",
      category: "Foi & Mariage",
      readTime: "6 min de lecture",
      date: "28 Juin 2026",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    },
    {
      slug: "l-importance-du-conseil-avant-le-mariage",
      title: "L'importance du conseil avant de s'engager dans le mariage",
      excerpt: "Dans une société individualiste, inviter un mentor ou un conseiller de confiance dans son discernement conjugal est une preuve de maturité.",
      category: "Conseils",
      readTime: "5 min de lecture",
      date: "20 Juin 2026",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCat = activeCategory === "Tous" || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || art.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <CinematicLayout>
      <PageHero
          eyebrow="Journal d'inspiration"
          title="Sagesse pour votre"
          highlight="saison de préparation."
          subtitle="Témoignages, conseils concrets et repères bibliques pour avancer vers le mariage avec lucidité — pas avec de la pression."
          imageSrc="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2000&auto=format&fit=crop"
          imageAlt="Inspiration et méditation"
        >
          <div className="pt-6 max-w-xl">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
              <input
                type="text"
                placeholder="Rechercher un article…"
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
                Besoin d&apos;une réponse personnalisée ?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Posez votre question et notre assistant vous répond 24h/24 et 7j/7.
              </p>
            </div>
          </div>
          <MagneticButton href="/contact" variant="primary" size="md">
            Poser ma question
          </MagneticButton>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-12 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-[#12121A] rounded-[3rem] border border-border/40 space-y-4">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-serif text-2xl font-bold text-white">Aucun article trouvé</h3>
            <p className="text-muted-foreground text-sm">Essayez de modifier vos mots-clés de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art, idx) => (
              <Link
                key={idx}
                href={`/blog/${art.slug}`}
                className="group flex flex-col rounded-[2.5rem] bg-[#12121A] border border-border/40 hover:border-accent/40 overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-2 select-none"
              >
                <div className="relative h-56 w-full overflow-hidden bg-black/50">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url('${art.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] via-transparent to-transparent opacity-80" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#12121A]/90 backdrop-blur-md border border-border/40 text-[10px] font-mono text-accent uppercase font-semibold">
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

                    <h3 className="font-serif text-xl font-bold text-white group-hover:text-accent transition-colors leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/20 flex items-center justify-between text-xs font-semibold text-accent">
                    <span>Lire l&apos;article</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA BOTTOM */}
      <section className="py-24 px-6 text-center max-w-3xl mx-auto space-y-8">
        <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">
          Écrivez votre propre témoignage spirituel.
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Inscrivez-vous sur KELIAA et laissez Dieu guider vos pas vers une relation authentique, fondée sur Sa Parole.
        </p>
        <div className="pt-4">
          <MagneticButton href="/register" variant="primary" size="lg">
            <span>Créer gratuitement mon compte</span>
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </section>
    </CinematicLayout>
  );
}
