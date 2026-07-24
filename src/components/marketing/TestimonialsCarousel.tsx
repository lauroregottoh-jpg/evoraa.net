"use client";

import * as React from "react";
import { Quote } from "lucide-react";
import { cn } from "@/utils/cn";

const TESTIMONIALS = [
  {
    quote:
      "Pour la premi\u00e8re fois, on m\u2019a demand\u00e9 ma vision du mariage avant de me juger sur une photo. KELIAA m\u2019a redonn\u00e9 confiance.",
    name: "A\u00efcha",
    meta: "Abidjan \u00b7 Premium",
  },
  {
    quote:
      "Les questionnaires ont r\u00e9v\u00e9l\u00e9 ce que je cherchais vraiment. Nos \u00e9changes ont commenc\u00e9 sur la foi, pas sur les r\u00e9seaux.",
    name: "Marc",
    meta: "Paris \u00b7 Premium+",
  },
  {
    quote:
      "Cadre digne, profils s\u00e9rieux, pas de swipe. On avance avec discernement \u2014 c\u2019est exactement ce qu\u2019il me fallait.",
    name: "Esther",
    meta: "Douala \u00b7 D\u00e9couverte",
  },
  {
    quote:
      "Le matching m\u2019a propos\u00e9 quelqu\u2019un qui partageait ma vision du foyer. Aujourd\u2019hui on discerne ensemble, en paix.",
    name: "Samuel",
    meta: "Lom\u00e9 \u00b7 Premium",
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
            {"Témoignages"}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
            {"Des parcours fondés sur le discernement"}
          </h2>
        </div>

        <div className="relative min-h-[220px] flex flex-col items-center justify-center">
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
                <span className="block font-normal text-muted-foreground mt-1">
                  {t.meta}
                </span>
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
