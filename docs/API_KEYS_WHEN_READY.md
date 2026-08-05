# Clés API — à coller quand tu les as

Rien n’est bloquant sans ces clés : inscription / accès / soft-landing restent vivants.
Quand tu reçois les credentials, copie-les dans **Vercel → Project → Settings → Environment Variables** (Production + Preview).

## Paiements

| Variable | Provider | Où |
|---|---|---|
| `BICTORYS_API_KEY` | Bictorys | dashboard merchant |
| `BICTORYS_WEBHOOK_SECRET` | Bictorys | webhook = `https://www.keliaa.org/api/payments/bictorys/notify` |
| `MONEROO_SECRET_KEY` | Moneroo | si 2ᵉ provider |
| `MONEROO_WEBHOOK_SECRET` | Moneroo | webhook = `https://www.keliaa.org/api/payments/moneroo/notify` |
| `PAYMENT_PROVIDER` | `bictorys` ou `moneroo` | défaut logique déjà dans le code |

Guides : `docs/OPS_BICTORYS_LIVE.md`, `docs/OPS_MONEROO.md`, `docs/INCIDENT_PAYMENTS.md`.

## Auth optionnel (déjà fail-open)

| Variable | Effet |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | CAPTCHA Cloudflare |
| `ALLOW_SOFT_EMAIL_CONFIRM=true` | soft-confirm **uniquement** si tu en as encore besoin en prod |
| `PASSWORD_HIBP_CHECK=false` | désactive HIBP (déconseillé) |

## Observabilité

| Variable | Effet |
|---|---|
| `SENTRY_DSN` | erreurs runtime |
| `CRON_SECRET` | déjà requis pour les crons Vercel |

## Après ajout

1. Redeploy Vercel
2. `GET /api/health/config?probe=1` (admin) → provider + flags
3. 1 paiement test (sandbox ou 100 FCFA live)
4. Vérifier webhook “delivered” dans le dashboard provider
