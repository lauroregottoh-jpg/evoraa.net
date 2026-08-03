"use client";

import * as React from "react";

const SLIDES = [
  {
    brand: "KELLIA",
    title: "Vous recherchez",
    highlight: "LA bonne personne.",
    subtitle:
      "Kellia aide les célibataires chrétiens à rencontrer un futur conjoint grâce à une méthode fondée sur la compatibilité, la foi et le discernement. Parce qu'un mariage solide commence bien avant la première rencontre.",
  },
  {
    brand: "KELLIA",
    title: "Et si votre futur conjoint",
    highlight: "se trouvait à une décision de vous ?",
    subtitle:
      "Chez Kellia, nous ne cherchons pas à multiplier les matchs. Nous aidons des célibataires chrétiens sérieux à construire une rencontre qui peut conduire à un mariage.",
  },
  {
    brand: "KELLIA",
    title: "Les meilleures histoires",
    highlight: "commencent rarement par un swipe.",
    subtitle:
      "Elles commencent par une vision commune, des valeurs partagées et le désir sincère de construire un foyer. C'est exactement ce que Kellia vous aide à trouver.",
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
