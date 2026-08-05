# Hardening P0/P1/B — rapprochement Evoora (août 2026)

Objectif : ~62 → ~75 (P0/P1) → **~79** (lot B) sans casser AUTH_FROZEN.

## Fait

| Item | Statut |
|---|---|
| Security headers | `next.config.ts` |
| Sentry + instrumentation + env Zod | done |
| Admin audit log | migration `00026` |
| CinetPay = activate RPC + payment_events | lot B |
| Webhook auth testable + anti-replay Bictorys | `webhookAuth.ts` + tests |
| Kill switches `payments_paused` / flag inscriptions | ops console |
| Outbox cron 6 h + DLQ count health | `vercel.json` |
| Runbook incident | `docs/INCIDENT_PAYMENTS.md` |

## Lot C (AUTH UNLOCK)

- Cookies `secure`, CAPTCHA, HIBP, soft-confirm off, enforce `registrations_paused`

## Humain

1. Migration `00026` appliquée
2. Ruleset GitHub Active + check `quality`
3. `SENTRY_DSN` optionnel
4. Hobby Vercel : cron toutes les 6 h peut exiger Pro — sinon repasser `0 9 * * *`
