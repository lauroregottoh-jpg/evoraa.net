# Hardening P0/P1 — rapprochement Evoora (août 2026)

Objectif : passer ~62 → ~75+/100 sans toucher la zone AUTH gelée.

## Fait

| Item | Statut |
|---|---|
| Security headers (HSTS, XFO, nosniff, Permissions-Policy) | `next.config.ts` |
| Instrumentation + env Zod soft | `src/instrumentation.ts`, `src/lib/config/env.ts` |
| Sentry SDK (`@sentry/nextjs`) + DIY fallback | `report.ts` |
| Health + DB probe `?probe=1` | `/api/health/config` |
| Migrations timestamps uniques (00024/00025) + `admin_audit_log` (00026) | `supabase/migrations/` |
| Audit ops `logAdminAction` | rôles, Alliance, photos, sanctions |
| Shape tests CI | `tests/hardening-shape.test.mjs` |
| CinetPay alignement | **reporté** (Bictorys primaire) |

## À faire côté humain

1. Appliquer la migration `20240101000026_admin_audit_log.sql` sur Supabase.
2. Vercel : définir `SENTRY_DSN` (optionnel).
3. GitHub → Settings → Branches → protéger `main` + exiger revue CODEOWNERS.
4. Cookies `secure` sur clients Supabase → nécessite **AUTH UNLOCK**.

## Vérif

```bash
npm run test:smoke
```
