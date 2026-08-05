# Décisions produit (validées)

## Tranches

| # | Décision |
|---|----------|
| 1 | **Nom produit** : **Mon bilan relationnel** |
| 2 | **Souverain ~10k** : on **prépare le kit** maintenant ; on ne vend pas tant que le prix/features ne sont pas figés |
| 3 | **Moteur texte** : **templates locaux uniquement** (pas d’appel OpenAI / pas de clé à brancher) |
| 4 | **Où afficher** : `/assessments` **et** dashboard **et** page Alliance |
| 5 | **Typologie admin** (`classifyProfileType`) : **reste côté ops** pour l’instant (pas exposée aux membres). En parallèle : permettre aux membres de **laisser un témoignage / retour positif** sur l’app (pas seulement plaintes) — à brancher plus tard |

## Clarification « typologie admin »

L’admin voit parfois un **libellé de profil** (ex. style relationnel) calculé depuis les tests.  
**Exposer aux membres** = afficher ce libellé dans « Mon bilan relationnel ».  
**Ta décision** : non pour l’instant ; on reste sur axes d’amélioration (piliers dossier) via templates.

## Source de vérité (août 2026)

- Rapport individuel : [`docs/DOSSIER RAPPORT.md`](../DOSSIER RAPPORT.md)
- Remap code ↔ piliers : [`docs/rapport/00_remap.md`](../rapport/00_remap.md)
- Ce dossier `matching/` = archive / matching paire seulement

## Suite technique

1. `buildProfileReport` + `src/lib/rapport/pillars.ts` → axes sur piliers dossier  
2. Surfaces : assessments + dashboard + Alliance  
3. Brancher biblio reco `RELxxx` du dossier (remplacer progressivement `growth.ts`)  
4. Plus tard : formulaire « témoigner / retour positif » membre
