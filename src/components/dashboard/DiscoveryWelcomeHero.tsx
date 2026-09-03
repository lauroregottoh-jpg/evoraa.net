"use client"

/**
 * Accroche d’accueil — proposition de valeur concise.
 */
export function DiscoveryWelcomeHero({
  firstName,
  variant = "discovery",
}: {
  firstName?: string | null
  variant?: "discovery" | "alliance"
}) {
  const name = firstName?.trim() || null

  return (
    <section className="rounded-[1.75rem] border border-border/50 bg-[#FBF9F6] px-5 py-8 sm:px-8 sm:py-10">
      <div className="text-center space-y-3">
        {name ? (
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Bonjour {name}
          </p>
        ) : null}

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#5C1F28] leading-tight">
          Foi, discernement et matching enrichi.
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground">
          {variant === "alliance"
            ? "Votre parcours Alliance commence ici."
            : "Votre parcours Alliance commence ici."}
        </p>
      </div>
    </section>
  )
}
