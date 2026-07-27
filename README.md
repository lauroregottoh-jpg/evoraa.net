# KELIAA — Plateforme de rencontre chrétienne (Afrique francophone)

**KELIAA** (`keliaa.net`) est une PWA de discernement relationnel : matching à 3 piliers, messagerie, EVA (coach local), abonnement Alliance via Mobile Money (CinetPay).

## Démarrage rapide (développeur)

```bash
npm install
cp .env.local.example .env.local   # puis remplir Supabase
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Ce que VOUS devez faire (fondateur / ops)

**Guide pas à pas :** [`docs/OPS_JOUR1.md`](docs/OPS_JOUR1.md)

| Étape | Action |
|-------|--------|
| 1 | Appliquer les migrations Supabase (`.\run_migration.ps1`) |
| 2 | Configurer Auth Supabase (URLs callback) |
| 3 | Bucket `avatars` + Realtime `messages` |
| 4 | Déployer sur Vercel |
| 5 | Devenir admin (`profiles.role = admin`) |
| 6 | Tester (mode démo paiements) |
| 7 | Inviter hommes + femmes |
| 8 | Activer CinetPay (quand vous voulez encaisser) |

## Paiements

- **Agrégateur :** [CinetPay](https://cinetpay.com) — Moov Money, TMoney (Togo), Wave, Orange Money (UEMOA)
- **Mode démo :** `PAYMENTS_DEMO_MODE=true` (soft launch sans encaisser)
- **Production :** clés `CINETPAY_*` + `PAYMENTS_DEMO_MODE=false`

Le code checkout + webhook est déjà intégré.

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind 4
- Supabase (Auth, PostgreSQL, Storage, Realtime)
- Vercel · CinetPay · Resend (emails, optionnel)

## Documentation

- [`DEPLOY.md`](DEPLOY.md) — checklist déploiement
- [`docs/PLAN_DASHBOARDS_ET_PRICING.md`](docs/PLAN_DASHBOARDS_ET_PRICING.md) — stratégie pricing
- [`software-architecture/`](software-architecture/) — specs produit

## Variables d'environnement

Voir [`.env.local.example`](.env.local.example).

## Migrations

9 fichiers SQL dans `supabase/migrations/` (dernier : `…00009_social_usage_trial.sql`).

```powershell
.\run_migration.ps1
```

Nécessite `SUPABASE_DB_URL` dans `.env.local`.
