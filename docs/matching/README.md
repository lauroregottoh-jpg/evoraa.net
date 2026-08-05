# Matching & rapports de croissance — KELIAA

> **Statut :** kit documentaire créé (août 2026) — moteur code à brancher ensuite  
> **Pattern :** même approche qu’Eva (`docs/eva` + `src/lib/eva/engine.ts`)  
> **Règle d’or :** ne pas inventer de scores ; tout part des questionnaires à 5 piliers déjà en prod

## Pourquoi ce dossier

Le matching **pair** (compatibilité A↔B) existe déjà dans le code.  
Ce kit porte le **rapport de soi** : résumé + points améliorés par domaine, selon le plan.

| Plan | Produit rapport |
|------|-----------------|
| **Découverte (gratuit)** | 1 conseil léger par pilier (ou axes les plus faibles) |
| **Alliance (5 000 FCFA)** | **Mon bilan relationnel** — résumé bref + points améliorés par domaine |
| **Souverain (~10 000, futur)** | Rapport détaillé (kit préparé, vente plus tard) |

## Cartographie

| Fichier | Rôle |
|---------|------|
| `00_missing_info.md` | Décisions produit encore ouvertes |
| `01_mission.md` | Mission du rapport de croissance |
| `02_dimensions_catalog.md` | 5 piliers + ~19 dimensions (vérité code) |
| `03_scoring_truth.md` | Seuils, sources de score |
| `04_report_tiers.md` | Free / Alliance / Souverain |
| `05_copy_tips_light.md` | Copy Découverte |
| `06_copy_summary_brief.md` | Copy Alliance (résumé + points) |
| `07_copy_report_detailed.md` | Copy Souverain (rapport long) |
| `08_guardrails.md` | Ton, limites, pas de jargon clinique inventé |
| `09_cta_upgrade.md` | Montée Free→Alliance→Souverain |
| `10_system_prompt.md` | Prompt si LLM résume (optionnel) |
| `subscription_matrix.md` | Droits d’accès rapport |

## Code existant (ne pas réinventer)

| Élément | Chemin |
|---------|--------|
| Scores piliers / dimensions | `psychometric_results` sur `profiles` |
| Banque questions | `src/lib/assessments/questionBank.ts` |
| Conseils déjà écrits | `src/lib/assessments/growth.ts` |
| Matching paire | `src/lib/matching/score.ts`, `dimensionMatch.ts` |
| Insights match UI | `EvaExplanationBlock` (compatibilité) |
| Axes UI actuelle | `GrowthAxesCard` sur `/assessments` (**pas encore gated**) |

## Moteur à créer (suite)

```
src/lib/matching/report/
  types.ts
  loadDocs.ts          # lit docs/matching/*.md (comme Eva)
  buildProfileReport.ts
```

Branche UI cible : `/assessments` ou `/premium` → « Mon rapport ».

## Faisabilité (août 2026)

| Question | Réponse |
|----------|---------|
| Matching assez poussé pour un résumé ? | **Oui** — 5 piliers, ~19 dimensions, conseils déjà en `growth.ts` |
| Infra à part pour l’IA ? | **Partielle** — Eva a son kit ; le matching paire est en TypeScript. Ce dossier = kit dédié aux **rapports** |
| LLM obligatoire ? | **Non pour V1** — templates + scores suffisent. LLM en option (Alliance+/Souverain) |
| Plan 10k en code ? | **Pas encore** — futur « Souverain » dans docs seulement |

## Suite recommandée

1. Valider `00_missing_info.md` avec toi  
2. Brancher `buildProfileReport` (sans LLM) Free + Alliance  
3. UI « Mon bilan » gated  
4. Plus tard : plan Souverain + rapport long + LLM
