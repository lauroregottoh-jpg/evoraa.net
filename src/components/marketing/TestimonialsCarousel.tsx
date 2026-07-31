"use client";

import * as React from "react";
import { Quote } from "lucide-react";
import { cn } from "@/utils/cn";

/** Témoignages Accueil — source : KELIA - Page d'accueil.docx */
const TESTIMONIALS = [
  {
    quote:
      "Après plusieurs années sur différentes applications, je commençais à perdre espoir. Sur KELIAA, j'ai enfin rencontré des personnes qui partageaient réellement ma foi et ma vision du mariage. Les conversations étaient plus profondes dès les premiers échanges.",
    name: "Sarah",
    meta: "31 ans · Lomé",
  },
  {
    quote:
      "Pour la première fois, je ne me suis pas senti obligé d'impressionner. J'ai simplement pu être moi-même. Cette simplicité m'a redonné confiance.",
    name: "Jonathan",
    meta: "34 ans · Paris",
  },
];

export function TestimonialsCarousel() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, []);

  const current = TESTIMONIALS[index];

  return (
    <section className="py-24 px-6 sm:px-12 lg:px-20 bg-secondary/50 border-y border-border">
      <div className="max-w-4xl mx-auto text-center space-y-10">
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Témoignages
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
            Des parcours qui parlent vrai
          </h2>
        </div>

        <div className="relative min-h-[240px] flex flex-col items-center justify-center">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.name}
              className={cn(
                "absolute inset-x-0 transition-all duration-700 ease-out px-4",
                i === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none"
              )}
              aria-hidden={i !== index}
            >
              <Quote className="h-8 w-8 text-accent mx-auto mb-6" />
              <blockquote className="font-serif text-xl sm:text-2xl text-foreground leading-relaxed italic">
                « {t.quote} »
              </blockquote>
              <figcaption className="mt-6 text-sm font-semibold text-primary">
                {t.name}
                <span className="block font-normal text-muted-foreground mt-1">{t.meta}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex justify-center gap-2 pt-4">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Témoignage ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
        <p className="sr-only">Actuellement : {current.name}</p>
      </div>
    </section>
  );
}
