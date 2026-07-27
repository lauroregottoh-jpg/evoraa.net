import Link from "next/link"
import { Camera } from "lucide-react"
import { cn } from "@/utils/cn"

export function ProfileProgressHero({
  firstName,
  completion,
  hasAvatar,
  isVerified,
}: {
  firstName: string
  completion: number
  hasAvatar: boolean
  isVerified: boolean
}) {
  return (
    <Link
      href="/profile"
      className="block rounded-2xl bg-primary text-primary-foreground p-5 sm:p-6 hover:brightness-[1.03] transition"
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "h-14 w-14 rounded-xl border-2 border-dashed border-primary-foreground/40 flex items-center justify-center shrink-0",
            hasAvatar && "border-solid border-accent/50 bg-primary-foreground/10"
          )}
        >
          <Camera className="h-6 w-6 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            Bonjour, {firstName}
          </h1>
          <p className="text-xs text-primary-foreground/70 mt-1">
            {isVerified ? "Membre vérifié(e)" : "Profil en maturité"} · Cliquez pour compléter
          </p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-primary-foreground/80">Profil complété</span>
              <span className="font-bold">{completion}%</span>
            </div>
            <div className="h-2 rounded-full bg-primary-foreground/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.min(100, Math.max(2, completion))}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
