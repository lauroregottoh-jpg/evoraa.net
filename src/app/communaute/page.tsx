import { MemberPage } from "@/components/layout/MemberPage"
import { listCommunityMembers } from "@/app/actions/community"
import { CommunityMemberCardView } from "@/components/community/CommunityMemberCard"
import Link from "next/link"
import { Crown, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CommunautePage() {
  const { members, error, sameSexFriendship, isPaid } =
    await listCommunityMembers(60)

  return (
    <MemberPage>
      <div className="space-y-6 py-4 max-w-5xl mx-auto">
        <header className="relative overflow-hidden rounded-[1.75rem] border border-[#B8954A]/35 bg-gradient-to-br from-[#FFFBF5] via-[#F8F4EE] to-[#F0E6D4] p-6 sm:p-8 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8B6914] inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#B8954A]" />
            Communauté KELIAA
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-[#1C1412]">
            Découvrir la communauté
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#1C1412]/70 leading-relaxed">
            Tous les membres inscrits. Vous ne pouvez pas écrire directement :
            likez un profil — si la personne like en retour, les messages
            s’ouvrent.
          </p>
          {!isPaid ? (
            <Link
              href="/premium"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-[#B8954A]/40 bg-white px-4 text-xs font-bold text-[#5C1F28]"
            >
              <Crown className="h-3.5 w-3.5 text-[#B8954A]" />
              Alliance · amitiés même sexe + Matching enrichi
            </Link>
          ) : !sameSexFriendship ? (
            <Link
              href="/settings"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl border border-[#B8954A]/40 bg-[#B8954A]/15 px-4 text-xs font-bold text-[#5C1F28]"
            >
              Activer les amitiés même sexe dans Paramètres →
            </Link>
          ) : (
            <p className="mt-3 text-xs font-semibold text-emerald-700">
              Amitiés même sexe activées · Alliance
            </p>
          )}
        </header>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((m) => (
            <CommunityMemberCardView
              key={m.profileId}
              member={m}
              sameSexFriendship={sameSexFriendship}
              isPaid={isPaid}
            />
          ))}
        </div>

        {members.length === 0 && !error ? (
          <p className="text-center text-sm text-muted-foreground py-12">
            Aucun membre à afficher pour le moment.
          </p>
        ) : null}
      </div>
    </MemberPage>
  )
}
