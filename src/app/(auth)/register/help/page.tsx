import { AuthHeroShell } from "@/components/auth/AuthHeroShell"
import { SignupHelpForm } from "@/components/register/SignupHelpForm"

export default function RegisterHelpPage() {
  return (
    <AuthHeroShell
      footer={
        <p className="mt-8 max-w-md text-center text-xs text-white/70 leading-relaxed">
          Besoin d’aide uniquement pour l’inscription. Pour le reste, utilisez
          Contact après connexion.
        </p>
      }
    >
      <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-[#F3EFE8]/95 p-6 sm:p-10 shadow-premium backdrop-blur-xl">
        <SignupHelpForm />
      </div>
    </AuthHeroShell>
  )
}
