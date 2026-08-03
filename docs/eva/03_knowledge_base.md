# 03 — Base de connaissances KELIAA

> Synthèse **uniquement** de ce que le projet expose. Détails manquants → `00_missing_info.md`.

## 1. Produit

**KELIAA** — plateforme de rencontres chrétiennes fondée sur le discernement (pas le swipe).  
Site : `https://keliaa.org` · Contact : `contact@keliaa.org`

## 2. Parcours membre typique

1. Inscription (`/register`) + confirmation email
2. Onboarding (`/onboarding`) : âge, genre, ville, pratique, église/pasteur, vision mariage, projet famille, communication → statut `step3_tests`
3. Questionnaires (`/assessments`) — 5 axes
4. Découvrir / matching · Messages · Académie · Inspiration · Aide (EVA) · Alliance (billing)

## 3. Matching & compatibilité

- Score sur **5 piliers** : personnalité, spirituel, relation, vie de couple, finances
- Suggestions quotidiennes plafonnées selon le plan
- Pages : `/compatibility`, détail avec explication des piliers
- Eva explique **pourquoi** une compatibilité a du sens (valeurs, vision, style) — sans inventer un score absent du contexte

## 4. Tests / questionnaires

| Slug | Nom (UI) |
|------|----------|
| `personality` | Personnalité & stress |
| `spiritual` | Foi & valeurs |
| `relationship` | Conflits & dialogue |
| `couple_life` | Vision du couple |
| `finances` | Finances & projet |

Retake : cooldown configuré (`ASSESSMENT_RETAKE_COOLDOWN_DAYS`).  
Complétion profil : liée à onboarding + questionnaires (logique `profile/completion`).

## 5. Académie du mariage

Route : `/academie-mariage`  
8 modules · **1 leçon longue** chacun (contenu éditorial MD) :

| id | Thème |
|----|--------|
| foi | Vie spirituelle / prière réaliste |
| dialogue | Communication avant mariage |
| conflits | Gérer les désaccords |
| purete | Respect, limites, intimité |
| familles | Foyer & familles d’origine |
| finances | Parler d’argent |
| emotions | Maturité émotionnelle |
| projet | Projet de vie à deux |

Chaque leçon : intro · objectifs · sections · À retenir · exercice · check-list.

## 6. Inspiration / bibliothèque éditoriale

Route : `/inspiration`  
Formats (pensée, conseil, défi, verset, etc.) — règles dans `KELIAA_AI_CONTENT_RULES` / `docs/REGLES_EDITORIALES.md`  
Cadence membre : **1 contenu / jour** (décision produit récente)

## 7. Messagerie

`/messages` · icebreakers EvaMediator  
Quotas plan : nouvelles conversations / mois + messages / conversation

## 8. Coaching humain

Hors plan logiciel :

- 1 séance 45–60 min : **15 000 FCFA**
- Pack 3 séances : **40 000 FCFA**
- Prise de contact : `contact@keliaa.org` (pas de booking app natif V1)

## 9. Offres abonnement (code live)

Voir aussi `subscription_matrix.md`.

| Plan | Prix | Public |
|------|------|--------|
| Découverte (`free`) | 0 | oui |
| Essentiel (`premium`) | 2 500 | **non** (legacy) |
| Alliance (`premium_plus`) | **5 000** / mois (ancrage 7 500) | oui |

Affichés aussi (à clarifier M13/M14) : packs 3/6 mois, boosts.

Futur documenté en stratégie : **Souverain ~10 000** — **non vendu** aujourd’hui.

## 10. Paiements

CinetPay / Bictorys (notify) · Stripe noté non V1 · Mobile Money / carte mentionnés Free features

## 11. Sécurité & charte

Piliers : Foi & projet de mariage · Respect & pudeur · Sécurité · Bienveillance  
Modération : mots bannis, sanctions, règles photo (tenue respectueuse, visage clair)

## 12. Surfaces Eva actuelles

| Surface | Nature |
|---------|--------|
| `/help` | FAQ spirituelle locale + quota |
| Companion | Bannières / tips UI |
| Médiateur messages | Icebreakers fixes |
| Réflexion hebdo | Texte fixe dashboard |
| Admin EvaConfig | Prompt stub + sujets interdits |

## 13. Histoire & positionnement (copy officiel)

- Née d’une fatigue des apps d’image/vitesse
- Cadre avant dialogue
- « Discernement avant attraction »
- Anti-swipe ; compatibilité + questionnaires

**Fondateur :** non nommé en public — joignable via contact email.
