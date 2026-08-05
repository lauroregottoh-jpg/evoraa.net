# Hardening — écart vs Evoora (août 2026)

Objectif : niveau béton Evoora (~84) **sans jamais casser** inscription / login / accès.

## Fait (estim. ~82)

| Lot | Contenu |
|---|---|
| P0/P1 | Headers sécurité, Sentry soft, env Zod, audit admin, CI shape |
| B | CinetPay retiré, Moneroo + Bictorys, kill switches, outbox cron, runbooks |
| C (AUTH UNLOCK) | Cookies secure, HIBP, lockout, Turnstile optionnel, soft-confirm prod off, `registrations_paused` |
| Ops UX | Confirmation message admin + historique, nav membre 5 points, logout onboarding (soleil) |
| Eva auto | Cron `profile-reminders` voix Eva + bandeaux dashboard / MemberReminders |

## En attente de **tes** clés API

→ `docs/API_KEYS_WHEN_READY.md` (Bictorys, Moneroo, Turnstile, Sentry).

## Lot D restant (code quand tu veux)

- CSP stricte avec nonce App Router (risqué : on attend un créneau calme)
- Smoke Playwright live (navigateur) — base Node déjà en `test:smoke`
- Vercel Pro si crons &lt; 6 h nécessaires

## Règle d’or

Toute évolution auth = **`AUTH UNLOCK`** explicite + tests `auth-frozen-invariants`.
