import Link from "next/link"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import { MainLayout } from "@/components/layout/MainLayout"

export const metadata: Metadata = {
  title: "FAQ compte & connexion | KELIAA",
  description:
    "Aide pour s’inscrire, se connecter, Google, mot de passe oublié et erreurs fréquentes sur KELIAA.",
}

type FaqItem = {
  id: string
  q: string
  a: ReactNode
}

const ITEMS: FaqItem[] = [
  {
    id: "google-vs-password",
    q: "Je me suis inscrit avec Google — pourquoi me demande-t-on un mot de passe ?",
    a: (
      <>
        Si vous avez choisi <strong>Continuer avec Google</strong>, votre compte
        est lié à Google : reconnectez-vous avec le même bouton Google. Un mot
        de passe e-mail n’est pas obligatoire. Si vous voulez aussi un mot de
        passe e-mail, utilisez{" "}
        <Link href="/forgot-password" className="text-primary font-semibold underline">
          Mot de passe oublié
        </Link>{" "}
        avec la même adresse Google pour en créer un.
      </>
    ),
  },
  {
    id: "forgot-google",
    q: "J’ai oublié mon « mot de passe Google » / je n’arrive plus à ouvrir Google",
    a: (
      <>
        KELIAA ne stocke pas le mot de passe de votre compte Google. Gérez-le
        sur{" "}
        <a
          href="https://myaccount.google.com/security"
          className="text-primary font-semibold underline"
          target="_blank"
          rel="noreferrer"
        >
          le compte Google
        </a>
        . Sur KELIAA, réessayez depuis{" "}
        <a href="https://www.keliaa.org/login" className="text-primary font-semibold underline">
          www.keliaa.org/login
        </a>{" "}
        (toujours avec le <strong>www</strong>). Sinon créez un accès e-mail via{" "}
        <Link href="/forgot-password" className="text-primary font-semibold underline">
          Mot de passe oublié
        </Link>
        .
      </>
    ),
  },
  {
    id: "forgot-email",
    q: "J’ai oublié mon mot de passe (compte e-mail)",
    a: (
      <>
        Allez sur{" "}
        <Link href="/forgot-password" className="text-primary font-semibold underline">
          Mot de passe oublié
        </Link>
        , saisissez votre e-mail, puis suivez le lien reçu. Vérifiez aussi les
        spams. Le lien expire : demandez-en un nouveau si besoin.
      </>
    ),
  },
  {
    id: "which-method",
    q: "Je ne me souviens plus si je me suis inscrit avec Google ou par e-mail",
    a: (
      <>
        Essayez d’abord <strong>Continuer avec Google</strong> avec la même
        adresse. Si Google dit qu’aucun compte n’est lié, utilisez e-mail +{" "}
        <Link href="/forgot-password" className="text-primary font-semibold underline">
          Mot de passe oublié
        </Link>
        . Ne créez pas un second compte avec une autre adresse.
      </>
    ),
  },
  {
    id: "wrong-password",
    q: "Message « Email ou mot de passe incorrect »",
    a: (
      <>
        Vérifiez l’orthographe de l’e-mail, le clavier (majuscules), puis{" "}
        <Link href="/forgot-password" className="text-primary font-semibold underline">
          réinitialisez le mot de passe
        </Link>
        . Si vous veniez de vous « réinscrire » avec le même e-mail, le compte
        existait déjà : récupérez-le plutôt que de créer un doublon.
      </>
    ),
  },
  {
    id: "already-exists",
    q: "« Un compte existe déjà avec cet email »",
    a: (
      <>
        Connectez-vous sur{" "}
        <Link href="/login" className="text-primary font-semibold underline">
          /login
        </Link>{" "}
        (Google ou e-mail). Si vous ne retrouvez pas le mot de passe :{" "}
        <Link href="/forgot-password" className="text-primary font-semibold underline">
          Mot de passe oublié
        </Link>
        .
      </>
    ),
  },
  {
    id: "lockout",
    q: "Trop d’échecs / je dois attendre avant de réessayer",
    a: (
      <>
        Après plusieurs mauvaises tentatives, la connexion est pausée environ{" "}
        <strong>15 minutes</strong> (protection anti-abus). Attendez, ou
        utilisez{" "}
        <Link href="/forgot-password" className="text-primary font-semibold underline">
          Mot de passe oublié
        </Link>
        .
      </>
    ),
  },
  {
    id: "email-confirm",
    q: "Email non confirmé / lien expiré",
    a: (
      <>
        Ouvrez le dernier e-mail KELIAA et cliquez sur le lien (une seule
        fois). S’il est expiré, reconnectez-vous avec le même e-mail et mot de
        passe, ou demandez un nouveau lien via{" "}
        <Link href="/forgot-password" className="text-primary font-semibold underline">
          Mot de passe oublié
        </Link>
        . Ajoutez nos adresses à vos contacts pour éviter les spams.
      </>
    ),
  },
  {
    id: "www",
    q: "Google m’envoie une erreur / ça marche mal selon le navigateur",
    a: (
      <>
        Utilisez toujours{" "}
        <strong>https://www.keliaa.org</strong> (avec www). Videz le cache pour
        keliaa.org, réessayez en navigation privée. Évitez les redirections
        depuis un lien sans www pendant l’étape Google.
      </>
    ),
  },
  {
    id: "registrations-paused",
    q: "Je ne peux plus m’inscrire",
    a: (
      <>
        Les nouvelles inscriptions peuvent être temporairement fermées (soft
        launch / maintenance). Réessayez plus tard ou{" "}
        <Link href="/contact" className="text-primary font-semibold underline">
          contactez l’équipe
        </Link>
        . Si vous avez déjà un compte,{" "}
        <Link href="/login" className="text-primary font-semibold underline">
          connectez-vous
        </Link>
        .
      </>
    ),
  },
  {
    id: "alliance-pay",
    q: "J’ai payé Alliance mais mon compte n’est pas mis à jour",
    a: (
      <>
        Attendez 1–2 minutes puis rechargez{" "}
        <Link href="/billing" className="text-primary font-semibold underline">
          /billing
        </Link>
        . Si rien ne bouge,{" "}
        <Link href="/contact" className="text-primary font-semibold underline">
          contactez-nous
        </Link>{" "}
        avec l’e-mail du compte et l’heure du paiement (ne partagez jamais vos
        codes bancaires).
      </>
    ),
  },
]

export default function FaqPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16 space-y-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Aide
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            FAQ — compte & connexion
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Inscription, Google, mot de passe oublié, messages d’erreur
            fréquents. Pour un suivi humain :{" "}
            <Link href="/contact" className="text-primary font-semibold underline">
              contact
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold"
            >
              Créer un compte
            </Link>
            <Link
              href="/forgot-password"
              className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold"
            >
              Mot de passe oublié
            </Link>
          </div>
        </header>

        <div className="space-y-3">
          {ITEMS.map((item) => (
            <details
              key={item.id}
              id={item.id}
              className="group rounded-2xl border border-border bg-card px-4 sm:px-5 py-3 open:pb-4"
            >
              <summary className="cursor-pointer list-none font-semibold text-sm sm:text-base leading-snug pr-6 relative">
                {item.q}
                <span className="absolute right-0 top-0 text-muted-foreground group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <div className="pt-3 text-sm text-muted-foreground leading-relaxed space-y-2">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Aide inscription dédiée :{" "}
          <Link href="/register/help" className="underline font-semibold text-primary">
            /register/help
          </Link>
          {" · "}
          Conseils EVA (membres) :{" "}
          <Link href="/help" className="underline font-semibold text-primary">
            /help
          </Link>
        </p>
      </div>
    </MainLayout>
  )
}
