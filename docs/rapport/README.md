# Rapport individuel KELIAA

> Produit : **Mon bilan relationnel** (rapport de soi)  
> **Pas** le matching de paires (score A↔B)

## Source de vérité

| Document | Rôle |
|----------|------|
| [`../DOSSIER RAPPORT.md`](../DOSSIER RAPPORT.md) | Base de connaissances officielle (piliers, scores, reco, prompts) |
| [`00_remap.md`](./00_remap.md) | Mapping tests code → 5 piliers dossier |
| `../matching/*` | Kit historique — **redirect conceptuel** vers ce dossier |

## Code

| Élément | Chemin |
|---------|--------|
| Remap piliers | `src/lib/rapport/pillars.ts` |
| Catalogue reco (généré) | `src/lib/rapport/recommendations.catalog.ts` |
| Sélection | `src/lib/rapport/selectRecommendations.ts` |
| Parse dossier | `scripts/parse-dossier-rapport.mjs` |
| Moteur bilan | `src/lib/matching/report/buildProfileReport.ts` |
| UI | `src/components/matching/RelationBilanCard.tsx` |

Régénérer le catalogue après édition du dossier :

```bash
node scripts/parse-dossier-rapport.mjs
```

## Suite

1. ~~Afficher les libellés des 5 piliers dossier~~  
2. ~~Brancher biblio RELxxx (+ listes SPI/PRJ/VAL/HUM)~~  
3. Rapport Essentiel (Alliance 5 reco) / Premium (Souverain 10)  
4. Enrichir `why` pour REL041+ si le parse manquant  
5. Remplacer progressivement les tips `growth.ts` côté Académie si besoin
