"use client";

import * as React from "react";

const SLIDES = [
  {
    brand: "KELIAA",
    title: "Vous ne cherchez pas un match.",
    highlight: "Vous cherchez une alliance.",
    subtitle:
      "Ici, on ne swipe pas des visages. On prend le temps de comprendre qui vous \u00eates, ce que vous croyez, et vers quel foyer vous voulez avancer.",
  },
  {
    brand: "KELIAA",
    title: "Rencontrer L'\u00e2me s\u0153ur",
    highlight: "dans un cadre digne.",
    subtitle:
      "Des c\u00e9libataires chr\u00e9tiens s\u00e9rieux, un processus clair, et la place pour discerner sans pression \u2014 ni spectacle, ni ambigu\u00eft\u00e9.",
  },
  {
    brand: "KELIAA",
    title: "La compatibilit\u00e9 d'abord.",
    highlight: "L'apparence ensuite.",
    subtitle:
      "Tests, \u00e9tude de compatibilit\u00e9, profils v\u00e9rifi\u00e9s, confidentialit\u00e9. Ce n'est pas magique : c'est m\u00e9thodique \u2014 et \u00e7a change tout.",
  },
];

type HomeHeroProps = {
  cta: React.ReactNode;
};

/** Text-only slides over the live particle background (no competing photo layer). */
export function HomeHeroCarousel({ cta }: HomeHeroProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 7500);
    return () => window.clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden">
      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-7">
        <div key={index} className="space-y-7 transition-opacity duration-700">
          <p className="font-serif text-4xl sm:text-5xl text-white tracking-tight drop-shadow-lg">
            {slide.brand}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[3.25rem] font-bold tracking-tight text-white leading-[1.15] drop-shadow-2xl">
            {slide.title}{" "}
            <span className="italic font-normal text-accent">{slide.highlight}</span>
          </h1>
          <p className="font-sans text-lg sm:text-xl text-white/92 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            {slide.subtitle}
          </p>
        </div>
        <div className="pt-4">{cta}</div>
        <div className="flex justify-center gap-2 pt-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Message ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-accent" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-white/55 text-xs font-semibold uppercase tracking-widest">
          Faire défiler
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}
