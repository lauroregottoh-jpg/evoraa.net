# Architecture EVA — KELIAA

> **Statut :** V2 **branché** sur le chat membre (`askEvaAction` + `src/lib/eva/engine.ts`)  
> **Source de vérité produit :** code + pages + `src/lib/billing/plans.ts`  
> **Règle d’or :** si une info n’est pas dans le projet → voir `00_missing_info.md` (ne pas inventer)

## Pourquoi ce dossier

Le chat membre (`EvaSpiritualAdvisor`) appelle le moteur qui charge `10_system_prompt.md` + FAQ/matrice/garde-fous, enrichi par `eva_config` admin.  
Sans `OPENAI_API_KEY` → réponses locales (intention + base docs). Avec clé → LLM (`OPENAI_EVA_MODEL` ou `gpt-4o-mini`) + même prompt.

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
| Moteur chat | **Oui** — `askEvaAction` + mémoire session (court historique client) |
| Chat LLM | Si `OPENAI_API_KEY` ; sinon moteur connaissance locale |
| Quota EVA | Free 3/j · Legacy 10/j · Alliance 20/j |
| Prompt admin | `platform_settings.eva_config` → fusionné dans le system prompt |
| Surfaces | `/help`, `/spiritual-resources`, `/contact` |
| Docs runtime | `docs/eva/*.md` lus côté serveur (déployer avec le repo) |

## Glossaire de nommage

| Terme | Usage |
|-------|--------|
| **KELIAA** | Marque officielle (UI, emails, metadata) |
| **Keliaa** | Forme phrase courante acceptable (« Sur Keliaa… ») |
| **Evoraa / kellia** | Legacies techniques (dossiers, npm) — **jamais** en face utilisateur |
| Domaine | `keliaa.org` · `contact@keliaa.org` |

## Suite produit

1. Valider / remplir `00_missing_info.md`
2. Enrichir `07_scenarios.md` jusqu’à 200–500
3. Poser `OPENAI_API_KEY` (+ optionnel `OPENAI_EVA_MODEL`) en prod pour le mode LLM
4. Mémoire longue optionnelle (profil / DB) au-delà de la session

## Sources utilisées pour construire ces docs

- `src/lib/billing/plans.ts`
- `src/lib/admin/opsRules.ts`
- `src/components/spiritual/EvaSpiritualAdvisor.tsx`
- `src/lib/academy/modules.ts` · `docs/ACADEMIE DU MARIAGE.md`
- `src/lib/assessments/questionBank.ts`
- `src/lib/editorial/library.ts` · règles éditoriales
- Pages : `/`, `/about`, `/charte`, `/pricing`, `/how-it-works`, `/contact`
- `docs/PLAN_DASHBOARDS_ET_PRICING.md`
