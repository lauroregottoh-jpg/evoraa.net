"use client"

/**
 * Hero d'accueil — identité visuelle Farata.
 * Fond bordeaux profond, titre ivoire serif, sous-titre or, ornement.
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
    <section
      className="relative overflow-hidden rounded-2xl px-6 py-10 sm:px-10 sm:py-12"
      style={{ background: "#7A4F55" }}
    >
      {/* Ornement fond — cercle flou or */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-14 -right-14 h-56 w-56 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #B8954A 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #D4AF72 0%, transparent 70%)" }}
      />

      <div className="relative z-10 space-y-4">
        {/* Eyebrow */}
        <p
          className="text-[10px] font-bold uppercase tracking-[0.28em]"
          style={{ color: "#B8954A" }}
        >
          {name ? `Bonjour, ${name}` : "Bienvenue sur KELIAA"}
        </p>

        {/* Ligne dorée séparatrice */}
        <div
          className="h-px w-10 rounded-full"
          style={{ background: "#B8954A", opacity: 0.7 }}
        />

        {/* Titre principal */}
        <h1
          className="font-serif text-3xl sm:text-4xl font-bold leading-tight whitespace-pre-line"
          style={{ color: "#F2EBE0" }}
        >
          {variant === "alliance"
            ? "Plus qu'un match.\nUne alliance."
            : "Foi, valeurs\net vision du mariage."}
        </h1>

        {/* Sous-titre */}
        <p
          className="text-sm sm:text-base leading-relaxed"
          style={{ color: "rgba(249,243,238,0.80)" }}
        >
          {variant === "alliance"
            ? "Votre parcours Alliance est actif — matching enrichi et rapport personnalisé disponibles."
            : "Trouvez une personne qui partage votre foi, vos valeurs et votre vision du mariage."}
        </p>
      </div>
    </section>
  )
}
