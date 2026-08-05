# Moneroo — KELIAA

Alternative / second provider à côté de **Bictorys**.  
Docs officielles : https://docs.moneroo.io/

## Variables Vercel

| Variable | Rôle |
|---|---|
| `MONEROO_SECRET_KEY` | Clé secrète API (Bearer) |
| `MONEROO_WEBHOOK_SECRET` | Secret de signature webhook |
| `PAYMENT_PROVIDER` | `moneroo` pour forcer Moneroo ; sinon `bictorys` si clé Bictorys présente |

## Dashboard Moneroo

1. Créer les clés API (Developers).
2. Webhook URL : `https://www.keliaa.org/api/payments/moneroo/notify`
3. Copier le signing secret → `MONEROO_WEBHOOK_SECRET`
4. Événements : `payment.success`, `payment.failed`, `payment.cancelled`

## Flux KELIAA

1. `startCheckoutAction` → `POST /v1/payments/initialize`
2. Redirect `checkout_url`
3. Webhook → vérif `X-Moneroo-Signature` → `GET /v1/payments/{id}/verify` → `activate_pending_payment`

## Notes

- Montants en **XOF entiers** (pas de centimes).
- Metadata `keliaa_payment_id` lie le paiement Supabase.
- CinetPay a été **retiré** du code.
