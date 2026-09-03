"use client"

/**
 * Hero d'accueil — surface champagne, texte lisible.
 * Le rose reste réservé à la sidebar.
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
    <section className="relative overflow-hidden rounded-2xl border border-[#E4D8CC] bg-white px-6 py-10 sm:px-10 sm:py-12">
      <div className="relative z-10 space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8B5A57]">
          {name ? `Bonjour, ${name}` : "Bienvenue sur KELIAA"}
        </p>
        <div className="h-px w-10 rounded-full bg-[#8B5A57]/40" />
        <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight whitespace-pre-line text-[#2F2424]">
          {variant === "alliance"
            ? "Plus qu'un match.\nUne alliance."
            : "Foi, valeurs\net vision du mariage."}
        </h1>
        <p className="text-sm sm:text-base leading-relaxed text-[#5E4A4B]">
          {variant === "alliance"
            ? "Votre parcours Alliance est actif — matching enrichi et rapport personnalisé disponibles."
            : "Trouvez une personne qui partage votre foi, vos valeurs et votre vision du mariage."}
        </p>
      </div>
    </section>
  )
}
