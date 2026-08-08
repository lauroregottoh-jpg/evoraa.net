# BILAN COUPLE — BANQUE DE QUESTIONS

**Version : 1.0**  
**Statut : Document maître — construction du questionnaire**  
**Dépendances : `01_CAHIER_DES_CHARGES.md` et `02_ARCHITECTURE_TEST_SCORING_MATCHING.md`**  
**Format : Markdown (.md)**

---

## 1. OBJET

Ce document constitue la banque initiale de questions du Bilan Couple.

La banque est construite pour que **les deux partenaires répondent indépendamment aux mêmes dimensions**, tout en permettant au moteur de distinguer :

- les tendances individuelles ;
- les comportements ;
- les attentes ;
- les valeurs ;
- les perceptions du couple ;
- les écarts de perception entre partenaires.

Cette version contient **126 questions : 18 dimensions × 7 questions**.

Elle constitue une **V1 de travail méthodologique**, et non une validation psychométrique définitive. Avant mise en production, les questions devront être relues, testées, éventuellement reformulées et validées selon les règles du document de scoring.

---

## 2. RÈGLE DE PASSATION

Sauf indication contraire, **les deux partenaires répondent aux mêmes questions**, chacun depuis son compte et sans voir les réponses de l'autre.

Les questions `COUPLE_PERCEPTION` sont particulièrement importantes pour le matching : elles permettent de comparer directement la perception que chacun a de la relation.

---

## 3. TYPES DE QUESTIONS

### `LIKERT`

Réponse sur une échelle de 1 à 5 :

1. Pas du tout d'accord  
2. Plutôt pas d'accord  
3. Ni d'accord ni pas d'accord  
4. Plutôt d'accord  
5. Tout à fait d'accord

### `BEHAVIOR`

Question comportementale. La formulation et l'échelle définitive seront précisées lors de la phase de finalisation.

### `COUPLE_PERCEPTION`

Question destinée à être posée aux deux partenaires afin de comparer leurs perceptions.

---

## 4. PRINCIPES DE RÉDACTION

Les questions doivent :

- mesurer une seule idée principale autant que possible ;
- éviter les formulations culpabilisantes ;
- éviter les conclusions implicites ;
- être compréhensibles sans vocabulaire psychologique ;
- être suffisamment concrètes pour permettre une réponse honnête ;
- ne pas suggérer la « bonne réponse » ;
- éviter de transformer une différence en problème ;
- permettre une interprétation contextualisée.

---


# 01 — Vision du couple

| ID | Question | Type | Fonction |
|---|---|---|---|
| `VIS-001` | Je considère notre relation comme un projet que nous devons construire ensemble. | `LIKERT` | autoévaluation |
| `VIS-002` | Nous avons une vision suffisamment claire de ce que nous voulons construire à deux. | `LIKERT` | autoévaluation |
| `VIS-003` | Pour moi, être en couple implique de préserver à la fois le lien et l'individualité de chacun. | `LIKERT` | valeur |
| `VIS-004` | Je sais ce que j'attends concrètement d'une relation durable. | `LIKERT` | autoévaluation |
| `VIS-005` | Je suis prêt(e) à faire évoluer certaines habitudes personnelles pour construire une relation saine. | `LIKERT` | autoévaluation |
| `VIS-006` | Lorsque nous devons choisir entre un intérêt personnel et un intérêt commun, je cherche généralement un équilibre. | `BEHAVIOR` | comportement |
| `VIS-007` | Notre conception de ce que signifie « être un bon partenaire » me semble globalement proche. | `COUPLE_PERCEPTION` | perception du couple |

# 02 — Valeurs fondamentales

| ID | Question | Type | Fonction |
|---|---|---|---|
| `VAL-001` | Le respect doit rester présent même lorsque nous sommes fortement en désaccord. | `LIKERT` | valeur |
| `VAL-002` | La fidélité est une valeur non négociable pour moi dans une relation engagée. | `LIKERT` | valeur |
| `VAL-003` | L'honnêteté est préférable, même lorsqu'elle risque de provoquer une conversation difficile. | `LIKERT` | valeur |
| `VAL-004` | Je considère la responsabilité personnelle comme essentielle dans la vie de couple. | `LIKERT` | valeur |
| `VAL-005` | Je peux accepter que mon/ma partenaire ait certaines priorités différentes des miennes. | `LIKERT` | tolérance aux différences |
| `VAL-006` | Lorsque mes valeurs et celles de mon/ma partenaire diffèrent, je cherche d'abord à comprendre avant de vouloir convaincre. | `BEHAVIOR` | comportement |
| `VAL-007` | Je pense que nous partageons les valeurs fondamentales nécessaires à notre projet de vie. | `COUPLE_PERCEPTION` | perception du couple |

# 03 — Vision du mariage

| ID | Question | Type | Fonction |
|---|---|---|---|
| `MAR-001` | Je considère le mariage comme un engagement qui demande un travail régulier sur la relation. | `LIKERT` | vision du mariage |
| `MAR-002` | J'ai une idée assez claire des responsabilités que j'associe au mariage. | `LIKERT` | vision du mariage |
| `MAR-003` | Je pense que les attentes concernant le mariage doivent être discutées explicitement avant de s'engager. | `LIKERT` | préparation |
| `MAR-004` | Je suis capable de distinguer mes attentes personnelles de ce que le mariage peut réellement apporter. | `LIKERT` | réalisme |
| `MAR-005` | Je sais quelles concessions je suis prêt(e) à faire et lesquelles ne me conviennent pas. | `LIKERT` | limites |
| `MAR-006` | Avant une décision importante concernant notre avenir, je préfère vérifier que nous partageons la même compréhension de l'engagement. | `BEHAVIOR` | comportement |
| `MAR-007` | Nous avons suffisamment parlé de ce que chacun attend du mariage. | `COUPLE_PERCEPTION` | perception du couple |

# 04 — Communication

| ID | Question | Type | Fonction |
|---|---|---|---|
| `COM-001` | Je peux dire clairement à mon/ma partenaire ce dont j'ai besoin. | `LIKERT` | expression des besoins |
| `COM-002` | Je me sens écouté(e) lorsque je parle d'un sujet important. | `LIKERT` | écoute |
| `COM-003` | Je peux aborder avec mon/ma partenaire un sujet qui me met mal à l'aise. | `LIKERT` | sujets difficiles |
| `COM-004` | Je vérifie que j'ai bien compris ce que mon/ma partenaire voulait dire avant de répondre. | `LIKERT` | écoute |
| `COM-005` | Je peux exprimer un désaccord sans attaquer la personne. | `LIKERT` | communication respectueuse |
| `COM-006` | Quand quelque chose me dérange, je tends à le dire plutôt qu'à attendre que l'autre le devine. | `BEHAVIOR` | comportement |
| `COM-007` | Nous avons globalement la même perception de la qualité de notre communication. | `COUPLE_PERCEPTION` | écart de perception |

# 05 — Gestion des conflits

| ID | Question | Type | Fonction |
|---|---|---|---|
| `CON-001` | Lorsque nous sommes en désaccord, je peux rester respectueux(se) même si je suis très contrarié(e). | `LIKERT` | régulation |
| `CON-002` | Je suis capable de reconnaître ma part de responsabilité après un conflit. | `LIKERT` | responsabilité |
| `CON-003` | Après une dispute, je cherche à comprendre ce qui s'est réellement passé. | `LIKERT` | réparation |
| `CON-004` | Je peux demander une pause pendant un conflit sans utiliser le silence comme moyen de punir l'autre. | `LIKERT` | désescalade |
| `CON-005` | Je suis capable de revenir vers mon/ma partenaire après un conflit pour réparer la relation. | `LIKERT` | réparation |
| `CON-006` | Lorsque le conflit monte, j'ai tendance à chercher une solution plutôt qu'à gagner la discussion. | `BEHAVIOR` | comportement |
| `CON-007` | Nous évaluons de manière similaire notre capacité actuelle à gérer les conflits. | `COUPLE_PERCEPTION` | écart de perception |

# 06 — Fonctionnement émotionnel

| ID | Question | Type | Fonction |
|---|---|---|---|
| `EMO-001` | Je peux identifier ce que je ressens avant de réagir à mon/ma partenaire. | `LIKERT` | conscience émotionnelle |
| `EMO-002` | Je peux exprimer une émotion sans attendre que mon/ma partenaire la devine. | `LIKERT` | expression |
| `EMO-003` | Lorsque je suis contrarié(e), je peux éviter de faire porter toute ma charge émotionnelle sur l'autre. | `LIKERT` | régulation |
| `EMO-004` | Je tolère qu'une émotion difficile puisse exister sans devoir être immédiatement résolue. | `LIKERT` | tolérance émotionnelle |
| `EMO-005` | Je peux demander de la réassurance sans exiger que mon/ma partenaire règle entièrement mon insécurité. | `LIKERT` | réassurance |
| `EMO-006` | Sous stress, je prends généralement un peu de recul avant de réagir fortement. | `BEHAVIOR` | comportement |
| `EMO-007` | Nous comprenons suffisamment bien les besoins émotionnels de l'autre. | `COUPLE_PERCEPTION` | perception du couple |

# 07 — Affection et proximité

| ID | Question | Type | Fonction |
|---|---|---|---|
| `AFF-001` | Je sais quelles formes d'affection me font me sentir aimé(e). | `LIKERT` | besoins affectifs |
| `AFF-002` | Je montre régulièrement à mon/ma partenaire que je tiens à lui/elle. | `LIKERT` | expression |
| `AFF-003` | J'ai besoin d'un niveau de proximité affective relativement élevé dans une relation durable. | `LIKERT` | besoin |
| `AFF-004` | Je peux demander davantage d'affection sans considérer automatiquement un refus comme un rejet personnel. | `LIKERT` | sécurité |
| `AFF-005` | Je respecte les besoins de proximité de mon/ma partenaire même lorsqu'ils diffèrent des miens. | `LIKERT` | respect |
| `AFF-006` | Lorsque je sens une distance affective, je préfère en parler plutôt que d'accumuler du ressentiment. | `BEHAVIOR` | comportement |
| `AFF-007` | Nous avons une compréhension suffisamment proche de la manière dont nous souhaitons exprimer l'affection. | `COUPLE_PERCEPTION` | perception du couple |

# 08 — Intimité

| ID | Question | Type | Fonction |
|---|---|---|---|
| `INT-001` | Je me sens suffisamment en sécurité pour parler de mes attentes en matière d'intimité. | `LIKERT` | communication |
| `INT-002` | Je considère que les limites de chacun doivent être respectées sans pression. | `LIKERT` | consentement et limites |
| `INT-003` | Je pense que les attentes liées à l'intimité doivent être discutées avant le mariage ou un engagement durable. | `LIKERT` | préparation |
| `INT-004` | Je peux exprimer ce qui me met à l'aise ou mal à l'aise dans ce domaine. | `LIKERT` | expression |
| `INT-005` | Je peux entendre les attentes de mon/ma partenaire sans les considérer automatiquement comme une obligation. | `LIKERT` | respect |
| `INT-006` | Lorsque nous avons une différence sur l'intimité, je préfère chercher à comprendre plutôt qu'éviter le sujet. | `BEHAVIOR` | comportement |
| `INT-007` | Nous avons une compréhension suffisamment proche de la place que l'intimité doit occuper dans notre relation. | `COUPLE_PERCEPTION` | perception du couple |

# 09 — Finances

| ID | Question | Type | Fonction |
|---|---|---|---|
| `FIN-001` | Je considère important de parler ouvertement d'argent dans une relation durable. | `LIKERT` | transparence |
| `FIN-002` | Je préfère avoir une vision claire des revenus, charges et engagements financiers importants du couple. | `LIKERT` | transparence |
| `FIN-003` | Je suis plutôt orienté(e) vers l'épargne et la sécurité financière. | `LIKERT` | rapport à l'argent |
| `FIN-004` | Je considère qu'une partie de l'argent peut être utilisée pour profiter du présent même lorsque l'épargne est importante. | `LIKERT` | dépenses |
| `FIN-005` | Je pense que les grandes décisions financières doivent être prises ensemble. | `LIKERT` | décision |
| `FIN-006` | Avant une dépense importante, je cherche généralement à vérifier son impact sur le budget commun. | `BEHAVIOR` | comportement |
| `FIN-007` | Nous avons une vision suffisamment proche de la manière dont l'argent devrait être géré dans notre couple. | `COUPLE_PERCEPTION` | perception du couple |

# 10 — Famille et belle-famille

| ID | Question | Type | Fonction |
|---|---|---|---|
| `FAM-001` | Je pense que notre couple doit pouvoir poser des limites claires avec les familles d'origine. | `LIKERT` | limites |
| `FAM-002` | Je souhaite conserver des liens importants avec ma famille après mon engagement ou mon mariage. | `LIKERT` | famille |
| `FAM-003` | Je peux accepter que mon/ma partenaire ait un niveau de proximité différent avec sa famille. | `LIKERT` | différences |
| `FAM-004` | Les décisions concernant notre foyer doivent d'abord être discutées entre nous. | `LIKERT` | priorité au couple |
| `FAM-005` | Je suis capable de dire non à ma famille lorsque cela protège l'équilibre de mon couple. | `LIKERT` | limites |
| `FAM-006` | Lorsqu'un membre de la famille intervient dans une question de couple, je cherche d'abord à en parler avec mon/ma partenaire. | `BEHAVIOR` | comportement |
| `FAM-007` | Nous avons une vision suffisamment proche des limites à poser aux familles et belles-familles. | `COUPLE_PERCEPTION` | perception du couple |

# 11 — Rôles conjugaux

| ID | Question | Type | Fonction |
|---|---|---|---|
| `ROL-001` | Je pense que les responsabilités du foyer doivent être discutées plutôt que supposées. | `LIKERT` | responsabilités |
| `ROL-002` | Je suis ouvert(e) à une répartition des tâches qui tient compte des réalités de chacun. | `LIKERT` | flexibilité |
| `ROL-003` | Je considère que le travail domestique doit être reconnu comme une responsabilité réelle. | `LIKERT` | quotidien |
| `ROL-004` | Je pense que les rôles conjugaux peuvent évoluer au cours de la vie. | `LIKERT` | évolution |
| `ROL-005` | Je sais quelles responsabilités j'attends de mon/ma partenaire dans la vie quotidienne. | `LIKERT` | attentes |
| `ROL-006` | Lorsque la répartition devient déséquilibrée, je préfère en parler plutôt que laisser le ressentiment s'installer. | `BEHAVIOR` | comportement |
| `ROL-007` | Nous avons une vision suffisamment proche de la répartition des rôles dans notre futur foyer. | `COUPLE_PERCEPTION` | perception du couple |

# 12 — Prise de décision et pouvoir

| ID | Question | Type | Fonction |
|---|---|---|---|
| `DEC-001` | Je souhaite que les décisions importantes concernant notre couple soient prises conjointement. | `LIKERT` | décision |
| `DEC-002` | Je peux accepter de ne pas avoir le dernier mot dans une décision importante. | `LIKERT` | compromis |
| `DEC-003` | Je peux défendre mon point de vue sans chercher à imposer ma décision. | `LIKERT` | négociation |
| `DEC-004` | Je considère que certaines décisions peuvent relever principalement de l'un des partenaires selon le sujet. | `LIKERT` | souplesse |
| `DEC-005` | Je me sens capable de négocier lorsque nous avons des préférences différentes. | `LIKERT` | négociation |
| `DEC-006` | Lorsque nous sommes en désaccord sur une décision, je cherche d'abord à comprendre les priorités de l'autre. | `BEHAVIOR` | comportement |
| `DEC-007` | Nous avons une vision suffisamment proche de la manière dont les décisions importantes doivent être prises. | `COUPLE_PERCEPTION` | perception du couple |

# 13 — Projet de vie

| ID | Question | Type | Fonction |
|---|---|---|---|
| `PRO-001` | J'ai une vision assez claire du type de vie que je souhaite construire. | `LIKERT` | projection |
| `PRO-002` | Je souhaite que mon/ma partenaire puisse conserver des projets personnels en plus de nos projets communs. | `LIKERT` | autonomie |
| `PRO-003` | Je suis prêt(e) à ajuster certains projets personnels pour construire un projet commun. | `LIKERT` | compromis |
| `PRO-004` | Le lieu où nous vivrons constitue pour moi une décision importante à anticiper. | `LIKERT` | lieu de vie |
| `PRO-005` | Je considère important de parler de nos objectifs à moyen et long terme. | `LIKERT` | planification |
| `PRO-006` | Lorsque nos projets divergent, je cherche à identifier ce qui peut être négocié et ce qui ne l'est pas. | `BEHAVIOR` | comportement |
| `PRO-007` | Nous avons une vision suffisamment proche de la vie que nous voulons construire ensemble. | `COUPLE_PERCEPTION` | perception du couple |

# 14 — Carrière et aspirations

| ID | Question | Type | Fonction |
|---|---|---|---|
| `CAR-001` | Ma carrière ou mon activité professionnelle occupe une place importante dans ma vie. | `LIKERT` | priorités |
| `CAR-002` | Je souhaite que mon/ma partenaire soutienne mes ambitions professionnelles. | `LIKERT` | soutien |
| `CAR-003` | Je suis prêt(e) à discuter de compromis professionnels lorsque ceux-ci ont un impact important sur le couple. | `LIKERT` | compromis |
| `CAR-004` | Une mobilité géographique pour le travail doit être discutée sérieusement par le couple. | `LIKERT` | mobilité |
| `CAR-005` | Je considère important que chacun puisse développer son potentiel professionnel. | `LIKERT` | autonomie |
| `CAR-006` | Avant d'accepter une opportunité professionnelle qui change fortement notre organisation, je consulte mon/ma partenaire. | `BEHAVIOR` | comportement |
| `CAR-007` | Nous avons une vision suffisamment proche de la place que la carrière doit occuper dans notre vie commune. | `COUPLE_PERCEPTION` | perception du couple |

# 15 — Enfants et parentalité

| ID | Question | Type | Fonction |
|---|---|---|---|
| `PAR-001` | Je sais si je souhaite avoir des enfants dans le cadre d'une relation durable. | `LIKERT` | désir d'enfant |
| `PAR-002` | Je pense que le désir ou le refus d'avoir des enfants doit être discuté clairement avant le mariage. | `LIKERT` | préparation |
| `PAR-003` | J'ai des attentes assez précises concernant le rôle de chaque parent. | `LIKERT` | rôles parentaux |
| `PAR-004` | Je pense que les décisions éducatives importantes doivent être discutées entre les deux parents. | `LIKERT` | éducation |
| `PAR-005` | Je suis prêt(e) à revoir certaines de mes idées éducatives si nous découvrons des différences importantes. | `LIKERT` | flexibilité |
| `PAR-006` | Face à une décision concernant un futur enfant, je chercherais d'abord à construire une position commune. | `BEHAVIOR` | comportement |
| `PAR-007` | Nous avons suffisamment parlé de notre vision des enfants et de la parentalité. | `COUPLE_PERCEPTION` | perception du couple |

# 16 — Autonomie et interdépendance

| ID | Question | Type | Fonction |
|---|---|---|---|
| `AUT-001` | J'ai besoin de conserver du temps personnel même dans une relation très engagée. | `LIKERT` | autonomie |
| `AUT-002` | Je peux aimer profondément quelqu'un sans avoir besoin de partager toutes ses activités. | `LIKERT` | indépendance |
| `AUT-003` | Je respecte le besoin de mon/ma partenaire d'avoir des espaces personnels. | `LIKERT` | respect |
| `AUT-004` | Je peux demander du temps pour moi sans vouloir prendre de distance avec la relation. | `LIKERT` | limites |
| `AUT-005` | Je considère qu'un couple sain repose à la fois sur l'interdépendance et l'autonomie. | `LIKERT` | équilibre |
| `AUT-006` | Lorsque mon/ma partenaire souhaite faire quelque chose sans moi, je cherche d'abord à ne pas l'interpréter comme un rejet. | `BEHAVIOR` | comportement |
| `AUT-007` | Nous avons une compréhension suffisamment proche du niveau d'indépendance souhaitable dans notre couple. | `COUPLE_PERCEPTION` | perception du couple |

# 17 — Spiritualité et convictions

| ID | Question | Type | Fonction |
|---|---|---|---|
| `SPI-001` | Mes convictions spirituelles ou religieuses occupent une place importante dans ma vie. | `LIKERT` | importance |
| `SPI-002` | Je souhaite pouvoir vivre mes convictions librement dans mon couple. | `LIKERT` | liberté |
| `SPI-003` | Je pense que les convictions importantes doivent être discutées avant un engagement durable. | `LIKERT` | préparation |
| `SPI-004` | Je suis capable de respecter une différence de pratique ou de sensibilité lorsqu'elle existe. | `LIKERT` | tolérance |
| `SPI-005` | Je considère important de parler de la manière dont nos convictions pourraient influencer notre foyer. | `LIKERT` | projection |
| `SPI-006` | Lorsque nous avons une différence de conviction, je cherche à comprendre sa place dans la vie de l'autre avant de vouloir la modifier. | `BEHAVIOR` | comportement |
| `SPI-007` | Nous avons une vision suffisamment proche de la place de la spiritualité ou des convictions dans notre vie commune. | `COUPLE_PERCEPTION` | perception du couple |

# 18 — Limites, confiance et sécurité relationnelle

| ID | Question | Type | Fonction |
|---|---|---|---|
| `SEC-001` | Je me sens globalement en sécurité pour être moi-même dans cette relation. | `LIKERT` | sécurité |
| `SEC-002` | Je considère que la fidélité et la loyauté doivent être clairement définies par le couple. | `LIKERT` | fidélité |
| `SEC-003` | Je peux poser une limite à mon/ma partenaire sans craindre d'être puni(e) ou humilié(e). | `LIKERT` | limites |
| `SEC-004` | Je pense que la transparence ne signifie pas nécessairement renoncer à toute vie privée. | `LIKERT` | confiance |
| `SEC-005` | Je peux reconnaître une erreur et chercher à réparer lorsque j'ai blessé mon/ma partenaire. | `LIKERT` | responsabilité |
| `SEC-006` | Lorsque je me sens en insécurité dans la relation, je préfère chercher une conversation claire plutôt que surveiller ou contrôler l'autre. | `BEHAVIOR` | comportement |
| `SEC-007` | Nous avons une perception suffisamment proche de ce qui constitue la confiance et la sécurité dans notre couple. | `COUPLE_PERCEPTION` | perception du couple |

# 5. STRUCTURE DE DONNÉES RECOMMANDÉE

Chaque question devra être enregistrée avec au minimum :

```text
question_id
dimension_id
subdimension_id
question_text
question_type
response_scale
scoring_direction
is_couple_perception
is_sensitive
weight
version
```

Exemple :

```text
question_id: COM-001
dimension_id: COM
question_type: LIKERT
response_scale: 1-5
scoring_direction: DIRECT
is_couple_perception: false
is_sensitive: false
version: 1.0
```

---

# 6. QUESTIONS À SCORING INVERSÉ

La banque V1 contient principalement des formulations directes afin de préserver la lisibilité.

Lors de la phase de finalisation, certaines questions pourront être reformulées ou ajoutées en sens inversé.

Toute question inversée devra être explicitement marquée :

```text
scoring_direction: REVERSE
```

Aucune inversion ne doit être déduite automatiquement du texte.

---

# 7. QUESTIONS SENSIBLES

Les domaines suivants nécessitent une attention particulière :

- intimité ;
- confiance ;
- fidélité ;
- sécurité relationnelle ;
- spiritualité ;
- finances ;
- famille.

La plateforme devra présenter les questions sensibles avec une formulation claire et respectueuse.

Le système ne doit pas utiliser une réponse sensible pour poser un diagnostic.

---

# 8. ÉQUILIBRE DES DIMENSIONS

La version actuelle utilise 7 questions par dimension pour obtenir une première couverture homogène.

Ce choix est **provisoire**.

La version finale pourra utiliser une répartition différente si les tests démontrent qu'une dimension nécessite davantage de questions ou qu'une autre peut être mesurée avec moins d'items.

La qualité de mesure prime sur la symétrie artificielle du nombre de questions.

---

# 9. OBJECTIF DE LA PROCHAINE VALIDATION

Avant d'intégrer définitivement cette banque dans le moteur, chaque question devra être vérifiée selon cinq critères :

1. **Clarté** — la question est-elle immédiatement compréhensible ?
2. **Unicité** — mesure-t-elle principalement une seule idée ?
3. **Neutralité** — évite-t-elle de suggérer une réponse socialement désirable ?
4. **Utilité analytique** — apporte-t-elle une information réellement exploitable ?
5. **Comparabilité** — peut-elle être utilisée correctement pour comparer les deux partenaires lorsque cela est pertinent ?

Les questions qui échouent à l'un de ces critères devront être reformulées ou remplacées.

---

# 10. PROCHAINE ÉTAPE

La banque de questions doit maintenant être reliée à :

- des sous-dimensions précises ;
- des règles de scoring ;
- des pondérations ;
- des seuils ;
- des règles de comparaison ;
- des règles d'interprétation.

Ces éléments seront ensuite intégrés à la **Bibliothèque des interprétations**.

**Fin du document.**
