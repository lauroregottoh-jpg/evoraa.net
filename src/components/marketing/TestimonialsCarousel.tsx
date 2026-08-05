"use client";

import * as React from "react";
import { Quote } from "lucide-react";
import { cn } from "@/utils/cn";
import { KELIAA_TESTIMONIALS } from "@/lib/marketing/testimonials";

export function TestimonialsCarousel() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % KELIAA_TESTIMONIALS.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, []);

  const current = KELIAA_TESTIMONIALS[index];

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

        <div className="relative min-h-[290px] sm:min-h-[240px] flex flex-col items-center justify-center">
          {KELIAA_TESTIMONIALS.map((t, i) => (
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

        <div className="flex items-center justify-center gap-3 pt-4">
          <span className="text-xs tabular-nums text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(KELIAA_TESTIMONIALS.length).padStart(2, "0")}
          </span>
          <div className="flex justify-center gap-2">
          {KELIAA_TESTIMONIALS.map((_, i) => (
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
        </div>
        <p className="sr-only">Actuellement : {current.name}</p>
      </div>
    </section>
  );
}
