# BILAN COUPLE — CAHIER DES CHARGES

**Version : 1.0**  
**Statut : Document maître — conception produit**  
**Format : Markdown (.md)**

---

## 1. Objet du document

Ce document définit le cadre stratégique, fonctionnel, méthodologique et éthique du **Bilan Couple**.

Il constitue le document de référence à respecter pour la conception :

- du questionnaire ;
- du système de scoring ;
- du moteur de matching ;
- du moteur d’interprétation ;
- des rapports individuels ;
- du rapport de couple ;
- des offres commerciales ;
- de la plateforme ;
- des recommandations et ressources.

Toute décision ultérieure doit rester cohérente avec les principes définis ici.

---

# 2. Vision du produit

Le Bilan Couple est un outil numérique permettant à deux personnes engagées dans une relation de couple, une relation sérieuse ou un projet de mariage de mieux comprendre leur dynamique relationnelle.

Chaque partenaire répond **indépendamment** à un questionnaire approfondi.

Le système croise ensuite les résultats afin d'identifier :

- les convergences ;
- les différences ;
- les écarts de perception ;
- les forces ;
- les zones de vigilance ;
- les sujets nécessitant une clarification ;
- les domaines à travailler individuellement ;
- les domaines à travailler ensemble.

Le produit ne cherche pas à décider si deux personnes doivent rester ensemble ou se séparer.

> **Le bilan ne prédit pas l'avenir d'un couple. Il aide le couple à mieux comprendre ce qu'il construit, ce qui le rapproche et ce qui mérite d'être travaillé.**

---

# 3. Positionnement

Le produit ne doit pas être présenté comme un simple quiz de compatibilité.

Le terme **compatibilité** peut être utilisé commercialement, mais son interprétation doit toujours être encadrée.

Le positionnement recommandé est :

> **Un bilan relationnel approfondi pour comprendre vos convergences, vos différences et les domaines à construire ensemble.**

Le client n'achète donc pas uniquement un score.

Il achète :

1. une analyse individuelle ;
2. une analyse de la dynamique du couple ;
3. une lecture des convergences et divergences ;
4. des pistes de réflexion ;
5. des recommandations ;
6. une feuille de route adaptée au niveau d'offre choisi.

---

# 4. Public cible

Le produit s'adresse principalement à :

### 4.1 Couples

Deux personnes déjà engagées dans une relation et souhaitant mieux comprendre leur fonctionnement.

### 4.2 Couples fiancés

Deux personnes ayant un projet de mariage et souhaitant identifier les sujets importants à clarifier avant le mariage.

### 4.3 Couples en préparation au mariage

Le bilan peut être utilisé comme outil complémentaire dans une démarche de préparation au mariage.

### 4.4 Couples souhaitant faire un point relationnel

Le produit peut également servir à des couples déjà établis qui souhaitent faire le point sur leur fonctionnement.

---

# 5. Ce que le bilan mesure

Le bilan doit explorer plusieurs dimensions de la vie relationnelle.

Les dimensions définitives seront précisées dans le document d'architecture du test, mais le périmètre initial comprend notamment :

- vision du couple ;
- valeurs ;
- vision du mariage ;
- communication ;
- expression des besoins ;
- gestion des conflits ;
- gestion émotionnelle dans la relation ;
- finances ;
- famille ;
- belle-famille ;
- rôles conjugaux ;
- prise de décision ;
- projet de vie ;
- carrière ;
- enfants et parentalité ;
- affection ;
- intimité ;
- autonomie ;
- dépendance/interdépendance ;
- spiritualité et convictions lorsque pertinentes ;
- attentes envers le partenaire ;
- limites personnelles ;
- responsabilités ;
- quotidien du couple.

La liste finale sera définie méthodiquement avant la construction définitive des questions.

---

# 6. Ce que le bilan ne mesure pas

Le bilan ne doit pas prétendre :

- prédire la durée d'une relation ;
- prédire la réussite d'un mariage ;
- déterminer scientifiquement qu'un couple doit rester ensemble ;
- déterminer qu'un couple doit se séparer ;
- diagnostiquer un trouble psychologique ;
- diagnostiquer une maladie mentale ;
- remplacer une thérapie ;
- remplacer une évaluation clinique ;
- garantir la réussite d'un mariage ;
- déterminer qu'une personne est « bonne » ou « mauvaise » pour son partenaire.

Le système doit éviter toute formulation déterministe.

---

# 7. Principe fondamental : le score n'est pas un verdict

Un score faible ne doit jamais être interprété comme :

> « Vous êtes incompatibles. »

Un score élevé ne doit jamais être interprété comme :

> « Votre couple est garanti de réussir. »

Le score doit être présenté comme un **indicateur de convergence sur les dimensions mesurées**.

Exemple :

### Mauvaise formulation

> Compatibilité : 15 %. Votre couple est très incompatible.

### Formulation attendue

> Votre bilan révèle actuellement plusieurs divergences importantes dans les domaines évalués. Ces différences ne permettent pas de conclure que votre relation ne peut pas fonctionner. Elles indiquent toutefois plusieurs sujets qui méritent d'être clarifiés et travaillés ensemble avant de franchir une nouvelle étape.

Le rapport doit toujours expliquer **ce que le résultat peut signifier et ce qu'il ne signifie pas**.

---

# 8. Le rôle du score global

Un indicateur global pourra être utilisé, mais il ne doit pas être l'élément central du rapport.

Le système doit privilégier une lecture par dimensions :

- forte convergence ;
- convergence ;
- convergence modérée ;
- zone de vigilance ;
- divergence ;
- divergence importante.

Le score global doit être accompagné d'une interprétation qualitative.

Le système doit également identifier les cas où un score global masque des divergences importantes dans un domaine particulier.

---

# 9. Les deux partenaires répondent indépendamment

C'est une règle fondamentale.

Chaque partenaire doit :

- créer son propre compte ;
- fournir ses propres informations ;
- répondre seul au questionnaire ;
- ne pas avoir accès aux réponses de l'autre pendant la passation ;
- pouvoir répondre à son propre rythme.

Les réponses individuelles ne doivent pas être modifiées par la connaissance des réponses du partenaire.

---

# 10. Création et identification du couple

Le système doit créer une entité distincte appelée **Couple**.

Un couple possède un identifiant unique :

**COUPLE_ID**

Exemple :

`KEL-7F4X92`

Le Couple_ID ne doit pas être confondu avec un compte utilisateur.

Structure conceptuelle :

```text
COUPLE
├── PARTENAIRE A
└── PARTENAIRE B
```

Un Couple_ID ne peut être associé qu'à **deux partenaires maximum**.

---

# 11. Invitation du partenaire

La personne qui crée ou rejoint le bilan doit pouvoir inviter son partenaire de deux manières :

### Option 1 — Lien d'invitation

Le système génère un lien unique associé au Couple_ID.

Le partenaire clique sur le lien et rejoint directement l'espace du couple.

### Option 2 — Code Couple

Le système affiche un code unique.

Le partenaire peut sélectionner :

> « Rejoindre un couple »

puis saisir le code.

Les deux méthodes doivent conduire au même résultat.

---

# 12. Le paiement appartient au couple

Il ne doit pas être nécessaire que Monsieur achète en premier.

**Peu importe lequel des deux partenaires effectue le paiement.**

Le paiement est associé au **Couple_ID**, et non à un genre, à un rôle ou à un partenaire spécifique.

Exemple :

```text
COUPLE_ID : KEL-7F4X92

Partenaire A : compte 001
Partenaire B : compte 002

Acheteur : Partenaire B

Offre achetée : Premium

Statut : PAYÉ
```

Les droits d'accès au rapport sont alors associés au couple.

---

# 13. Règle des deux personnes

Un Couple_ID ne peut accueillir que deux personnes.

Si deux personnes sont déjà associées au Couple_ID :

> Ce code a déjà été utilisé par les deux partenaires. Il n'est plus disponible pour rejoindre ce couple.

Une troisième personne ne peut pas être ajoutée au même bilan.

---

# 14. États principaux du couple

Le système devra pouvoir distinguer plusieurs états :

```text
CREATED
WAITING_FOR_PARTNER
PARTNER_JOINED
QUESTIONNAIRE_A_IN_PROGRESS
QUESTIONNAIRE_B_IN_PROGRESS
BOTH_QUESTIONNAIRES_COMPLETED
PAYMENT_PENDING
PAYMENT_COMPLETED
ANALYSIS_READY
ANALYSIS_IN_PROGRESS
REPORT_READY
```

Les états exacts seront affinés dans la spécification technique.

---

# 15. Structure générale de l'expérience

Le parcours cible est :

```text
Découverte du produit
        ↓
Présentation du Bilan Couple
        ↓
Création ou rejointement d'un couple
        ↓
Création du compte individuel
        ↓
Génération du Couple_ID
        ↓
Invitation du partenaire
        ↓
Réponse indépendante de chaque partenaire
        ↓
Vérification de complétude
        ↓
Paiement
        ↓
Matching des résultats
        ↓
Calcul des scores
        ↓
Analyse des convergences et divergences
        ↓
Génération du rapport
        ↓
Accès au rapport
        ↓
Recommandations et ressources
```

---

# 16. Architecture des résultats

Le système doit produire plusieurs niveaux d'information.

## Niveau 1 — Profil individuel

Pour chaque partenaire :

- fonctionnement relationnel ;
- forces ;
- besoins ;
- points de vigilance ;
- tendances principales ;
- domaines de progression.

## Niveau 2 — Analyse croisée

Pour le couple :

- convergences ;
- divergences ;
- écarts de perception ;
- zones sensibles ;
- complémentarités ;
- sujets à clarifier.

## Niveau 3 — Recommandations

Le système doit distinguer :

### À travailler individuellement

Ce que chaque partenaire peut travailler de son côté.

### À travailler ensemble

Ce que le couple doit construire ou clarifier ensemble.

### À discuter

Les sujets qui nécessitent une conversation explicite.

### À approfondir

Les domaines pour lesquels un accompagnement peut être pertinent.

---

# 17. Philosophie des recommandations

Les recommandations doivent être :

- concrètes ;
- non culpabilisantes ;
- nuancées ;
- compréhensibles ;
- orientées vers l'action ;
- proportionnées aux résultats.

Le rapport doit éviter :

- les jugements ;
- les étiquettes définitives ;
- les prédictions ;
- les diagnostics ;
- les formulations alarmistes inutiles.

---

# 18. Les écarts de perception sont un résultat majeur

Le système doit comparer non seulement les scores, mais aussi les perceptions.

Exemple :

Monsieur estime que la communication du couple est excellente.

Madame estime qu'elle est faible.

Le système doit identifier :

> **Écart de perception important**

et expliquer que le couple peut avoir des expériences différentes de la même relation.

Cette fonctionnalité constitue un élément différenciant majeur du produit.

---

# 19. Rapport individuel et rapport de couple

Le produit doit distinguer :

### Rapport de Monsieur

Son fonctionnement et ses résultats personnels.

### Rapport de Madame

Son fonctionnement et ses résultats personnels.

### Rapport du couple

La lecture croisée des deux profils.

Le rapport de couple ne doit pas simplement reproduire les deux rapports individuels.

Il doit apporter une **analyse nouvelle créée par la comparaison**.

---

# 20. Confidentialité

Le système doit distinguer :

### Données individuelles

Les réponses et informations personnelles de chaque partenaire.

### Données partagées du couple

Les informations et résultats nécessaires à la production du bilan commun.

Le rapport de couple ne doit pas exposer inutilement les réponses brutes ou les informations sensibles de l'autre partenaire.

Le fonctionnement exact de la confidentialité devra être détaillé dans la spécification technique et les conditions d'utilisation.

---

# 21. Positionnement des ressources professionnelles

Le bilan peut orienter vers :

- ressources pédagogiques ;
- coaching ;
- préparation au mariage ;
- accompagnement relationnel ;
- accompagnement conjugal ;
- professionnels qualifiés.

Cependant, une orientation vers un professionnel ne doit pas être formulée automatiquement comme une preuve que le couple « a un problème ».

Formulation recommandée :

> Certains résultats peuvent indiquer qu'un accompagnement professionnel pourrait vous aider à approfondir certains sujets. Si vous souhaitez aller plus loin, des ressources ou professionnels qualifiés peuvent vous être proposés.

---

# 22. Offres commerciales initiales

Deux offres sont retenues pour la conception.

## Offre 1 — Bilan Couple Premium

**Valeur individuelle de référence : 20 000 FCFA par personne**

**Valeur pour deux personnes : 40 000 FCFA**

**Tarif couple : 30 000 FCFA**

**Économie couple : 10 000 FCFA**

Cette offre doit déjà être considérée comme une **offre premium complète**.

Elle doit fournir un rapport approfondi comprenant notamment :

- analyses individuelles ;
- analyse croisée ;
- convergences ;
- divergences ;
- écarts de perception ;
- forces ;
- points de vigilance ;
- points à travailler individuellement ;
- points à travailler ensemble ;
- recommandations ;
- synthèse.

---

## Offre 2 — Bilan Couple Premium+

**Valeur individuelle de référence : 30 000 FCFA par personne**

**Valeur pour deux personnes : 60 000 FCFA**

**Tarif couple : 50 000 FCFA**

**Économie couple : 10 000 FCFA**

Cette offre reprend le bilan Premium et ajoute une couche d'accompagnement documentaire plus approfondie :

- analyse plus détaillée ;
- conversations personnalisées ;
- exercices ;
- feuille de route ;
- plan de progression ;
- ressources personnalisées ;
- recommandations approfondies.

Les différences définitives entre les deux offres seront détaillées dans le document commercial dédié.

---

# 23. Philosophie du rapport

Le rapport doit être suffisamment détaillé pour que le client puisse comprendre :

1. ce qui fonctionne ;
2. ce qui différencie les partenaires ;
3. pourquoi certaines différences peuvent être importantes ;
4. ce qui mérite d'être clarifié ;
5. ce que chacun peut travailler ;
6. ce que le couple peut travailler ensemble ;
7. quelles ressources peuvent l'aider.

Le rapport ne doit jamais donner l'impression d'un résultat automatique de quiz.

Il doit ressembler à une **analyse relationnelle personnalisée**.

---

# 24. Niveau de qualité attendu

Le produit doit être conçu comme un produit premium.

La qualité doit être cohérente à quatre niveaux :

### Qualité méthodologique

Les questions doivent mesurer des dimensions clairement définies.

### Qualité analytique

Les scores doivent être interprétés avec nuance.

### Qualité rédactionnelle

Les rapports doivent être humains, précis et personnalisés.

### Qualité produit

L'expérience utilisateur doit être fluide, claire et rassurante.

---

# 25. Architecture documentaire du projet

Le projet sera construit à partir d'un nombre volontairement limité de documents Markdown.

```text
01_CAHIER_DES_CHARGES.md
02_ARCHITECTURE_TEST_SCORING_MATCHING.md
03_BANQUE_QUESTIONS.md
04_BIBLIOTHEQUE_INTERPRETATIONS.md
05_MODELES_RAPPORTS.md
06_OFFRES_TARIFICATION_ET_RESSOURCES.md
07_SPECIFICATION_PLATEFORME.md
```

Aucun document supplémentaire ne doit être créé sans nécessité réelle.

L'objectif est de conserver une architecture documentaire simple, maintenable et exploitable.

---

# 26. Ordre de construction

Le projet doit être construit dans cet ordre :

### Phase 1 — Produit

`01_CAHIER_DES_CHARGES.md`

### Phase 2 — Méthodologie

`02_ARCHITECTURE_TEST_SCORING_MATCHING.md`

### Phase 3 — Questions

`03_BANQUE_QUESTIONS.md`

### Phase 4 — Interprétation

`04_BIBLIOTHEQUE_INTERPRETATIONS.md`

### Phase 5 — Rapports

`05_MODELES_RAPPORTS.md`

### Phase 6 — Commercialisation

`06_OFFRES_TARIFICATION_ET_RESSOURCES.md`

### Phase 7 — Développement

`07_SPECIFICATION_PLATEFORME.md`

---

# 27. Règle de gouvernance du projet

Un document considéré comme **validé** devient une référence pour les documents suivants.

Toute modification importante d'un principe déjà validé doit être répercutée dans les documents concernés afin d'éviter les contradictions.

Le projet ne doit pas avancer vers le développement tant que les éléments essentiels suivants ne sont pas suffisamment définis :

- dimensions du test ;
- banque de questions ;
- logique de scoring ;
- logique de matching ;
- logique d'interprétation ;
- structure des rapports ;
- offres ;
- parcours utilisateur ;
- règles du Couple_ID ;
- règles de confidentialité.

---

# 28. Principe directeur final

Le Bilan Couple doit être conçu autour d'une idée centrale :

> **Mesurer pour comprendre, comprendre pour dialoguer, dialoguer pour construire.**

Le produit ne doit pas chercher à dire aux couples s'ils sont « faits l'un pour l'autre ».

Il doit leur donner une lecture structurée et utile de leur relation afin qu'ils puissent prendre conscience de leurs forces, reconnaître leurs différences et identifier les sujets qu'ils doivent construire ensemble.

**Fin du document.**
