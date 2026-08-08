# Hardening — écart vs Evoora (août 2026)

Objectif : niveau béton Evoora (~84) **sans jamais casser** inscription / login / accès.

> **Audit détaillé (août 2026) :** [`AUDIT_EVOORA_PARITY.md`](./AUDIT_EVOORA_PARITY.md) + canvas `keliaa-evoora-audit`.

## Fait (estim. ~82)

| Lot | Contenu |
|---|---|
| P0/P1 | Headers sécurité, Sentry soft, env Zod, audit admin, CI shape |
| B | CinetPay retiré, Moneroo + Bictorys, kill switches, outbox cron, runbooks |
| C (AUTH UNLOCK) | Cookies secure, HIBP, lockout, Turnstile optionnel, soft-confirm prod off, `registrations_paused` |
| Ops UX | Confirmation message admin + historique, nav membre 5 points, logout onboarding (soleil) |
| Eva auto | Cron `profile-reminders` voix Eva + bandeaux dashboard / MemberReminders |
| Rapport | DOSSIER RAPPORT + bilan individuel templates (pas matching paire) |

## En attente de **tes** clés API

→ `docs/API_KEYS_WHEN_READY.md` (Bictorys, Moneroo, Turnstile, Sentry).

## Lots D restants (après audit)

| Lot | Contenu | Risque |
|-----|---------|--------|
| **D0** | Clés live (toi) | — |
| **D1** | Cron `timingSafeEqual` partagé | **Fait** (août 2026) |
| **D2** | Webhook idempotency durable | **Fait** (migration `00027` **appliquée** + claim/mark) |
| **D3** | CSP stricte + nonce (créneau calme) | Élevé |
| **D4** | Sentry client/edge | **Fait soft** (configs + no-op sans DSN) |
| **D5** | Admin audit list + RL admin | **Fait** (list UI + 100/min userId + plus de mutations) |
| **D6** | Timing parity auth | **AUTH UNLOCK** |
| **D7** | Playwright smoke live | **Partiel** — `LIVE_SMOKE=1` + manifest PWA (Playwright full reporté) |
| **D8** | RLS profils resserrée | **Fait** (migration `00032` — à appliquer SQL) |
| **D3** | CSP stricte + nonce | **Reporté** (créneau calme dédié — risque UI) |
| **D9** | Perf admin/cron | **Partiel** — cron Alliance batch emails (`00028`) |
| — | Vercel Pro si crons &lt; 6 h nécessaires | Ops |
| — | Capacité + bug hunt quotidiens | **Fait** (`capacity-check`, `daily-bug-hunt`) |
| — | PWA installable | **Fait** (manifest + SW shell) |

## Règle d’or

Toute évolution auth = **`AUTH UNLOCK`** explicite + tests `auth-frozen-invariants`.
