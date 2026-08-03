# KELLIA — Frontend Specification

**Version :** 2.0
**Dernière mise à jour :** 30 juillet 2026

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase SSR
- React Hook Form et Zod
- Zustand
- GSAP, Lenis, React Three Fiber et Three.js pour le marketing
- Lucide React

## Principes

- Mobile-first et responsive.
- Accessible WCAG AA.
- Rapide sur 3G.
- Autorisation et validation métier côté serveur.
- Une action principale clairement identifiable.
- Réutilisation des composants existants.

## Routes publiques

- `/`
- `/about`
- `/how-it-works`
- `/pricing`
- `/blog`, `/blog/[slug]`
- `/contact`
- `/community-network`
- `/spiritual-resources`
- `/pastoral-endorsement`
- `/moderation`
- `/charte`
- `/confidentialite`
- `/cgu`
- `/mentions-legales`
- `/login`, `/register`
- `/forgot-password`, `/reset-password`

## Routes membre

- `/dashboard`
- `/compatibility`, `/compatibility/[id]`
- `/messages`, `/messages/[id]`
- `/assessments`, `/assessments/[slug]`
- `/academie-mariage`, modules et leçons
- `/profile`
- `/billing`
- `/notifications`
- `/settings`
- `/help`
- `/onboarding`, `/onboarding/magic-screen`
- `/checkout/[plan]`, `/checkout/pay`, `/checkout/success`, `/checkout/cancel`

## Route admin

- `/admin`

L’admin est une console à navigation interne : Dashboard, Analytique, Membres, Profils, Modération, Alliance et paiements, Matching et conversations, Académie, Coach EVA, Contenu et marketing, Paramètres.

## Navigation membre

Desktop :

- Accueil
- Découvrir
- Messages
- Tests
- Académie
- Alliance

Mobile primaire :

- Accueil
- Découvrir
- Messages
- Tests

Le menu secondaire contient Académie, Alliance, Alertes, Profil, Aide et Paramètres.

## Fonctionnalités UI principales

- Progression et rappels de profil.
- Compatibilités et scores expliqués.
- Cinq questionnaires de discernement.
- Axes de croissance.
- Messagerie et Bouclier de bienveillance.
- Coach EVA.
- Académie du mariage.
- Recommandation pastorale.
- Quotas Découverte/Alliance.
- Choix Mobile Money/carte.
- CMS admin, modération, analytics et audit paiement.

## États obligatoires

Chaque écran de données doit prévoir : chargement, vide, erreur, succès, accès refusé et données partielles.

## Design

La source de vérité est `08_Design_System.md`, puis `src/app/globals.css` et `src/app/layout.tsx`.

## Hors périmètre

- Application native.
- Appels audio/vidéo natifs.
- Mode hors-ligne complet.
