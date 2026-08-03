# 11 — Moteur de décision (V2)

## Pipeline recommandé

```
Message utilisateur
    → 1. Safety screen (crise / interdit)
    → 2. Intent detection
    → 3. Lecture mémoire session + plan (matrice)
    → 4. Sélection connaissance (KB / FAQ / scénario proche)
    → 5. Rédaction (règles + identité)
    → 6. CTA unique + tool suggestion
    → 7. Update mémoire
```

## Intentions (taxonomie)

| Intent | Exemples | Action prioritaire |
|--------|----------|--------------------|
| `discover` | « Je découvre Keliaa » | Expliquer 3 piliers + CTA register |
| `howto_signup` | « Comment m’inscrire » | Steps + `/register` |
| `pricing` | « C’est payant ? » | Matrice concise |
| `matching` | « Comment ça match » | 5 piliers + assessments |
| `assessment` | « Style d’attachement / test » | Bon questionnaire |
| `academy` | « Préparer mon mariage » | Module adapté |
| `emotional_pain` | « Je souffre » | Écoute → garde-fou → petit pas |
| `ex_recovery` | « Retrouver mon ex » | Limites éthiques + reconstruction |
| `already_coupled` | « Je suis en couple » | Académie / coaching ≠ matching forcé |
| `quota_block` | « J’ai plus de messages » | Expliquer + Alliance |
| `coaching` | « Parler à quelqu’un » | Tarifs coaching + email |
| `faith_question` | Prière, pureté, église | Conseil prudent + académie |
| `out_of_scope` | Politique, crypto… | Refus poli |
| `crisis` | Danger | Escalade |

## Ordre des questions de clarification

Max **1** question par tour, dans cet ordre de priorité si manquant :

1. Sécurité / âge adulte (si doute)
2. Situation relationnelle (célibataire / couple / etc.)
3. Objectif du moment (comprendre / matcher / préparer mariage)
4. Plan actuel (si la plainte est un plafond)

## Outils (à brancher V2)

| Tool | Quand |
|------|-------|
| `get_plan_limits` | Question quota / pricing |
| `recommend_assessment` | Besoin de profilage |
| `recommend_academy_module` | Préparation thématique |
| `recommend_inspiration` | Besoin doux du jour |
| `create_upgrade_link` | Quota atteint + besoin clair |
| `handoff_human` | Crise / coaching / billing complexe |

Aujourd’hui : ces tools n’existent pas encore — les docs permettent de les spécifier.

## Mémoire de session (schéma minimal)

```json
{
  "relationship_status": null,
  "goal": null,
  "plan_id": "free",
  "faith_stance": null,
  "pain_points": [],
  "tools_suggested": [],
  "open_questions": []
}
```

## Stratégie de découverte des besoins

- Tour 1 : accueillir + 1 question  
- Tour 2 : insight + outil  
- Tour 3+ : approfondir ou convertir  

Ne jamais « interviewer » 5 questions d’affilée.
