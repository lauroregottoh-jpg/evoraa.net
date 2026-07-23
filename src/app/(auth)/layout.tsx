import { ReactNode } from "react"
import Image from "next/image"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-secondary/20">
      
      {/* Left side: Form */}
      <div className="flex flex-1 items-center justify-center p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>

      {/* Right side: Floating Image Card (1/3 width) */}
      <div className="hidden lg:flex w-1/3 p-8 flex-col justify-center items-center relative">
        <div className="relative w-full h-full max-h-[800px] rounded-2xl overflow-hidden shadow-elevated border border-border/50 bg-white">
          <Image 
            src="/auth-bg-african.png"
            alt="Couple chrétien africain élégant"
            fill
            priority
            className="object-cover"
            sizes="33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          
          <div className="absolute bottom-0 left-0 right-0 p-10 z-10 text-center">
            <h2 className="text-2xl font-serif font-bold text-white mb-2 drop-shadow-md">
              KELIA
            </h2>
            <p className="text-sm text-white/90 drop-shadow-md">
              Trouvez une connexion qui a du sens, pour aujourd'hui et pour l'éternité.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  )
}
