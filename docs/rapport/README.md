# Rapport Personnalisé Alliance™

> Produit cible : **rapport vivant** (~18 pages) — pack `RAPPORT PERSONNALISE/OFFRE ALLIANCE/`  
> Contenu V1 : templates locaux (DOSSIER) + chapitres verrouillés  
> **Pas** le matching de paires (score A↔B)

## Sources de vérité

| Document | Rôle |
|----------|------|
| [`../RAPPORT PERSONNALISE/OFFRE ALLIANCE/`](../RAPPORT%20PERSONNALISE/OFFRE%20ALLIANCE/) | **Pack produit cible** (blueprint, 18 pages, 10+ évaluations, UX découverte, UI Spec, LIA) |
| [`../DOSSIER RAPPORT.md`](../DOSSIER%20RAPPORT.md) | Bibliothèque reco + formulations (contenu V1 tant que LIA n’est pas branchée) |
| [`00_remap.md`](./00_remap.md) | Mapping questionnaires Matching → piliers dossier |

## Code

| Élément | Chemin |
|---------|--------|
| Catalogue 10+ évaluations | `src/lib/rapport/personalized/assessments.catalog.ts` |
| Structure 18 chapitres | `src/lib/rapport/personalized/chapters.ts` |
| Assemblage rapport vivant | `src/lib/rapport/personalized/buildLivingReport.ts` |
| UI rapport | `src/components/rapport/PersonalizedReportView.tsx` |
| Cartes découverte | `src/components/rapport/DiscoveryAssessmentCards.tsx` |
| Remap / reco dossier | `src/lib/rapport/pillars.ts`, `selectRecommendations.ts` |
| Moteur tips Essentiel | `src/lib/matching/report/buildProfileReport.ts` |

## Offres

| Offre | Prix | Statut code |
|-------|------|-------------|
| Aperçu | 0 | `discovery` |
| Rapport Personnalisé (Alliance) | inclus 5 000 FCFA/mois | chapitres + tips Essentiel |
| Premium+ (tests approfondis) | futur | cartes visibles, verrouillées |
| Rapport Premium dossier (10k) | préparé | tier `sovereign` |

## Suite

1. ~~Structure 18 pages + chapitres verrouillés~~  
2. ~~Cartes découverte (essentielles / complémentaires / Premium+)~~  
3. Questionnaires dédiés pour évaluations sans `sourceSlug`  
4. Moteur LIA (`21_LIA_REPORT_ENGINE.md`) — remplacer progressivement les templates  
5. Export PDF selon `20_REPORT_UI_SPEC.md`
