# BILAN COUPLE — ARCHITECTURE DU TEST, DU SCORING ET DU MATCHING

**Version : 1.0**  
**Statut : Document maître — méthodologie et moteur d'analyse**  
**Dépendance : `01_CAHIER_DES_CHARGES.md`**  
**Format : Markdown (.md)**

---

# 1. OBJET DU DOCUMENT

Ce document définit l'architecture méthodologique du Bilan Couple.

Il précise :

- les dimensions à mesurer ;
- les sous-dimensions ;
- la structure générale du questionnaire ;
- les principes de scoring individuel ;
- les principes de comparaison entre partenaires ;
- le calcul des convergences ;
- le calcul des divergences ;
- l'identification des écarts de perception ;
- les niveaux de vigilance ;
- la logique de priorisation ;
- les règles d'interprétation ;
- les règles de sécurité du score ;
- les données nécessaires au moteur de génération des rapports.

Ce document constitue le **cerveau analytique** du produit.

Il ne contient pas encore la totalité des questions. Celles-ci seront développées dans :

`03_BANQUE_QUESTIONS.md`

---

# 2. PRINCIPE MÉTHODOLOGIQUE CENTRAL

Le Bilan Couple ne doit pas être conçu comme un simple test qui additionne des réponses pour produire un pourcentage.

Il doit fonctionner selon une architecture à plusieurs niveaux :

```text
RÉPONSES INDIVIDUELLES
        ↓
SCORES PAR SOUS-DIMENSION
        ↓
SCORES PAR DIMENSION
        ↓
PROFILS INDIVIDUELS
        ↓
COMPARAISON PARTENAIRE A / PARTENAIRE B
        ↓
CONVERGENCES
DIVERGENCES
ÉCARTS DE PERCEPTION
        ↓
ZONES DE VIGILANCE
        ↓
PRIORISATION
        ↓
INTERPRÉTATIONS
        ↓
RECOMMANDATIONS
        ↓
RAPPORT PERSONNALISÉ
```

Le système doit donc distinguer :

1. **ce que chaque personne présente individuellement** ;
2. **ce qui rapproche les deux personnes** ;
3. **ce qui les différencie** ;
4. **ce qu'elles perçoivent différemment** ;
5. **ce qui mérite réellement une attention prioritaire**.

---

# 3. PRINCIPLE IMPORTANT : COMPATIBILITÉ ≠ CONVERGENCE TOTALE

Deux personnes n'ont pas besoin d'être identiques pour former un couple fonctionnel.

Le système doit donc éviter de considérer toute différence comme négative.

Une différence peut être :

- neutre ;
- complémentaire ;
- à discuter ;
- potentiellement sensible ;
- réellement préoccupante selon le contexte.

La comparaison doit donc tenir compte de la nature de la dimension.

Exemple :

Deux personnes peuvent avoir des personnalités différentes mais être fortement alignées sur leurs valeurs et leur projet de vie.

Le moteur doit être capable de reconnaître cette situation.

---

# 4. ARCHITECTURE GÉNÉRALE DES DIMENSIONS

Le test sera organisé autour de grandes dimensions.

La liste ci-dessous constitue l'architecture de travail initiale. Elle sera validée et éventuellement ajustée avant la finalisation de la banque de questions.

## DIMENSION 01 — Vision du couple

Mesure notamment :

- conception du couple ;
- attentes générales ;
- rôle de la relation ;
- niveau d'engagement ;
- conception de la vie à deux.

## DIMENSION 02 — Valeurs fondamentales

Mesure notamment :

- valeurs prioritaires ;
- principes de vie ;
- honnêteté ;
- loyauté ;
- respect ;
- responsabilité ;
- liberté ;
- sécurité ;
- famille ;
- réussite ;
- autres valeurs structurantes.

## DIMENSION 03 — Vision du mariage

Mesure notamment :

- conception du mariage ;
- attentes envers le mariage ;
- engagement ;
- responsabilités ;
- permanence de l'engagement ;
- attentes réalistes ou idéalisées.

## DIMENSION 04 — Communication

Mesure notamment :

- expression des besoins ;
- écoute ;
- capacité à parler des sujets difficiles ;
- clarté ;
- communication émotionnelle ;
- communication sous stress.

## DIMENSION 05 — Gestion des conflits

Mesure notamment :

- réaction au désaccord ;
- évitement ;
- confrontation ;
- recherche de solution ;
- réparation après conflit ;
- capacité à reprendre le dialogue ;
- respect pendant les désaccords.

## DIMENSION 06 — Fonctionnement émotionnel dans la relation

Mesure notamment :

- identification des émotions ;
- expression émotionnelle ;
- régulation ;
- besoin de réassurance ;
- réaction au rejet ;
- réaction à la distance ;
- tolérance à la frustration.

Cette dimension ne constitue pas un diagnostic psychologique.

## DIMENSION 07 — Affection et proximité

Mesure notamment :

- expression de l'affection ;
- besoin de proximité ;
- gestes affectifs ;
- qualité de présence ;
- attentes affectives.

## DIMENSION 08 — Intimité

Mesure notamment :

- attentes ;
- communication autour de l'intimité ;
- limites ;
- confort pour aborder le sujet ;
- conception de la place de l'intimité dans la relation.

Les résultats doivent être traités avec tact et confidentialité.

## DIMENSION 09 — Finances

Mesure notamment :

- rapport à l'argent ;
- dépenses ;
- épargne ;
- sécurité financière ;
- transparence ;
- gestion commune ;
- autonomie financière ;
- priorités.

## DIMENSION 10 — Famille et belle-famille

Mesure notamment :

- proximité avec les familles ;
- limites ;
- responsabilités ;
- influence familiale ;
- accueil de la belle-famille ;
- arbitrage entre couple et famille d'origine.

## DIMENSION 11 — Rôles conjugaux

Mesure notamment :

- responsabilités ;
- répartition des tâches ;
- conception des rôles ;
- travail domestique ;
- soutien mutuel ;
- attentes liées au rôle du conjoint.

## DIMENSION 12 — Prise de décision et pouvoir

Mesure notamment :

- décision individuelle ;
- décision commune ;
- leadership ;
- compromis ;
- négociation ;
- gestion des désaccords décisionnels.

## DIMENSION 13 — Projet de vie

Mesure notamment :

- lieu de vie ;
- mode de vie ;
- ambitions ;
- stabilité ;
- mobilité ;
- projets personnels ;
- projets communs.

## DIMENSION 14 — Carrière et aspirations professionnelles

Mesure notamment :

- priorité donnée à la carrière ;
- mobilité ;
- disponibilité ;
- ambitions ;
- soutien à la carrière du partenaire ;
- arbitrage couple/carrière.

## DIMENSION 15 — Enfants et parentalité

Mesure notamment :

- désir d'enfant ;
- nombre d'enfants envisagé ;
- calendrier ;
- conception de l'éducation ;
- discipline ;
- responsabilités parentales ;
- priorités familiales.

## DIMENSION 16 — Autonomie et interdépendance

Mesure notamment :

- besoin d'espace personnel ;
- indépendance ;
- activités séparées ;
- temps individuel ;
- besoin de proximité ;
- capacité à fonctionner sans fusion.

## DIMENSION 17 — Spiritualité et convictions

Cette dimension est activée ou non selon le positionnement du produit et le contexte du répondant.

Elle peut mesurer :

- importance de la spiritualité ;
- place des convictions dans le couple ;
- pratiques ;
- transmission ;
- vision commune ;
- gestion des différences de conviction.

## DIMENSION 18 — Limites, confiance et sécurité relationnelle

Mesure notamment :

- respect des limites ;
- confiance ;
- transparence ;
- fidélité ;
- sécurité relationnelle ;
- respect mutuel.

Cette dimension doit être traitée avec une vigilance particulière.

---

# 5. SOUS-DIMENSIONS

Chaque grande dimension doit être divisée en sous-dimensions suffisamment précises.

Exemple :

```text
COMMUNICATION
├── Expression des besoins
├── Écoute
├── Communication émotionnelle
├── Sujets difficiles
└── Communication sous tension
```

Cette structure permet de ne pas produire un résultat trop général.

Exemple :

Un couple peut avoir :

- bonne écoute ;
- bonne communication quotidienne ;
- mais difficulté à parler d'argent.

Le rapport doit pouvoir identifier précisément cette situation.

---

# 6. TYPES DE QUESTIONS

Le questionnaire ne doit pas reposer sur un seul type de question.

Il doit combiner plusieurs formes.

## 6.1 Questions d'auto-évaluation

Exemple conceptuel :

> Je me sens capable d'exprimer clairement mes besoins à mon/ma partenaire.

Échelle :

1 à 5.

---

## 6.2 Questions comportementales

Elles demandent ce que la personne fait réellement.

Exemple :

> Lorsque nous sommes en désaccord, j'ai tendance à...

Ce type de question est important pour éviter un questionnaire composé uniquement d'affirmations valorisantes.

---

## 6.3 Questions de projection

Exemple :

> Si nous devions gérer ensemble une période financière difficile, je m'attendrais à...

Elles permettent d'explorer les attentes.

---

## 6.4 Questions de valeurs

Elles évaluent les priorités.

Exemple :

> Parmi plusieurs priorités, laquelle serait la plus importante pour vous dans cette situation ?

---

## 6.5 Questions de perception du couple

Exemple :

> Je pense que nous savons gérer nos désaccords de manière constructive.

La même dimension peut être posée aux deux partenaires afin de comparer leurs perceptions.

---

## 6.6 Questions sensibles

Certaines dimensions nécessitent des formulations plus prudentes.

Elles doivent être :

- clairement contextualisées ;
- non accusatoires ;
- facultatives lorsque nécessaire ;
- protégées par une politique de confidentialité adaptée.

---

# 7. ÉCHELLE DE RÉPONSE DE BASE

L'échelle standard recommandée est :

```text
1 = Pas du tout d'accord
2 = Plutôt pas d'accord
3 = Ni d'accord ni pas d'accord
4 = Plutôt d'accord
5 = Tout à fait d'accord
```

D'autres formats pourront être utilisés lorsque le type de question l'exige.

Les échelles devront rester cohérentes et être documentées question par question.

---

# 8. QUESTIONS INVERSÉES

Certaines affirmations seront formulées dans un sens inverse afin de limiter les réponses mécaniques.

Exemple conceptuel :

> Lorsque nous avons un problème, je préfère l'éviter plutôt que d'en parler.

Une réponse élevée doit ici correspondre à un indicateur différent d'une affirmation positive.

Le système doit enregistrer explicitement :

```text
SCORING_DIRECTION = DIRECT
```

ou :

```text
SCORING_DIRECTION = REVERSE
```

Aucune inversion ne doit être faite implicitement.

---

# 9. SCORE INDIVIDUEL

Chaque partenaire obtient des scores sur les différentes dimensions.

Exemple conceptuel :

```text
Communication        82/100
Conflits             61/100
Finances             74/100
Projet de vie        91/100
Famille              55/100
Autonomie            68/100
```

Le score individuel ne signifie pas :

> « Vous êtes une bonne ou mauvaise personne. »

Il décrit uniquement la tendance observée dans la dimension mesurée.

---

# 10. NORMALISATION

Les scores provenant de dimensions différentes doivent être ramenés à une échelle commune.

Échelle cible recommandée :

**0 à 100**

La méthode exacte de normalisation sera définie dans la phase de conception du scoring.

La normalisation doit permettre de comparer les dimensions sans donner artificiellement plus de poids à une dimension simplement parce qu'elle contient davantage de questions.

---

# 11. PONDÉRATION

Toutes les questions ne doivent pas nécessairement avoir le même poids.

Toute pondération doit cependant être :

- justifiée ;
- documentée ;
- stable ;
- testable ;
- compréhensible par l'équipe de conception.

La pondération ne doit jamais être utilisée arbitrairement pour fabriquer un résultat souhaité.

---

# 12. SCORE DE CONVERGENCE

Pour chaque dimension, le système compare les résultats des deux partenaires.

Exemple :

```text
Partenaire A = 82
Partenaire B = 79
Écart = 3
```

Le couple présente une forte proximité sur cette dimension.

Cependant, l'écart numérique seul ne suffit pas toujours à produire une interprétation.

Le moteur doit également prendre en compte :

- la nature de la dimension ;
- le niveau absolu ;
- les réponses sensibles ;
- les sous-dimensions ;
- les éventuels écarts de perception.

---

# 13. SCORE DE DIVERGENCE

Exemple :

```text
Partenaire A = 86
Partenaire B = 34
Écart = 52
```

Le système identifie une divergence importante.

Mais il doit ensuite déterminer :

> Divergence sur quoi ?

Exemple :

Une divergence financière peut concerner :

- épargne ;
- dépenses ;
- transparence ;
- autonomie ;
- gestion commune.

Le rapport doit descendre au niveau de la sous-dimension lorsque les données le permettent.

---

# 14. ÉCART DE PERCEPTION

L'écart de perception constitue une catégorie distincte.

Il ne faut pas le confondre avec une simple différence de personnalité.

Exemple :

Question :

> « Nous savons résoudre nos conflits. »

Partenaire A : 5/5  
Partenaire B : 2/5

Le résultat doit identifier :

**Écart de perception important.**

Le rapport pourra expliquer :

> Vous ne semblez pas vivre ou évaluer votre capacité à gérer les conflits de la même manière. Ce décalage mérite une conversation spécifique, car l'un peut considérer que le sujet est déjà maîtrisé tandis que l'autre ressent encore une difficulté importante.

---

# 15. CONVERGENCE ≠ COMPATIBILITÉ AUTOMATIQUE

Même une forte convergence ne doit pas être transformée automatiquement en conclusion positive.

Exemple :

Deux partenaires peuvent être très proches sur les valeurs mais présenter une forte divergence sur la gestion des conflits.

Le rapport doit donc pouvoir dire :

> Vous partagez des bases importantes, mais votre fonctionnement dans les situations de tension mérite une attention particulière.

---

# 16. DIVERGENCE ≠ INCOMPATIBILITÉ

Une divergence peut être :

### Type A — Différence neutre

Exemple :

Deux niveaux différents de besoin de temps personnel.

### Type B — Différence complémentaire

Deux styles différents pouvant fonctionner ensemble.

### Type C — Différence nécessitant une négociation

Exemple :

Préférences différentes concernant le lieu de vie.

### Type D — Divergence importante

Exemple :

Désaccord majeur sur le désir d'avoir des enfants.

### Type E — Sujet sensible nécessitant approfondissement

Exemple :

Problème important de confiance ou de sécurité relationnelle.

Le moteur doit distinguer ces situations.

---

# 17. NIVEAUX DE VIGILANCE

Le système pourra utiliser cinq niveaux.

| Niveau | Signification |
|---|---|
| **Niveau 1 — Force** | Forte convergence ou fonctionnement favorable |
| **Niveau 2 — Bon alignement** | Convergence satisfaisante |
| **Niveau 3 — À explorer** | Différence modérée ou sujet à clarifier |
| **Niveau 4 — Vigilance** | Divergence importante ou difficulté significative |
| **Niveau 5 — Priorité** | Sujet majeur nécessitant clarification ou accompagnement |

Ces niveaux ne sont pas des diagnostics.

---

# 18. PRIORISATION DES SUJETS

Le rapport ne doit pas présenter 15 problèmes au même niveau.

Le moteur doit sélectionner les priorités.

Une priorité peut être élevée lorsque plusieurs éléments convergent :

```text
Divergence importante
+
Sujet à fort impact
+
Écart de perception
+
Réponses sensibles
=
Priorité élevée
```

Le système doit limiter le nombre de priorités principales afin de ne pas submerger le couple.

Recommandation :

- 3 à 5 priorités principales ;
- puis les autres points secondaires.

---

# 19. SCORE GLOBAL DU COUPLE

Un score global peut être produit uniquement comme indicateur synthétique.

Il ne doit pas être présenté comme :

> « probabilité de réussite du couple ».

Nom recommandé :

**Indice global de convergence relationnelle**

ou un nom équivalent validé ultérieurement.

Le score global doit toujours être accompagné :

- d'un résumé ;
- des principales forces ;
- des principales zones de vigilance ;
- d'un rappel que le score n'est pas un verdict.

---

# 20. PROTECTION CONTRE LES SCORES EXTRÊMES

Le système doit éviter qu'une seule dimension fasse basculer artificiellement le score global.

Exemple :

Un couple peut être très divergent sur les finances mais très convergent sur :

- valeurs ;
- projet de vie ;
- communication ;
- famille ;
- parentalité.

Le résultat global doit refléter la complexité de la situation.

La présence d'un domaine critique doit être visible même si le score global reste élevé.

---

# 21. RÈGLE DES « DOMAINES CRITIQUES »

Certaines dimensions pourront être considérées comme particulièrement structurantes.

Exemples possibles :

- projet de vie ;
- désir d'enfant ;
- valeurs fondamentales ;
- confiance ;
- vision du mariage ;
- finances ;
- gestion des conflits.

Un très fort désaccord sur une dimension structurante ne doit pas être masqué par une moyenne globale.

Le rapport doit afficher :

> **Point d'attention majeur**

même lorsque le score global du couple est élevé.

---

# 22. RÈGLE DE CONTEXTE

Le système doit prendre en compte le contexte déclaré par les partenaires.

Exemples :

- couple récent ;
- couple établi ;
- fiancés ;
- préparation au mariage ;
- couple déjà marié ;
- relation à distance.

Une divergence peut avoir une signification différente selon le contexte.

Exemple :

Une différence sur la gestion du quotidien peut être difficile à interpréter pour un couple à distance qui ne vit pas encore ensemble.

---

# 23. ANALYSE DES SOUS-DIMENSIONS

Le moteur doit éviter les conclusions trop larges.

Exemple :

Score « Communication » = 72/100.

Il faut pouvoir découvrir :

```text
Écoute                  88
Expression des besoins  79
Sujets difficiles       54
Communication en conflit 47
```

Le rapport pourra alors conclure :

> Votre communication quotidienne semble être une force, mais les échanges deviennent plus difficiles lorsque le sujet est sensible ou lorsque la tension augmente.

Cette logique est beaucoup plus utile qu'un simple score « Communication : 72 % ».

---

# 24. MATRICE DE MATCHING

Le matching doit comparer les deux profils dimension par dimension.

Structure :

```text
DIMENSION
├── Score A
├── Score B
├── Écart
├── Niveau de convergence
├── Sous-dimensions concernées
├── Écart de perception éventuel
├── Niveau de vigilance
├── Priorité
└── Recommandation
```

Exemple :

```text
FINANCES

Score A : 38
Score B : 81
Écart : 43

Niveau :
Divergence importante

Sous-dimensions :
- Épargne
- Dépenses
- Gestion commune

Priorité :
Élevée

Action :
Conversation financière structurée
```

---

# 25. MATRICE DE COMPLÉMENTARITÉ

Le moteur doit également pouvoir identifier les différences qui ne sont pas nécessairement négatives.

Exemple :

Partenaire A :

- très orienté planification.

Partenaire B :

- très orienté adaptation.

Le système peut formuler :

> Vos styles semblent différents. Cette différence peut devenir une complémentarité si elle est reconnue et organisée, plutôt que vécue comme une opposition.

Il ne faut donc pas transformer toute différence en problème.

---

# 26. MATRICE DES ÉCARTS DE PERCEPTION

Certaines questions devront être conçues spécifiquement pour être comparables entre partenaires.

Le moteur pourra produire :

```text
PERCEPTION A
vs
PERCEPTION B
=
ÉCART
```

Catégories :

- faible ;
- modéré ;
- important ;
- très important.

Les écarts importants doivent apparaître dans le rapport même lorsque les scores globaux de la dimension semblent satisfaisants.

---

# 27. ANALYSE DE COHÉRENCE

Le système doit rechercher certaines incohérences.

Exemple :

Une personne affirme :

> « Je communique facilement mes besoins. »

mais répond ailleurs :

> « Lorsque quelque chose me dérange, j'attends souvent que mon partenaire le comprenne seul. »

Ces réponses peuvent signaler une nuance intéressante.

Le moteur ne doit pas nécessairement considérer cela comme une erreur.

Il peut identifier :

**Point à approfondir.**

Cette logique permettra des rapports plus riches.

---

# 28. GESTION DES RÉPONSES MANQUANTES

Le système doit prévoir :

- questionnaire incomplet ;
- question non répondue ;
- réponse invalide ;
- interruption ;
- reprise ultérieure.

Un rapport final ne doit pas être généré si les données minimales nécessaires ne sont pas disponibles.

Le seuil minimal de complétude sera défini dans la spécification technique.

---

# 29. QUALITÉ DES DONNÉES

Le système doit pouvoir détecter certains comportements susceptibles de réduire la qualité des résultats :

- questionnaire complété anormalement rapidement ;
- réponses identiques à toutes les questions ;
- alternance mécanique de réponses ;
- incohérences importantes ;
- absence de réponses sur des domaines structurants.

Ces indicateurs ne doivent pas être utilisés pour accuser l'utilisateur de mentir.

Ils servent uniquement à déterminer si le résultat doit être interprété avec prudence.

---

# 30. RÈGLES DE LANGAGE DU MOTEUR

Le moteur de génération doit privilégier :

- « peut indiquer » ;
- « semble » ;
- « vos réponses suggèrent » ;
- « votre bilan met en évidence » ;
- « ce domaine mérite d'être exploré » ;
- « il pourrait être utile de discuter de… » ;
- « cette différence peut devenir une force si… ».

Il doit éviter :

- « vous êtes incompatibles » ;
- « vous allez divorcer » ;
- « votre couple échouera » ;
- « cette personne n'est pas faite pour vous » ;
- « votre couple est parfait » ;
- « vous êtes toxique » ;
- « vous avez un trouble » ;
- toute autre conclusion clinique ou déterministe non justifiée.

---

# 31. LOGIQUE DE GÉNÉRATION DES RECOMMANDATIONS

Chaque recommandation doit être reliée à une donnée du bilan.

Structure :

```text
RÉSULTAT
↓
INTERPRÉTATION
↓
IMPLICATION POSSIBLE
↓
ACTION RECOMMANDÉE
↓
RESSOURCE ÉVENTUELLE
```

Exemple :

```text
Résultat :
Forte divergence sur les finances

↓
Interprétation :
Rapports différents à l'épargne et aux dépenses

↓
Implication :
Risque potentiel de désaccord sur la gestion du foyer

↓
Action :
Construire un budget commun et définir les règles de décision

↓
Ressource :
Guide / session / accompagnement finances du couple
```

---

# 32. DISTINCTION ENTRE ACTION INDIVIDUELLE ET ACTION DE COUPLE

Le moteur doit toujours pouvoir répondre à deux questions :

### Que peut faire cette personne ?

Exemple :

> Apprendre à exprimer plus clairement ses attentes financières.

### Que doivent-ils faire ensemble ?

Exemple :

> Définir une méthode commune de gestion des revenus et dépenses.

Cette distinction sera essentielle dans les rapports.

---

# 33. STRUCTURE DU RÉSULTAT FINAL

Le moteur devra idéalement produire un objet analytique structuré avant de produire le texte.

Conceptuellement :

```text
COUPLE_ANALYSIS

├── partner_a_profile
├── partner_b_profile
├── dimensions
│   ├── score_a
│   ├── score_b
│   ├── convergence
│   ├── divergence
│   ├── perception_gap
│   ├── priority
│   └── interpretation
├── strengths
├── watch_points
├── individual_actions_a
├── individual_actions_b
├── couple_actions
├── conversations
├── resources
└── report_metadata
```

Cette structure facilitera la génération automatisée des différents rapports.

---

# 34. RAPPORT À 30 000 FCFA

Le moteur doit être capable de produire au minimum :

### Pour chaque partenaire

- profil ;
- forces ;
- points de vigilance ;
- domaines individuels prioritaires.

### Pour le couple

- synthèse ;
- convergences ;
- divergences ;
- écarts de perception ;
- forces ;
- zones de vigilance ;
- priorités ;
- recommandations ;
- sujets de discussion.

Le rapport doit rester suffisamment approfondi pour justifier son positionnement premium.

---

# 35. RAPPORT À 50 000 FCFA

Le même moteur doit pouvoir produire un niveau d'analyse supérieur.

Il ajoute notamment :

- analyse approfondie des priorités ;
- conversations personnalisées ;
- exercices ;
- feuille de route ;
- plan de progression ;
- ressources ciblées ;
- recommandations plus détaillées.

Le Premium+ ne doit pas modifier les résultats du test.

Il doit **approfondir l'exploitation des mêmes résultats**.

---

# 36. PRINCIPLE DE STABILITÉ DU SCORE

Le score doit être reproductible.

Deux générations successives à partir des mêmes réponses doivent produire les mêmes scores analytiques.

La rédaction peut varier légèrement, mais :

- les scores ;
- les niveaux ;
- les priorités ;
- les catégories ;

doivent rester stables sauf modification documentée de l'algorithme.

---

# 37. VERSIONNAGE

Le moteur doit être versionné.

Exemple :

```text
SCORING_VERSION = 1.0
QUESTIONNAIRE_VERSION = 1.0
INTERPRETATION_VERSION = 1.0
```

Si les questions ou les pondérations changent de manière significative, une nouvelle version doit être créée.

Cela permettra de savoir avec quelle architecture un rapport a été produit.

---

# 38. VALIDATION AVANT MISE EN PRODUCTION

Avant de connecter le moteur à la plateforme, il faudra tester plusieurs profils artificiels.

Au minimum :

### Cas 1
Couple fortement convergent.

### Cas 2
Couple fortement divergent.

### Cas 3
Couple avec forte convergence globale mais une divergence majeure.

### Cas 4
Couple avec écarts de perception importants.

### Cas 5
Couple avec différences complémentaires.

### Cas 6
Couple avec questionnaire incomplet.

### Cas 7
Couple présentant des réponses incohérentes.

### Cas 8
Couple dont les résultats nécessitent une recommandation professionnelle prudente.

Ces cas serviront ensuite de **tests de référence**.

---

# 39. PRINCIPES DE VALIDATION DU MOTEUR

Le moteur ne sera considéré comme prêt que s'il respecte les critères suivants :

- aucun score ne produit automatiquement un verdict ;
- les divergences sont contextualisées ;
- les écarts de perception sont identifiés ;
- les différences neutres ne sont pas artificiellement transformées en problèmes ;
- les domaines critiques restent visibles ;
- les recommandations sont liées aux résultats ;
- les profils individuels restent distincts ;
- les résultats du couple sont réellement issus du croisement des deux profils ;
- les résultats sont reproductibles ;
- les règles sont documentées ;
- les rapports sont compréhensibles par un non-spécialiste.

---

# 40. PRINCIPE DIRECTEUR DU MOTEUR

Le moteur doit suivre cette logique :

> **Ne pas seulement demander : « À quel point êtes-vous similaires ? »**

Mais plutôt :

> **« Sur quels sujets êtes-vous alignés, sur quels sujets êtes-vous différents, comment vivez-vous ces différences et lesquelles méritent réellement d'être travaillées ? »**

C'est cette approche qui doit distinguer le Bilan Couple d'un test de compatibilité générique.

---

# 41. RÉSUMÉ OPÉRATIONNEL

Le système final doit produire quatre grandes catégories de résultats :

```text
1. CE QUI VOUS RAPPROCHE
        ↓
Convergences et forces

2. CE QUI VOUS DIFFÉRENCIE
        ↓
Divergences et complémentarités

3. CE QUE VOUS NE PERCEVEZ PAS DE LA MÊME FAÇON
        ↓
Écarts de perception

4. CE QUE VOUS POUVEZ FAIRE MAINTENANT
        ↓
Actions individuelles
Actions de couple
Conversations
Ressources
```

Le score global n'est qu'un résumé secondaire de cette analyse.

---

# 42. PROCHAINE ÉTAPE

La prochaine étape est :

`03_BANQUE_QUESTIONS.md`

Ce document devra transformer cette architecture en un questionnaire réellement exploitable.

Avant de rédiger les questions définitives, il faudra déterminer :

- le nombre total de questions ;
- le nombre de questions par dimension ;
- les questions communes aux deux partenaires ;
- les questions de perception ;
- les questions inversées ;
- les questions comportementales ;
- les questions de projection ;
- les questions sensibles ;
- les règles de pondération ;
- les identifiants uniques des questions.

**Fin du document.**
