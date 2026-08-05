# Scoring — vérité technique

## Données

- Stockées dans `profiles.psychometric_results`
- Remplies à chaque questionnaire complété (`src/app/actions/assessments.ts`)
- Matching paire : `src/lib/matching/score.ts`

## Seuils utiles (alignés `growth.ts` / matching)

| Seuil | Sens |
|-------|------|
| Dimension &lt; ~68 | Axe d’amélioration prioritaire (conseil Free/Alliance) |
| Domaine fort / à surveiller / risque | Statuts déjà calculés côté matching paire |

## Règle

Si un pilier n’est **pas** complété → pas de faux score : message « Terminez ce questionnaire pour débloquer ce domaine ».
