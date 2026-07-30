# KELIAA
## 03 - Tech Stack (Version MVP économique)

## Philosophie

Objectif : lancer KELIAA avec **le moins de coûts possible**, tout en gardant une architecture évolutive.

### Principes

- Éviter les abonnements payants au démarrage.
- Utiliser les offres gratuites tant qu'elles suffisent.
- Ne payer que lorsqu'il y a des utilisateurs qui génèrent des revenus.

---

## Stack technique

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Zustand

### Backend

- Supabase (plan gratuit au départ)

Services utilisés :
- PostgreSQL
- Authentification
- Base de données
- Stockage
- Realtime

### Hébergement

- Vercel (plan gratuit)
- Supabase Free

### Dépôt de code

- GitHub Free

### Design

- Figma Free

---

## Paiements

### V1

Privilégier :

- CinetPay (Mobile Money, cartes, Wave selon les pays)
- Intégration MakeTou si une API officielle est disponible.

### À vérifier

Si MakeTou expose une API documentée permettant :
- création de paiements,
- validation des transactions,
- webhooks,

alors elle peut remplacer CinetPay pour les paiements effectués via la plateforme.

Flutterwave n'est pas obligatoire pour la V1.

---

## Notifications

- Email : Resend (offre gratuite)
- Push : à ajouter plus tard.

---

## Analytics

- Google Analytics
- Microsoft Clarity

Les deux disposent d'offres gratuites adaptées au lancement.

---

## Outils de développement

- VS Code
- GitHub
- ChatGPT
- Claude Code (facultatif)

---

## Coûts estimés

Au lancement :

- GitHub : Gratuit
- Vercel : Gratuit
- Supabase : Gratuit
- Figma : Gratuit
- Google Analytics : Gratuit
- Microsoft Clarity : Gratuit

Les seules commissions apparaissent lorsque des paiements sont réellement effectués (CinetPay ou autre prestataire).

