"use client";

import Image from "next/image";
import { cn } from "@/utils/cn";

type PageHeroProps = {
  title: string;
  highlight?: string;
  subtitle?: string;
  imageSrc: string;
  imageAlt?: string;
  eyebrow?: string;
  className?: string;
  children?: React.ReactNode;
};

/** Full-bleed marketing header with strong contrast overlay. */
export function PageHero({
  title,
  highlight,
  subtitle,
  imageSrc,
  imageAlt = "",
  eyebrow,
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative min-h-[42vh] sm:min-h-[48vh] flex items-end overflow-hidden",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/35" />
      <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 pb-14 pt-36 space-y-4">
        {eyebrow && (
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </span>
        )}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl drop-shadow-lg">
          {title}
          {highlight ? (
            <>
              {" "}
              <span className="italic font-normal text-accent">{highlight}</span>
            </>
          ) : null}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg text-white/90 max-w-2xl leading-relaxed drop-shadow-md">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
