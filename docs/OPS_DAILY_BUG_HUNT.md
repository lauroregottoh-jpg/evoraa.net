# Chasse bugs quotidienne (safe UX)

## Objectif

Chaque nuit : détecter des problèmes ops et **auto-corriger uniquement l’allowlist**, sans dégrader l’expérience membre et **sans** toucher auth / paiements / RLS / CSP / migrations.

## Déclencheurs

| Canal | Quand | Quoi |
|-------|-------|------|
| Cron Vercel `/api/cron/daily-bug-hunt` | 04:00 UTC | Probe Auth, outbox, rate-limit cleanup, kill switches (info) |
| `node scripts/daily-bug-hunt.mjs` | CI / manuel | Shape fichiers + `npm run test:smoke` |
| CI nightly (`.github/workflows/daily-bug-hunt.yml`) | schedule | Même script |

Auth : `Authorization: Bearer CRON_SECRET`.

## Allowlist auto-fix

- Remettre en file des emails `email_outbox` en `failed` (attempts &lt; 7)
- Flush `processEmailOutbox`
- Supprimer buckets `rate_limit_buckets` inactifs &gt; 48h

## Jamais auto

- Auth, cookies, Turnstile, HIBP
- Provider paiement / webhooks secrets
- Kill switches ON/OFF
- Migrations SQL / RLS / CSP
- Deploy sur `main`

## Rapport

- `platform_settings.ops_bug_hunt_status`
- `admin_audit_log` action `daily_bug_hunt`
- Bandeau `AdminOpsHealthBanner` + email ops si FAIL/WARN non auto

## UX

Fenêtre creuse uniquement. Failures = alerte humaine, pas de freeze site.
