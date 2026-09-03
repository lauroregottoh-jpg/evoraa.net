import Link from "next/link"

export function MessageCreditsCallout({
  variant = "default",
}: {
  /** Sur /compatibility : les deux actions côte à côte */
  variant?: "default" | "compatibility"
}) {
  const inviteHref =
    variant === "compatibility" ? "#suggestions" : "/compatibility"

  return (
    <div className="rounded-xl border border-[#D7B866]/35 bg-[#EFE5DA]/80 px-4 py-3">
      <p className="text-sm text-[#451923] leading-relaxed">
        Gagnez des messages en invitant vos étoiles à un test{" "}
        <span className="text-[#451923]/70">(jusqu&apos;à 20 messages)</span>
        .
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link
          href={inviteHref}
          className="text-xs font-semibold text-[#641F2B] underline underline-offset-2"
        >
          Inviter depuis une suggestion
        </Link>
        <Link
          href="/assessments"
          className="text-xs font-semibold text-[#641F2B] underline underline-offset-2"
        >
          Faire un test
        </Link>
      </div>
    </div>
  )
}
