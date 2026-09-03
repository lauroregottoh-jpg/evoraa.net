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
    <div className="rounded-xl border border-[#B8954A]/35 bg-[#F7F0E0]/80 px-4 py-3">
      <p className="text-sm text-[#3D1830] leading-relaxed">
        Gagnez des messages en invitant vos étoiles à un test{" "}
        <span className="text-[#3D1830]/70">(jusqu&apos;à 20 messages)</span>
        .
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link
          href={inviteHref}
          className="text-xs font-semibold text-[#2D1020] underline underline-offset-2"
        >
          Inviter depuis une suggestion
        </Link>
        <Link
          href="/assessments"
          className="text-xs font-semibold text-[#2D1020] underline underline-offset-2"
        >
          Faire un test
        </Link>
      </div>
    </div>
  )
}
