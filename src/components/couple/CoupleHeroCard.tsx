import { cn } from "@/utils/cn"

/**
 * Carte d’accueil Couple — même langage que le dossier livrables.
 */
export function CoupleHeroCard({
  eyebrow,
  title,
  body,
  status,
  className,
}: {
  eyebrow: string
  title: string
  body: string
  status?: string
  className?: string
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#A07070] via-[#8B5C62] to-[#A07070] p-7 sm:p-9 text-[#F2EBE0]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(243,217,164,0.4), transparent 70%)",
        }}
      />
      <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#D4AF72]">
        {eyebrow}
      </p>
      <h1 className="relative mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
        {title}
      </h1>
      <p className="relative mt-3 text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
        {body}
      </p>
      {status ? (
        <p className="relative mt-4 text-xs text-white/55">{status}</p>
      ) : null}
    </header>
  )
}
