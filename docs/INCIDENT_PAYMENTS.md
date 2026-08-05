# Incident paiements — KELIAA

Runbook court si Alliance / webhooks clochent.

## Symptoms

- Membre a payé, Alliance inactive
- Webhook 401 / 403 dans logs Vercel
- Checkout refuse (« paiements suspendus »)

## 1. Kill switch ops

Console ops → Réglages :

- **Pause paiements** (`payments_paused`) → OFF pour réouvrir
- **Mode maintenance** → OFF

## 2. Env Vercel

| Variable | Attendu |
|---|---|
| `PAYMENTS_DEMO_MODE` | `false` en prod |
| `PAYMENT_PROVIDER` | `bictorys` (primair) |
| `BICTORYS_API_KEY` | live `public-…` |
| `BICTORYS_WEBHOOK_SECRET` | identique dashboard Bictorys |
| `SUPABASE_SERVICE_ROLE_KEY` | présent |

Health (secret CRON) :  
`GET /api/health/config?probe=1`  
Header : `Authorization: Bearer $CRON_SECRET`

## 3. Webhook Bictorys

URL : `https://www.keliaa.org/api/payments/bictorys/notify`  
Auth : header `x-secret-key` **ou** HMAC `x-webhook-signature` + `x-webhook-timestamp`  
Jamais `?token=` dans l’URL.

Vercel logs → filtre `bictorys_`.

## 4. Réactivation manuelle

Si paiement `pending` confirmé côté PSP :

1. Console ops / SQL : vérifier `payments.id` + `status`
2. Appeler RPC service_role `activate_pending_payment(p_payment_id, p_transaction_ref)`
3. Vérifier `subscriptions.status = active`

## 5. Emails d’activation

Outbox cron : toutes les 6 h (`vercel.json`).  
Health `?probe=1` → `email.outboxFailed` = mails dead-letter.

## 6. Escalade

Docs : `docs/OPS_BICTORYS_LIVE.md`  
Sentry : si `SENTRY_DSN` défini.
