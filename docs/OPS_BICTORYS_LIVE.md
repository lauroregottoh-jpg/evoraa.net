# OPS — Brancher Bictorys LIVE (Keliaa)

Guide débutant. Domaine réel : **`https://www.keliaa.org`** (pas `keliaa.net`).

## 1. Clés dans Bictorys

1. [dashboard.bictorys.com](https://dashboard.bictorys.com) → **Développeurs** → **API Keys**
2. Copie la **clé publique** live (`public-….`) → variable Vercel `BICTORYS_API_KEY`
3. **Développeurs** → **Webhooks** → nouveau webhook :
   - **URL** : `https://www.keliaa.org/api/payments/bictorys/notify`
   - **Secret** : une longue chaîne que **tu génères** (PowerShell / générateur) — pas la clé publique
4. Colle **exactement le même secret** dans Vercel → `BICTORYS_WEBHOOK_SECRET`

## 2. Variables Vercel (Production)

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://www.keliaa.org` |
| `PAYMENT_PROVIDER` | `bictorys` |
| `PAYMENTS_DEMO_MODE` | `false` |
| `BICTORYS_API_KEY` | `public-…` (live) |
| `BICTORYS_WEBHOOK_SECRET` | ton secret webhook |
| `BICTORYS_MERCHANT_COUNTRY` | `TG` |
| `BICTORYS_PAYMENT_MODE` | `mobile_money` |
| `SUPABASE_SERVICE_ROLE_KEY` | déjà présent |
| `RESEND_API_KEY` | recommandé (email Alliance activée) |

Puis **Redeploy**.

## 3. Vérifications

- Site : https://www.keliaa.org
- Checkout : https://www.keliaa.org/checkout
- Health (avec ton `CRON_SECRET`) :

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" https://www.keliaa.org/api/health/config
```

Attendu : `"provider":"bictorys"`, `"demoMode":false`, `"hasBictorysApiKey":true`, `"hasBictorysWebhookSecret":true`, `"bictorysSandbox":false`.

## 4. Premier paiement test

1. Compte membre connecté → Alliance / checkout
2. Paiement Mobile Money Togo (petit montant)
3. Retour success → Alliance **active** (pas seulement « en attente »)
4. Email « Alliance est active » si Resend est configuré
5. Admin → events paiement : `webhook_received` puis `payment_completed`

## 5. Incident : payé mais Alliance inactive

1. Vérifier l’URL webhook = `keliaa.org` (pas `.net`)
2. Secret Bictorys = secret Vercel
3. `PAYMENTS_DEMO_MODE=false`
4. Redeploy après changement d’env
5. Regarder `payment_events` dans admin

## 6. Ne jamais faire

- Mettre le secret dans l’URL (`?token=`)
- Utiliser `localhost` comme `NEXT_PUBLIC_APP_URL` en live
- Laisser `PAYMENTS_DEMO_MODE=true` en production
