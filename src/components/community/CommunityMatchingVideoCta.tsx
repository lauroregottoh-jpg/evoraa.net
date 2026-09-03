"use client"

import Link from "next/link"

const VIDEO_SRC = "/videos/keliaa-test.mp4"

/**
 * Encart Matching texte seul (pages compat / fallback mobile).
 */
export function CommunityMatchingCta({
  compact = false,
}: {
  compact?: boolean
}) {
  return (
    <aside className="relative overflow-hidden rounded-2xl border border-[#641F2B]/20 bg-gradient-to-br from-[#641F2B] via-[#4A1820] to-[#2A1810] text-[#FFFDF9] p-5 sm:p-6">
      <div className="space-y-3 max-w-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E8D49A]">
          Matching KELIAA
        </p>
        <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug">
          Tu veux vraiment rencontrer la bonne personne&nbsp;?
        </h2>
        {!compact ? (
          <p className="text-sm text-white/80 leading-relaxed">
            Fais tes cinq tests. Découvre ton profil, tes besoins et ce qui te
            correspond vraiment — puis débloque le matching IA.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href="/assessments"
            className="inline-flex h-11 items-center rounded-xl bg-[#E8D49A] px-5 text-sm font-semibold text-[#641F2B]"
          >
            Fais tes cinq tests maintenant
          </Link>
          <Link
            href="/compatibility"
            className="inline-flex h-11 items-center rounded-xl border border-white/30 px-4 text-sm font-semibold text-white"
          >
            Voir le matching
          </Link>
        </div>
      </div>
    </aside>
  )
}

/**
 * Bloc communauté : vidéo encadrée (desktop) + CTAs dessous.
 * Mobile : carte Matching (vidéo masquée si le format ne passe pas).
 */
export function CommunityHeroWithVideo() {
  return (
    <div className="space-y-4">
      {/* Desktop / tablette large : vidéo + CTAs */}
      <section className="hidden md:block rounded-2xl border border-[#641F2B]/20 bg-[#FCFAF6] p-4 sm:p-5 shadow-card">
        <div className="overflow-hidden rounded-xl border border-[#641F2B]/25 bg-black shadow-sm">
          <video
            className="block w-full aspect-video max-h-[380px] object-contain bg-black"
            src={VIDEO_SRC}
            controls
            playsInline
            preload="metadata"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <Link
            href="/assessments"
            className="inline-flex h-11 items-center rounded-xl bg-[#641F2B] px-5 text-sm font-semibold text-[#FCFAF6]"
          >
            Faites un test maintenant
          </Link>
          <Link
            href="/compatibility"
            className="inline-flex h-11 items-center rounded-xl border border-[#641F2B]/30 px-5 text-sm font-semibold text-[#641F2B]"
          >
            Voir le Matching
          </Link>
        </div>
      </section>

      {/* Mobile : carte Matching sans forcer la vidéo portrait */}
      <div className="md:hidden">
        <CommunityMatchingCta />
      </div>
    </div>
  )
}

/** Vidéo après les clés (Tests) — paysage, toujours visible. */
export function KeliaaTestVideoBlock() {
  return (
    <section className="rounded-2xl border border-[#641F2B]/15 bg-[#FCFAF6] p-4 sm:p-5 space-y-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D7B866]">
          Vidéo
        </p>
        <h2 className="font-serif text-xl font-bold text-[#641F2B] mt-1">
          KELIAA TEST
        </h2>
        <p className="text-sm text-[#2B2421]/65 mt-1">
          Comprendre le parcours tests → matching, en images.
        </p>
      </div>
      <div className="relative w-full overflow-hidden rounded-xl border border-[#641F2B]/20 bg-[#2B2421] shadow-sm">
        <video
          className="block w-full max-h-[min(70vh,420px)] aspect-video object-contain bg-black"
          src={VIDEO_SRC}
          controls
          playsInline
          preload="metadata"
        />
      </div>
    </section>
  )
}

/** @deprecated */
export function CommunityMatchingVideoCta(props: { compact?: boolean }) {
  return <CommunityMatchingCta {...props} />
}
