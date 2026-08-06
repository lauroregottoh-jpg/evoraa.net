# Invariants critiques KELIAA

> Import adapté depuis la doctrine Evora (README / CLAUDE) — **août 2026**.  
> Produit : Keliaa (Supabase), pas Prisma/Redis Evora.

## Ne jamais casser

1. Inscription e-mail + Google  
2. Connexion e-mail + Google  
3. Accès site (www.keliaa.org)  
4. Paiements (webhooks Bictorys / Moneroo)

Toute modification auth / cookies / domaine = **`AUTH UNLOCK`** explicite + `tests/auth-frozen-invariants.test.mjs`.

Voir : `docs/AUTH_FROZEN.md`, `.cursor/rules/auth-critical.mdc`.

## Ops / sécurité (contrats)

| Domaine | Règle |
|---------|--------|
| Cron | `Authorization: Bearer ${CRON_SECRET}` via `verifyCronSecret` (timing-safe) |
| Webhooks | Lire le **raw body** avant parse JSON ; HMAC + dedup `webhook_deliveries` |
| Admin | Mutations sensibles → `logAdminAction` ; RL 100/min / userId |
| Sentry | Soft-init : pas de throw si `SENTRY_DSN` absent |
| Rate-limit auth | Fail-open volontaire (inscription prioritaire) |
| CSP | Pas encore (Lot D3) — headers HSTS/XFO/nosniff OK |

## Fichiers de référence

- Crons : `src/lib/security/cronAuth.ts`  
- Webhooks : `src/lib/billing/webhookAuth.ts`, `webhookDedup.ts`  
- Audit : `src/lib/admin/audit.ts`  
- Hardening : `docs/HARDENING_GAP.md`, `docs/AUDIT_EVOORA_PARITY.md`  
- Clés : `docs/API_KEYS_WHEN_READY.md`  
- Import batch Evora : `docs/PLAN_IMPORT_EVORA_FAQ.md`

## FAQ membre

Aide compte / connexion / Google : **`/faq`**.
