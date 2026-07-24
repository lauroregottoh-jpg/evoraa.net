import Image from "next/image";
import { cn } from "@/utils/cn";

type ExpertiseEncartProps = {
  eyebrow?: string;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  className?: string;
};

/** Marketing strip: text + full-bleed photo — one job, brand-forward. */
export function ExpertiseEncart({
  eyebrow,
  title,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
  className,
}: ExpertiseEncartProps) {
  return (
    <section
      className={cn(
        "grid lg:grid-cols-2 gap-0 overflow-hidden border border-border bg-white",
        className
      )}
    >
      <div
        className={cn(
          "relative min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]",
          reverse ? "lg:order-2" : "lg:order-1"
        )}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
      </div>
      <div
        className={cn(
          "flex flex-col justify-center gap-4 p-8 sm:p-12 lg:p-16 bg-secondary/40",
          reverse ? "lg:order-1" : "lg:order-2"
        )}
      >
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
          {body}
        </p>
      </div>
    </section>
  );
}
