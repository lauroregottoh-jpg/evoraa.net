# Audit Keliaa ↔ Evora — systèmes & sécurité

**Date :** août 2026  
**Repos :** code review `evoraa.net` vs `evoora` (même machine)  
**Mode :** audit complet **avant** corrections lot par lot  
**Canvas :** `canvases/keliaa-evoora-audit.canvas.tsx` (ouvrir à côté du chat)

## Verdict

Score estimé Keliaa **~82** → cible Evora **~84**.  
Socle auth / headers / webhooks / kill switches déjà solides. Keliaa est **devant** sur Turnstile, AUTH UNLOCK, kill switches, dual PSP. Evora mène sur Sentry depth, webhook dedup, cron timing-safe, admin RL/list, tests unitaires denser.

## Lots recommandés (ordre)

| Lot | Titre | Contenu | AUTH ? |
|-----|-------|---------|--------|
| **D0** | Ops keys | Bictorys, Moneroo, Turnstile, Sentry, vérifier `CRON_SECRET` | Non |
| **D1** | Cron harden | `verifyCronSecret` + `timingSafeEqual` (parity Evora) — **FAIT** `src/lib/security/cronAuth.ts` | Non |
| **D2** | Webhook dedup | Table `webhook_deliveries` + claim/mark sur Bictorys/Moneroo — **FAIT** | Non |
| **D3** | CSP nonce | Middleware nonce App Router — créneau calme | Adjacent |
| **D4** | Sentry depth | `withSentryConfig` client/server/edge | Non |
| **D5** | Admin surface | Audit list UI + RL admin + plus de mutations auditées | Non |
| **D6** | Auth polish | Timing parity (dummy bcrypt) | **AUTH UNLOCK** |
| **D7** | Playwright smoke | Register / login / OAuth staging | Non |
| **D8** | Privacy RLS | Reserrer SELECT profils | Non (DB) |
| **D9** | Perf | Pagination admin + batch cron emails | Non |

## Déjà fait (ne pas refaire)

- Headers HSTS / XFO / nosniff / Referrer / Permissions (`next.config.ts`)
- Cookies Secure + `.keliaa.org` + soft-confirm off prod
- HIBP (fail-open), lockout 5/15, Turnstile code, `registrations_paused`
- Webhook HMAC Bictorys/Moneroo + tests
- Cron `CRON_SECRET` (comparer encore trop naïf — D1)
- Audit admin write partiel + migration `00026`
- Tests shape : hardening, auth-frozen, webhook-auth

## Règles d’or

1. Ne jamais casser inscription / login / accès / paiements.  
2. Auth : `AUTH UNLOCK` + `tests/auth-frozen-invariants.test.mjs`.  
3. CSP seulement sur créneau dédié (risque UI).  
4. Voir aussi `docs/HARDENING_GAP.md`, `docs/AUTH_FROZEN.md`, `docs/API_KEYS_WHEN_READY.md`.

## Suite

Après validation de cet audit : démarrer **D1** (cron harden) immédiatement — **D0** reste côté clés chez toi.
