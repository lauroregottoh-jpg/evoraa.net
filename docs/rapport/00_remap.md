# Remap officiel — tests code ↔ piliers rapport individuel

> **Source de vérité produit :** [`docs/DOSSIER RAPPORT.md`](../DOSSIER RAPPORT.md)  
> **Décision :** validée le 5 août 2026  
> **Portée :** rapport de soi uniquement (≠ matching de paires)

## Les cinq piliers (dossier)

1. Compatibilité relationnelle  
2. Compatibilité spirituelle  
3. Compatibilité des projets de vie  
4. Compatibilité des valeurs  
5. Compatibilité humaine  

## Remap dimensions → pilier dossier

Les slugs techniques (`personality`, `spiritual`, …) restent inchangés en base.  
L’affichage / le scoring du **rapport individuel** utilisent le pilier dossier via `slug + dimension`.

| Pilier dossier | `ReportPillarId` | Dimensions code | Slug(s) d’origine |
|---|---|---|---|
| Compatibilité relationnelle | `relationnel` | `conflict`, `communication` *(si `relationship`)*, `emotional`, `partnership` | `relationship` |
| Compatibilité spirituelle | `spirituel` | `faith_importance`, `practices`, `community` | `spiritual` |
| Compatibilité des projets de vie | `projets_de_vie` | `vision`, `roles`, `family`, `planning`, `management` | `couple_life`, `finances` |
| Compatibilité des valeurs | `valeurs` | `marriage_vision`, `intimacy`, `stewardship` | `spiritual`, `couple_life`, `finances` |
| Compatibilité humaine | `humain` | `emotional_stability`, `openness`, `responsibility`, `communication` *(si `personality`)* | `personality` |

### Cas spéciaux

- **`communication`** : `relationship` → relationnel ; `personality` → humain  
- **`spiritual`** est scindé : pratiques/foi → spirituel ; `marriage_vision` → valeurs  
- **`finances`** est scindé : budget/plan → projets ; `stewardship` → valeurs  
- **`intimacy` (pureté)** → valeurs (pas projets)

## Offres rapport (dossier)

| Offre dossier | Prix | Tier code actuel |
|---|---|---|
| Rapport Essentiel | 5 000 FCFA | `alliance` |
| Rapport Premium | 10 000 FCFA | `sovereign` (préparé, pas vendu) |

Découverte gratuite = aperçu (2–3 axes), hors dossier mais utile UX.

## Échelle scores (dossier §2)

| Score | Niveau |
|---|---|
| 0–39 | Axe prioritaire de développement |
| 40–59 | Compétence en développement |
| 60–79 | Bon équilibre |
| 80–100 | Force majeure |

## Règles produit

- Ne pas inventer de recommandations hors bibliothèque officielle du dossier (`RELxxx`, etc.).  
- Templates locaux pour V1 (pas d’appel LLM obligatoire).  
- Matching pair = autre moteur ; ne pas mélanger les copy.  
- Code de référence : `src/lib/rapport/pillars.ts`
