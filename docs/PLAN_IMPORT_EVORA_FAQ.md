# Plan — Import batch Evora → Keliaa + FAQ compte

**Date :** 6 août 2026  
**Principe :** un inventaire, une procédure d’import, puis installation — **pas** d’aller-retour au file à la file.

---

## 1. Verdict inventaire

Evora n’a **pas** un gros dossier `docs/` ops à recopier. Ce qui manque surtout chez Keliaa, ce sont des **configs + tripwires + doctrine agent** (Sentry depth, tests shape vercel↔cron, README invariants).

Keliaa a **déjà** : `OPS_*`, `INCIDENT_PAYMENTS`, `AUTH_FROZEN`, `HARDENING_GAP`, `AUDIT_EVOORA_PARITY`, cron timing-safe, webhook dedup, admin audit.

**Ne pas importer :** Prisma, Redis/Upstash, withdrawals/PIN, brand Evora, kit WORKFLOW headless.

---

## 2. Lots d’import (clic → procédure)

### Lot A — Docs / doctrine (import textuel)
| Source Evora | Cible Keliaa | Action |
|---|---|---|
| `README.md` § Invariants critiques | `README.md` ou `docs/INVARIANTS.md` | Adapter CRON / webhooks / AUTH UNLOCK / Supabase |
| `CLAUDE.md` règles cron/Sentry/audit | `AGENTS.md` + `.cursor/rules/` | Adapter sans Prisma |

### Lot B — Observabilité (fichiers config)
| Source Evora | Cible Keliaa | Action |
|---|---|---|
| `sentry.client/server/edge.config.ts` | racine `evoraa.net/` | Soft-init si `SENTRY_DSN` absent |
| `instrumentation.ts` pattern | étendre `src/instrumentation.ts` | Dynamic import Sentry |
| `lib/server/sentry.ts` ideas | étendre `src/lib/observability/report.ts` | Pas de copier-coller Prisma |

### Lot C — Tripwires tests (`.mjs` Keliaa)
| Pattern Evora | Fichier Keliaa | Action |
|---|---|---|
| vercel-json ↔ cron routes | `tests/vercel-cron-shape.test.mjs` | Nouveau |
| instrumentation/Sentry shape | étendre `hardening-shape` | Renforcer |
| runtime `nodejs` sur API routes | `tests/api-runtime-shape.test.mjs` | Après décision (P1) |
| README invariants shape | optionnel P2 | Plus tard |

### Lot D — FAQ membre (nouveau produit Keliaa — **pas** Evora)
| Livrable | Path |
|---|---|
| Page FAQ compte / inscription / connexion | `/faq` ou extension `/help` |
| Contenu : Google vs mot de passe, oubli MDP, email non confirmé, lockout, www vs non-www, cookie, « compte existe déjà » | basé messages réels `auth.ts` / callback |
| Liens : `/login`, `/register`, `/forgot-password`, `/contact`, `/register/help` | |

---

## 3. Procédure d’exécution (ordre strict)

```
[x] 0. Valider ce plan (toi)
[x] 1. Lot D FAQ — page publique + nav liens
[x] 2. Lot A — docs invariants
[x] 3. Lot B — Sentry configs soft
[x] 4. Lot C — tripwires vercel/cron + hardening
[x] 5. Tests smoke locaux
[x] 6. Commit + push + deploy (`51322c0`, www.keliaa.org)
[ ] 7. (Toi) coller SENTRY_DSN sur Vercel si prêt
[ ] 8. (Toi) SQL `00028` si pas encore appliqué
```

**Règles d’or pendant l’import :**
- Jamais casser signup / login Google+email / paiements.
- Auth : pas de changement de cookies / domaine sans `AUTH UNLOCK`.
- Chaque fichier Evora = **adapter** (Supabase, Kelvin brand), jamais blind copy.

---

## 4. Contenu FAQ prévu (brouillon)

### Connexion / compte
1. J’ai créé mon compte avec **Google** — pourquoi on me demande un mot de passe ?  
2. J’ai oublié mon mot de passe (compte e-mail).  
3. J’ai oublié comment je me suis inscrit (Google ou e-mail).  
4. « Email ou mot de passe incorrect ».  
5. « Un compte existe déjà avec cet email ».  
6. Trop d’échecs / compte temporairement bloqué (lockout 15 min).  
7. Email non confirmé / lien expiré.  

### Technique navigateur
8. Ça marche sur téléphone mais pas sur PC (www / cookies / cache).  
9. Après Google, je reviens sur une erreur (utiliser toujours https://www.keliaa.org).  
10. Inscriptions temporairement fermées (`registrations_paused`).  

### Paiement / Alliance (renvoi)
11. J’ai payé mais Alliance pas active → contact + `/billing` / support.

### CTA
- Boutons : Se connecter · Créer un compte · Mot de passe oublié · Contacter l’équipe · Aide inscription.

---

## 5. Hors scope de ce batch

- CSP nonce (Lot D3 hardening — créneau calme à part)
- MFA admin
- Playwright E2E live (D7)
- Refonte complète `/help` Eva (on ajoute FAQ compte, on ne casse pas Eva)

---

## 6. Critères « terminé »

- [ ] `/faq` (ou `/help#compte`) live avec ≥ 8 Q/R utiles  
- [ ] Liens depuis login + register + footer  
- [ ] `docs/INVARIANTS.md` (ou README section) présent  
- [ ] Configs Sentry soft commités ; build OK sans DSN  
- [ ] Test shape vercel↔cron vert  
- [ ] Deploy prod OK
