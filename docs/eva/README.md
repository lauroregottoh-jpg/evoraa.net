# Architecture EVA — KELIAA

> **Statut :** cerveau documentaire V2 (à brancher sur un LLM plus tard)  
> **Source de vérité produit :** code + pages + `src/lib/billing/plans.ts`  
> **Règle d’or :** si une info n’est pas dans le projet → voir `00_missing_info.md` (ne pas inventer)

## Pourquoi ce dossier

Aujourd’hui, EVA en production est une **FAQ locale** (`EvaSpiritualAdvisor`) + quotas + stub admin.  
Ce dossier construit le **manuel d’entreprise** qu’une EVA LLM lira avant chaque conversation.

## Cartographie des fichiers

| Fichier | Rôle |
|---------|------|
| `00_missing_info.md` | Infos absentes du projet + questions à trancher |
| `01_identity.md` | Qui est Eva |
| `02_mission.md` | Mission / vision KELIAA & objectifs d’Eva |
| `03_knowledge_base.md` | Savoir produit (features, parcours, tarifs) |
| `04_user_profiles.md` | Profils & adaptation du discours |
| `05_conversation_rules.md` | Ton, style, structure des réponses |
| `06_faq.md` | FAQ produit ancrée code |
| `07_scenarios.md` | ~100 scénarios + template d’extension |
| `08_sales_guidance.md` | Orientation naturelle vers offre / features |
| `09_guardrails.md` | Limites, sécurité, escalade |
| `10_system_prompt.md` | Prompt système assemblé (production) |
| `11_decision_engine.md` | Intentions, mémoire, outils, ordres de décision |
| `subscription_matrix.md` | Matrice d’accès Free / Alliance / futur Souverain |

## État technique actuel (code)

| Élément | État |
|---------|------|
| Chat LLM | **Non** (V1 soft launch, coût API = 0) |
| Quota EVA | Free 3/j · Legacy 10/j · Alliance 20/j |
| Prompt admin stub | `opsRules.ts` → `DEFAULT_EVA_CONFIG` |
| Surfaces | `/help`, companion cards, médiateur messages, réflexion hebdo |
| Clé OpenAI | Flag admin seulement (« option V2 ») |

## Glossaire de nommage

| Terme | Usage |
|-------|--------|
| **KELIAA** | Marque officielle (UI, emails, metadata) |
| **Keliaa** | Forme phrase courante acceptable (« Sur Keliaa… ») |
| **Evoraa / kellia** | Legacies techniques (dossiers, npm) — **jamais** en face utilisateur |
| Domaine | `keliaa.org` · `contact@keliaa.org` |

## Prochaine étape produit (hors ce dossier)

1. Valider / remplir `00_missing_info.md`
2. Enrichir `07_scenarios.md` jusqu’à 200–500
3. Brancher un endpoint chat qui charge `10_system_prompt.md` + `subscription_matrix.md` + mémoire de session
4. Remplacer le fallback générique de `EvaSpiritualAdvisor` par le moteur V2

## Sources utilisées pour construire ces docs

- `src/lib/billing/plans.ts`
- `src/lib/admin/opsRules.ts`
- `src/components/spiritual/EvaSpiritualAdvisor.tsx`
- `src/lib/academy/modules.ts` · `docs/ACADEMIE DU MARIAGE.md`
- `src/lib/assessments/questionBank.ts`
- `src/lib/editorial/library.ts` · règles éditoriales
- Pages : `/`, `/about`, `/charte`, `/pricing`, `/how-it-works`, `/contact`
- `docs/PLAN_DASHBOARDS_ET_PRICING.md`
