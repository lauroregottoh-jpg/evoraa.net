---
name: izisaas-payments
description: Use when integrating or debugging Keliaa Mobile Money payments (Bictorys primary, also CinetPay / Stripe / Moneroo / PayTech). Triggers — Bictorys webhook, HMAC, WAF curl, Alliance activation, payment_events.
---

# Keliaa — paiements

## Source de vérité dans ce repo

1. Code live : `src/lib/billing/` + `src/app/api/payments/bictorys/notify`
2. Guide OPS débutant : `docs/OPS_BICTORYS_LIVE.md`
3. Skill complète (adapters 4 providers) : `skills integration de paiement/izisaas mobile money skills/SKILL.md`

## Invariants Keliaa

- Domaine public : `https://www.keliaa.org` (jamais `keliaa.net`)
- Provider primary : Bictorys (`PAYMENT_PROVIDER=bictorys`)
- Webhook URL : `/api/payments/bictorys/notify`
- Auth webhook : header `x-secret-key` (ou HMAC) — **pas** `?token=`
- Activation Alliance : RPC `activate_pending_payment` (pending-only, race-safe)
- Mauvais `x-secret-key` → 401 immédiat (pas de fallthrough)
- Email Alliance activée : best-effort via outbox / Resend
- Bictorys WAF : appels API via `curl` subprocess (`bictorysClient.ts`)

## Quand debugger

| Symptôme | Check |
|---|---|
| Payé mais Alliance inactive | URL webhook `.org` ? secret Vercel = Bictorys ? demo=false ? |
| 403 webhook | `PAYMENTS_DEMO_MODE=true` |
| 401 webhook | secret manquant / faux |
| 500 webhook | `SUPABASE_SERVICE_ROLE_KEY` |
| Charge refuse localhost | `NEXT_PUBLIC_APP_URL` public |
