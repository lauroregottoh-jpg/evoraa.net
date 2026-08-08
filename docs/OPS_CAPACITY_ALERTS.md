# Alertes capacité — Free → Pro

Cron : `GET /api/cron/capacity-check` (quotidien 05:15 UTC) avec `Authorization: Bearer CRON_SECRET`.

Résultat stocké dans `platform_settings.ops_capacity_alerts` + bandeau console ops + email `CONTACT_INBOX_EMAIL` / `OPS_ALERT_EMAIL`.

## Seuils (code)

Voir `src/lib/ops/capacityThresholds.ts` :

| Proxy | Warn | Critical | Action |
|-------|------|----------|--------|
| Profils | 800 | 1 000 | Supabase Pro avant campagne |
| Messages 24h | 400 | 1 200 | Surveiller Realtime → Supabase Pro |
| Outbox failed | 5 | 20 | Resend / domaine |
| Paiements pending stagnants | 15 | 40 | Webhooks + éventuellement Vercel Pro |

## Quotas exacts (dashboard)

Les plafonds Realtime (200 Free / 500 Pro), disque et egress se lisent dans **Supabase → Project → Usage**. Le cron utilise des **proxies app** (pas Management API).

## Upgrade sans figer le site

1. Supabase Dashboard → Upgrade to Pro (URL projet inchangée).
2. Optionnel : Vercel → Pro si timeouts SSR / crons plus fins.
3. Pas de maintenance_mode obligatoire.

## ngrok

N’augmente pas la capacité Free. Réservé aux tests webhooks en local.
