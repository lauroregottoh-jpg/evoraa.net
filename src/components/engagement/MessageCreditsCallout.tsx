import Link from "next/link"
import {
  MESSAGE_CREDIT_PER_INVITE_ACCEPTED,
  MESSAGE_CREDIT_PER_INVITE_SENT,
  MESSAGE_CREDIT_PER_TEST,
  MESSAGE_CREDIT_TTL_DAYS,
} from "@/lib/matching/testCoverage"

export function MessageCreditsCallout({
  remaining,
  expiresAt,
}: {
  remaining?: number
  expiresAt?: string | null
}) {
  const extra = remaining && remaining > 0 ? remaining : 0
  let expiry = ""
  if (expiresAt) {
    try {
      expiry = new Date(expiresAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      })
    } catch {
      expiry = ""
    }
  }

  return (
    <div className="rounded-2xl border border-[#B8954A]/40 bg-[#F7F0E0] px-4 py-3.5 space-y-2">
      <p className="font-serif text-lg font-bold text-[#5C1F28]">
        Gagnez des messages
      </p>
      <ul className="text-sm text-[#3D1519] leading-relaxed space-y-1">
        <li>
          Faites un test → <strong>+{MESSAGE_CREDIT_PER_TEST} messages</strong>
        </li>
        <li>
          Invitez quelqu’un à un test →{" "}
          <strong>+{MESSAGE_CREDIT_PER_INVITE_SENT} messages</strong>
        </li>
        <li>
          S’il/elle le fait vraiment →{" "}
          <strong>+{MESSAGE_CREDIT_PER_INVITE_ACCEPTED} de plus</strong>
        </li>
      </ul>
      <p className="text-xs text-[#3D1519]/75">
        Les crédits durent {MESSAGE_CREDIT_TTL_DAYS} jours
        {extra > 0
          ? ` · vous avez ${extra} extra${expiry ? ` (expire le ${expiry})` : ""}`
          : ""}
        .
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        <Link
          href="/assessments"
          className="inline-flex h-9 items-center rounded-xl bg-[#5C1F28] px-3 text-xs font-bold text-[#F8F4EE]"
        >
          Faire un test
        </Link>
        <Link
          href="/compatibility"
          className="inline-flex h-9 items-center rounded-xl border border-[#5C1F28]/25 px-3 text-xs font-bold text-[#5C1F28]"
        >
          Inviter depuis une suggestion
        </Link>
      </div>
    </div>
  )
}
