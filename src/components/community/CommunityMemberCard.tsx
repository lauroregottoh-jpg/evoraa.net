"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Crown,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Users,
  Zap,
} from "lucide-react"
import { cn } from "@/utils/cn"
import {
  toggleCommunityLikeAction,
  type CommunityMemberCard,
} from "@/app/actions/community"
import { startConversationFromProfile } from "@/app/actions/messaging"

function BadgePill({ badge }: { badge: CommunityMemberCard["badge"] }) {
  if (badge === "alliance") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-md bg-[#B8954A] px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#A07070]">
        <Crown className="h-2.5 w-2.5" /> Alliance
      </span>
    )
  }
  if (badge === "boost") {
    return (
      <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
        <Zap className="h-2.5 w-2.5" /> Boost
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#A07070]">
      Découverte
    </span>
  )
}

export function CommunityMemberCardView({
  member,
  sameSexFriendship,
  isPaid,
}: {
  member: CommunityMemberCard
  sameSexFriendship: boolean
  isPaid: boolean
}) {
  const router = useRouter()
  const [liked, setLiked] = React.useState(member.likedByMe)
  const [busy, setBusy] = React.useState(false)
  const [hint, setHint] = React.useState("")

  const onLike = async () => {
    if (busy) return
    if (member.sameGender && !sameSexFriendship) {
      setHint(
        isPaid
          ? "Activez les amitiés même sexe dans Paramètres."
          : "Débloquez Alliance pour les amitiés même sexe."
      )
      return
    }
    setBusy(true)
    setHint("")
    const res = await toggleCommunityLikeAction(member.profileId)
    setBusy(false)
    if (res.error) {
      setHint(res.error)
      return
    }
    setLiked(Boolean(res.liked))
  }

  const onMessage = async () => {
    if (busy) return
    if (member.sameGender && !sameSexFriendship) {
      setHint(
        isPaid
          ? "Activez les amitiés même sexe dans Paramètres."
          : "Débloquez Alliance pour les amitiés même sexe."
      )
      return
    }
    setBusy(true)
    setHint("")
    const res = await startConversationFromProfile(member.profileId)
    setBusy(false)
    if (res.error || !res.conversationId) {
      setHint(res.error || "Impossible d’ouvrir la conversation.")
      return
    }
    router.push(`/messages/${res.conversationId}`)
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#E4D8CC] bg-white shadow-sm">
      <Link
        href={`/compatibility/${member.profileId}`}
        className="relative block aspect-[3/4] bg-gradient-to-br from-[#F8F4EC] to-[#EDE4DA]"
      >
        {member.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatarUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-serif text-5xl font-bold text-[#8B5A57]/25">
            {member.firstName.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute left-2 top-2">
          <BadgePill badge={member.badge} />
        </div>
        {member.sameGender ? (
          <span className="absolute right-2 top-2 rounded-md bg-[#8B5A57]/85 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#F7F1EA]">
            Amitié
          </span>
        ) : null}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
          <p className="font-serif text-base font-bold truncate">
            {member.firstName}
            {member.age > 0 ? ` · ${member.age}` : ""}
          </p>
          <p className="flex items-center gap-1 text-[11px] text-white/80 truncate">
            <MapPin className="h-3 w-3 shrink-0" />
            {member.city || "Ville non précisée"}
          </p>
          <p className="mt-1 text-[10px] font-semibold text-white/70">
            Voir la fiche →
          </p>
        </div>
      </Link>
      <div className="space-y-2 p-2.5">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void onLike()}
            className={cn(
              "flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition",
              liked
                ? "bg-[#7F5557] text-[#F7F1EA]"
                : "border border-[#DED1C4] bg-white text-[#7F5557] hover:bg-[#F5EDE0]"
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
            {liked ? "Aimé" : "Liker"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onMessage()}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#7F5557] px-2 text-[11px] font-bold text-[#F7F1EA] hover:opacity-90 disabled:opacity-60"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Message
          </button>
        </div>
        {hint ? (
          <p className="text-[10px] leading-snug text-[#8B5A57]">{hint}</p>
        ) : null}
      </div>
    </article>
  )
}

/** Teaser accueil — Communauté KELIAA. */
export function CommunityTeaser({
  members,
  sameSexFriendship,
  isPaid,
}: {
  members: CommunityMemberCard[]
  sameSexFriendship: boolean
  isPaid: boolean
}) {
  const preview = members.slice(0, 4)

  return (
    <section className="rounded-[1.75rem] border border-[#E4D8CC] bg-white shadow-sm">
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Communauté
            </p>
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Découvrir la communauté
            </h2>
          </div>
          <Link
            href="/communaute"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#8B5A57] px-4 text-xs font-bold text-[#F7F1EA] hover:opacity-90"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Voir →
          </Link>
        </div>

        {preview.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            La communauté s’enrichit — revenez bientôt.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {preview.map((m) => (
              <CommunityMemberCardView
                key={m.profileId}
                member={m}
                sameSexFriendship={sameSexFriendship}
                isPaid={isPaid}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
