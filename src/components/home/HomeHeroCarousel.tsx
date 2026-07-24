"use client";

import * as React from "react";
import Image from "next/image";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1511285560929-80b456fe3b4f?q=80&w=2000&auto=format&fit=crop",
    brand: "KELIAA",
    title: "Rencontres chr\u00e9tiennes pour un",
    highlight: "mariage solide.",
    subtitle:
      "Parce que le swipe ignore les valeurs du Royaume, nous avons cr\u00e9\u00e9 un cadre de discernement \u2014 foi, vision du foyer, maturit\u00e9.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2000&auto=format&fit=crop",
    brand: "KELIAA",
    title: "Rencontrer L'\u00e2me s\u0153ur",
    highlight: "que Dieu a pr\u00e9par\u00e9e.",
    subtitle:
      "Chaque membre partage une ambition noble : b\u00e2tir une alliance, dans un espace s\u00e9curis\u00e9 et bienveillant.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2000&auto=format&fit=crop",
    brand: "KELIAA",
    title: "Matching \u00e9prouv\u00e9,",
    highlight: "pas hasard.",
    subtitle:
      "Tests, \u00e9tude de compatibilit\u00e9, profils v\u00e9rifi\u00e9s et respect de la vie priv\u00e9e : la diff\u00e9rence KELIAA.",
  },
];

type HomeHeroProps = {
  cta: React.ReactNode;
};

export function HomeHeroCarousel({ cta }: HomeHeroProps) {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden">
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image src={s.image} alt="" fill priority={i === 0} className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-primary/40 to-black/80" />
        </div>
      ))}

      <div className="relative z-20 max-w-4xl mx-auto text-center space-y-7">
        <p className="font-serif text-4xl sm:text-5xl text-white tracking-tight drop-shadow-lg">
          {slide.brand}
        </p>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-2xl">
          {slide.title}{" "}
          <span className="italic font-normal text-accent">{slide.highlight}</span>
        </h1>
        <p className="font-sans text-lg sm:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {slide.subtitle}
        </p>
        <div className="pt-4">{cta}</div>
        <div className="flex justify-center gap-2 pt-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Diapositive ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-accent" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
