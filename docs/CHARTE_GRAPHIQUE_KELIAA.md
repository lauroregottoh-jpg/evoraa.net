# KELIAA — CHARTE GRAPHIQUE & SYSTÈME VISUEL
## Version UI — Référence développeur (V2 · Épurée)

> Document de référence pour l'interface web / PWA / mobile de KELIAA.
>
> Cette version **simplifie** la direction visuelle précédente.
> Elle privilégie le calme, la chaleur et l'espoir — pas l'exhaustivité d'un design system.
>
> **Principe directeur :**
>
> KELIAA doit être une marque lumineuse, chaleureuse et élégante, signée par le bordeaux.
>
> Le bordeaux reste la couleur emblématique.
> Il ne doit **pas** devenir la couleur dominante des écrans.
>
> L'interface doit produire cette sensation :
>
> **douceur → respiration → chaleur → profondeur → espoir**
>
> et non :
>
> **premium → sombre → doré → premium → bordeaux.**

---

# 1. POSITIONNEMENT

KELIAA est une plateforme destinée aux célibataires chrétiens qui veulent réellement se marier.

L'identité visuelle doit traduire une rencontre qui peut devenir une relation construite, puis une alliance.

> *« Deux valent mieux qu'un, parce qu'ils retirent un bon salaire de leur travail. »*
> — Ecclésiaste 4:9

## Ce que l'interface doit être

élégante · premium · chaleureuse · contemporaine · rassurante · intime · mature · lumineuse · orientée relation et mariage · spirituelle avec subtilité · africaine contemporaine lorsque des personnes sont représentées

## Ce qu'elle ne doit jamais être

adolescente · kitsch · trop rose · trop sombre · agressivement religieuse · néon · gaming · froide · institutional · dating généraliste

---

# 2. LANGAGE VISUEL EN CINQ MOTS

| Mot | Expression |
| --- | --- |
| **DOUX** | Crème, ivoire, sable |
| **PROFOND** | Bordeaux |
| **PRÉCIEUX** | Champagne (rare) |
| **LUMINEUX** | Espaces vides, photos naturelles, lumière chaude |
| **ÉLÉGANT** | Cormorant + Inter |

Formule :

```text
KELIAA = IVOIRE + CRÈME + BLANC CASSÉ + BORDEAUX + CHAMPAGNE
```

Rien d'autre dans l'identité courante.

---

# 3. TROIS MODES KELIAA

Toute l'interface se range dans l'un de ces trois modes.

## 🤍 KELIAA quotidien — mode par défaut

**Clair. Doux. Simple.**

Accueil, tests, messages, profil, guides, académie, listes, paramètres, formulaires.

L'utilisateur doit pouvoir rester 20 minutes dans l'app sans se sentir enfermé dans un univers sombre.

```text
Ivoire + blanc cassé + titres bordeaux + CTA bordeaux + champagne très rare
```

## 🍷 KELIAA émotionnel

**Bordeaux — ponctuel.**

Une grande carte, une promesse, un moment de découverte, une invitation.

Le bordeaux attire l'attention **parce qu'il est rare** au milieu d'un environnement clair.

Si trois ou quatre cartes successives sont bordeaux, l'effet disparaît.

## ✨ KELIAA Premium / Alliance

**Bordeaux profond + champagne + lumière.**

Réservé à : Rapport, Alliance, Coffret Premium, révélations, moments de forte valeur.

Là seulement, on peut être plus spectaculaire.

---

# 4. PALETTE PRINCIPALE — 5 COULEURS UNIQUEMENT

Le développeur ne doit **pas** multiplier les couleurs.

## Identité

### 1. Ivoire KELIAA — fond principal

```css
--keliaa-ivory: #F7F1E8;
```

Environnement naturel de l'application. Pas une couleur décorative.

### 2. Crème doux — sections

```css
--keliaa-cream: #EFE5DA;
```

Blocs alternés, zones de contexte, fonds secondaires.

### 3. Blanc cassé — cartes

```css
--keliaa-off-white: #FCFAF6;
```

Cartes, modales, formulaires, zones de lecture.

### 4. Bordeaux — signature

```css
--keliaa-burgundy: #641F2B;
```

CTA, navigation basse, titres forts, cartes émotionnelles, états actifs.

### 5. Champagne — accent précieux

```css
--keliaa-champagne: #D7B866;
```

Alliance, Premium, progression, badges premium. **Très peu présent.**

---

## Couleurs fonctionnelles (hors identité)

Elles n'appartiennent pas à la palette de marque. Usage strictement utilitaire.

```css
--keliaa-text: #2B2421;
--keliaa-text-secondary: #706761;
--keliaa-text-muted: #938982;
--keliaa-white: #FFFDF9;

--keliaa-success: #6D947C;
--keliaa-warning: #C59A4A;
--keliaa-error: #B35D5D;
--keliaa-info: #7C8D91;

--keliaa-border: #E4DCD2;
```

---

## Couleurs hors palette principale

| Couleur | Statut |
| --- | --- |
| Bordeaux doux `#8A4B55` | Exceptionnel — hover / état actif uniquement |
| Bordeaux profond `#451923` | Exceptionnel — Premium / Alliance / Rapport uniquement |
| Champagne clair `#E8D49A` | Exceptionnel — highlights Premium uniquement |
| Doré sombre `#A78335` | Exceptionnel — texte doré à contraste |
| Rose chaud `#B98588` | **Hors interface.** Illustrations / campagnes seulement |
| Violet | **INTERDIT. Permanent.** |

Ne pas documenter ces couleurs comme « disponibles pour l'UI courante ».

---

# 5. IMPRESSION DE PROPORTION (PAS UNE CONTRAINTE)

Ce n'est **pas** une règle mathématique à appliquer écran par écran.
C'est l'impression générale que l'interface doit produire :

```text
IVOIRE CHAUD     ~ 50 %
CRÈME DOUX       ~ 20 %
BLANC CASSÉ      ~ 10 %
BORDEAUX         ~ 15 %
CHAMPAGNE        ~  5 %
```

Le beige / crème n'est pas décoratif.
Il est **l'environnement naturel** de KELIAA.

Quand une personne ouvre KELIAA, elle doit d'abord voir une **lumière chaude et douce**.

Pas du blanc froid.
Pas du beige grisâtre.
Pas du rose poudré très féminin.

---

# 6. LA RESPIRATION — RÈGLE D'IDENTITÉ

> **KELIAA ne cherche pas à remplir l'écran. L'espace vide fait partie de l'identité visuelle.**

Un écran avec :

* beaucoup d'espace ;
* une belle typographie ;
* une belle photo ;
* **une seule couleur forte** ;
* un CTA clair ;

paraît plus haut de gamme qu'un écran rempli d'effets, de badges et de gradients.

## Éviter

* trop de cartes collées ;
* trop de badges ;
* trop de bordures ;
* trop d'icônes ;
* trop de couleurs dans la même zone ;
* trop de texte dans un même bloc.

Sur mobile :

* padding général : 20–24 px ;
* sections : 32–48 px ;
* grandes sections : 48–64 px.

---

# 7. RÈGLE DU BORDEAUX

Le bordeaux est une **signature**, pas un décor.

## Garder

Une grande carte émotionnelle isolée au milieu d'un écran clair — comme « Une session pour débloquer un vrai point ». Elle attire l'attention **parce qu'elle est sombre dans un environnement clair**.

## Ne pas faire

Trois ou quatre cartes bordeaux d'affilée. Le bordeaux devient alors le fond habituel et perd sa force.

## Utiliser le bordeaux pour

* CTA principal ;
* navigation basse ;
* titres importants ;
* **une** grande carte émotionnelle par écran (maximum) ;
* messages envoyés ;
* moments de promesse / découverte.

## Ne pas utiliser le bordeaux pour

* fond général des pages ;
* toutes les cartes ;
* longs textes ;
* listes ;
* formulaires ;
* conversations (fond).

---

# 8. RÈGLE DU CHAMPAGNE

Le champagne est précieux **parce qu'il est rare**.

## Utiliser pour

* Alliance ;
* Premium ;
* progression ;
* badge premium ;
* élément actif de la navigation basse ;
* détail sur une carte de valeur.

## Ne pas

* entourer tous les composants d'une bordure dorée ;
* écrire du texte champagne clair sur ivoire ;
* en faire une couleur dominante.

---

# 9. GRADIENTS — USAGE LIMITÉ

Les gradients ne sont **pas** le langage quotidien.

Autorisés uniquement en mode Premium / Alliance / Rapport :

```css
/* Premium */
linear-gradient(135deg, #641F2B 0%, #51232A 52%, #3B2420 100%);

/* Rapport */
linear-gradient(135deg, #3B2420, #451923, #641F2B);
```

Sur les écrans quotidiens : **pas de gradient**. Fonds plats ivoire / crème / blanc cassé.

---

# 10. SURFACES

```css
/* Niveau 0 — fond app */
background: #F7F1E8;

/* Niveau 1 — carte */
background: #FCFAF6;
border: 1px solid #E4DCD2;

/* Niveau 2 — section */
background: #EFE5DA;

/* Premium — exception */
background: linear-gradient(135deg, #451923, #3B2420);
```

## Radius

```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 24px;
```

Cartes standards : 16–20 px. Grandes cartes : 24–28 px.
Éviter les arrondis enfantins.

## Ombres

Douces uniquement :

```css
box-shadow: 0 8px 30px rgba(43, 36, 33, 0.08);
```

Pas d'ombres noires fortes. Pas de glow hors Premium.

---

# 11. TYPOGRAPHIE

Deux familles. Pas plus.

## Cormorant Garamond — éditorial

Grands titres, hero, Rapport, Alliance, citations, versets.

```css
font-family: "Cormorant Garamond", serif;
font-weight: 600;
```

## Inter — UI

Boutons, navigation, formulaires, descriptions, messages, badges.

```css
font-family: "Inter", sans-serif;
```

## Hiérarchie

| Niveau | Style |
| --- | --- |
| H1 | Cormorant, `clamp(36px, 8vw, 58px)`, weight 600 |
| H2 | Cormorant, `clamp(30px, 6vw, 44px)`, weight 600 |
| Corps | Inter, 16px, line-height 1.55 |
| Secondaire | Inter, 14px |
| Label | Inter, 11–13px, uppercase, letter-spacing 0.18em — **avec modération** |

---

# 12. BOUTONS

## CTA principal

```css
background: #641F2B;
color: #FFFDF9;
border-radius: 14px;
min-height: 52px;
padding: 14px 22px;
```

## CTA Premium / Alliance

```css
background: #D7B866;
color: #2B2421;
```

## Secondaire

```css
background: transparent;
color: #641F2B;
border: 1px solid #D8C9B7;
```

## Hiérarchie CTA

Un seul CTA niveau 1 par écran.
Puis secondaire.
Puis lien texte.

L'utilisateur doit toujours répondre à : **« Quelle est l'action principale ici ? »**

---

# 13. NAVIGATION

## Header — clair

```css
background: #F7F1E8;
/* logo + icônes : #641F2B */
border-bottom: 1px solid #E4DCD2;
```

Le header n'est **pas** bordeaux.

## Navigation basse — signature

```css
background: #641F2B;
/* icônes : rgba(255,255,255,0.78) */
/* actif : #E8D49A / #FFFDF9 */
```

La nav basse peut rester plus sombre que le reste : c'est une signature, pas le décor de page.

## Menu latéral

Peut rester bordeaux, mais avec beaucoup d'espace vertical, peu de bordures, et une hiérarchie claire.

---

# 14. ÉCRANS PAR MODE

## Accueil (quotidien)

```text
Fond ivoire
→ carte blanche
→ titre bordeaux
→ petite touche champagne éventuelle
→ photo chaleureuse
→ UNE carte bordeaux ponctuelle pour la profondeur
```

## Académie / Guides (quotidien)

```text
Ivoire + blanc cassé
Titres bordeaux
Champagne uniquement sur contenus débloqués / citations
```

## Tests (quotidien)

```text
Ivoire + cartes blanches
CTA bordeaux
Progression champagne
```

Sensation : *« Je découvre quelque chose sur moi qui peut m'aider dans ma future relation. »*

## Messages (quotidien)

```text
Fond ivoire
Message reçu : #FCFAF6 + bordure claire
Message envoyé : #641F2B + texte #FFFDF9
```

## Profil (quotidien)

```text
Ivoire
Grande photo = élément principal
Petits accents bordeaux
Champagne si Premium
Pas de carte entièrement bordeaux
```

## Coaching (émotionnel ponctuel)

Fond de page clair.
Grandes cartes bordeaux possibles.
Textes longs toujours sur surfaces claires.

## Rapport (Premium)

Fond sombre + lumière dorée + typographie ivoire.
Objet de valeur. Conservé.

```text
Fond sombre + #FFFDF9 + #D7B866
```

## Alliance / Coffret (Premium)

```text
Bordeaux profond + champagne + ivoire + glow chaud très discret
```

Précieux, sérieux, chaleureux — pas casino, pas luxe ostentatoire.

Glow max :

```css
box-shadow: 0 0 40px rgba(215, 184, 102, 0.14);
```

---

# 15. IMAGERIE

Photos : réalistes, chaleureuses, contemporaines, adultes, crédibles, Afrique contemporaine lorsque le contexte le permet.

Couple = *« Ils construisent quelque chose. »* — pas seulement *« Ils sont beaux ensemble. »*

Éviter : stock photo évidente, sensualité excessive, clichés romantiques, poses artificielles.

---

# 16. ICONOGRAPHIE & SYMBOLES

Icônes : outline, stroke 1.75–2 px, bordeaux / anthracite / crème.

Symboles possibles : cœur, alliance, chemin, dialogue, lien, couronne Premium — **subtils**.

Éviter : cœurs partout, bagues partout, colombes, roses, angelots, décor religieux excessif.

---

# 17. SPIRITUALITÉ

Chrétienne contemporaine + relationnelle + premium.
Pas : site religieux décoré.

## Versets — parcimonie

Autorisés dans Rapport, Alliance, Académie, citations éditoriales.

**Maximum un verset par écran.**
Cormorant pour le texte, Inter pour la référence.
Toujours avec référence visible.
Jamais en décor permanent.

### Références

> *« Deux valent mieux qu'un… »* — Ecclésiaste 4:9-10  
> *« Et le fil triple ne se rompt pas facilement. »* — Ecclésiaste 4:12  
> *« Que l'homme ne sépare pas ce que Dieu a uni. »* — Matthieu 19:6  
> *« Celui qui trouve une femme trouve le bonheur… »* — Proverbes 18:22  
> *« L'amour est patient, il est plein de bonté… »* — 1 Corinthiens 13:4  
> *« …afin de vous donner un avenir et de l'espoir. »* — Jérémie 29:11  
> *« Confie-toi en l'Éternel de tout ton cœur… »* — Proverbes 3:5  
> *« Que ta lumière brille ainsi devant les hommes. »* — Matthieu 5:16

---

# 18. LOGO & MARQUE

Logo : proportions et typographie existantes. Pas d'effets, pas d'ombre, pas de gradient sur le logo.

* Sur fond clair : `#641F2B`
* Sur fond sombre : `#FFFDF9`

Slogan officiel :

> **KELIAA — Plus qu'un match. Une alliance.**

Ne jamais inventer une étymologie du nom KELIAA sans validation officielle.

---

# 19. MOTION

Lent à modéré. Fade, slide léger, scale très léger.
Pas de rebonds, flashes, néons, effets gaming.

Glow : uniquement Premium / Alliance, chaud, presque imperceptible.
Pas de glow violet. Pas de glow bleu.

---

# 20. ACCESSIBILITÉ

Lisibilité avant esthétique.

Interdit :

* texte champagne clair sur ivoire ;
* texte beige sur crème ;
* texte rose clair sur blanc ;
* texte blanc sur bordeaux trop clair.

Texte principal = `#2B2421` sur surfaces claires.

---

# 21. VARIABLES CSS — SET MINIMAL

```css
:root {
  /* IDENTITÉ — 5 couleurs */
  --keliaa-ivory: #F7F1E8;
  --keliaa-cream: #EFE5DA;
  --keliaa-off-white: #FCFAF6;
  --keliaa-burgundy: #641F2B;
  --keliaa-champagne: #D7B866;

  /* TEXTE */
  --keliaa-text: #2B2421;
  --keliaa-text-secondary: #706761;
  --keliaa-text-muted: #938982;
  --keliaa-white: #FFFDF9;

  /* FONCTIONNEL */
  --keliaa-success: #6D947C;
  --keliaa-warning: #C59A4A;
  --keliaa-error: #B35D5D;
  --keliaa-info: #7C8D91;
  --keliaa-border: #E4DCD2;

  /* EXCEPTIONNEL — Premium seulement */
  --keliaa-burgundy-deep: #451923;
  --keliaa-burgundy-soft: #8A4B55;
  --keliaa-champagne-light: #E8D49A;
  --keliaa-gold-dark: #A78335;

  /* STRUCTURE */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;
  --space-10: 64px;
}
```

---

# 22. RÈGLES POUR LE DÉVELOPPEUR

1. **Ne pas** multiplier les couleurs. Identité = 5 couleurs.
2. **Ne pas** appliquer le bordeaux comme fond global.
3. **Ne pas** transformer toutes les cartes en cartes bordeaux.
4. **Ne pas** mettre du doré partout.
5. **Ne pas** utiliser le rose chaud dans l'UI.
6. **Ne pas** ajouter de violet.
7. **Ne pas** créer une nouvelle palette.
8. **Ne pas** remplir l'écran. L'espace vide est une identité.
9. **Ne pas** refaire les fonctionnalités. On évolue le visuel, on conserve la logique produit.
10. Quand un écran est trop sombre : identifier sa fonction → quotidien = éclaircir · premium = conserver.

---

# 23. AVANT / APRÈS

## À éviter

```text
Bordeaux → Bordeaux → Doré → Bordeaux → Sombre → Bordeaux
→ Interface lourde
```

## Direction

```text
Ivoire → Carte claire → Bordeaux ponctuel → Ivoire → Photo → Crème → Champagne rare
→ Interface lumineuse + profondeur + signature
```

---

# 24. RÈGLE D'OR — 4 QUESTIONS

Avant de valider un écran :

1. **Est-ce lumineux ?** — peut-on respirer ?
2. **Est-ce chaleureux ?** — a-t-on envie de rester ?
3. **Est-ce KELIAA ?** — le bordeaux signe-t-il sans envahir ?
4. **Est-ce porteur d'espoir ?** — évoque-t-il une relation construite ?

Si l'écran est beau mais sombre, lourd, froid ou agressif → retravailler.

---

# 25. PHRASE DIRECTRICE

> **KELIAA doit ressembler à un endroit où l'on a envie de construire quelque chose de sérieux.**

Pas simplement à un endroit où l'on vient chercher un match.

> *« …afin de vous donner un avenir et de l'espoir. »*
> — Jérémie 29:11

---

# 26. FORMULE FINALE

> **Épurée, chaude, enveloppante et précieuse.**

```text
🤍 Quotidien = clair, doux, simple
🍷 Émotionnel = bordeaux ponctuel
✨ Premium = bordeaux profond + champagne + lumière
```

```text
Palette = IVOIRE → CRÈME → BLANC CASSÉ → BORDEAUX → CHAMPAGNE
```

Le reste est fonctionnel ou exceptionnel.

**On n'invente pas une nouvelle KELIAA.**
On rend la KELIAA actuelle plus lumineuse, plus respirante, plus calme — et plus émotionnellement accueillante.

**Aucun violet.**

---

# STATUT

Cette V2 remplace la direction « design system exhaustif » précédente.

Elle fixe :

* 5 couleurs d'identité ;
* 3 modes (quotidien / émotionnel / premium) ;
* la respiration comme règle d'identité ;
* le bordeaux comme signature, non comme décor ;
* le champagne comme accent rare ;
* le beige/crème comme environnement naturel.

Le développeur doit **évoluer** l'interface existante vers cette direction, sans modifier fonctionnalités, textes, chiffres, noms ni structure produit validée.
