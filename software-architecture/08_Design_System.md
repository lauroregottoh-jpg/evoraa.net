# KELIA
# 08_Design_System.md

**Version:** 1.0
**Dernière mise à jour :** Juillet 2026

---

## 1. Identité de Marque

### Mission
Bâtir des mariages chrétiens solides, authentiques et durables, en facilitant la rencontre d'âmes partageant la même foi et la même vision de l'engagement.

### Vision
Devenir le standard d'excellence et de confiance pour la rencontre chrétienne francophone, où l'amour est abordé avec profondeur, respect et sacralité.

### Valeurs Fondamentales
- **Foi & Spiritualité** : Christ au centre de la démarche.
- **Authenticité** : Des profils vérifiés et des intentions sincères.
- **Élégance** : Un environnement premium qui honore l'engagement matrimonial.
- **Bienveillance** : Un cadre sécurisant, respectueux de chacun.

### Promesse
"Où l'authenticité rencontre la spiritualité. Trouvez une connexion qui a du sens, pour aujourd'hui et pour l'éternité."

### Personnalité de la Marque & Ton Éditorial
- **Élégant** : Vocabulaire soigné, refus de la vulgarité ou de la superficialité.
- **Rassurant** : Communication transparente, claire et protectrice.
- **Inspirant** : Orienté vers l'espérance, la joie du mariage et la beauté de l'alliance.
- **Bienveillant** : Toujours dans l'empathie et le respect des parcours individuels.

---

## 2. Design System Complet

### Palette Officielle des Couleurs
Le choix des couleurs s'écarte volontairement des codes classiques des applications de rencontres (rose/rouge vif/violet fluo) pour s'orienter vers l'édition d'art et le luxe.

| Nom | Valeur HEX | Rôle |
|-----|------------|------|
| **Bordeaux Profond** | `#722F37` | Couleur primaire. Symbole de la passion mature, du vin des noces et du sang de l'alliance. |
| **Beige Ivoire** | `#FDFBF7` | Couleur de fond principale. Luminosité organique, rappelant les pages d'un livre ancien ou une robe de mariée. |
| **Noir Onyx** | `#1A1A1A` | Couleur de texte. Contraste élégant et lisibilité optimale. |
| **Or Patiné** | `#C5A059` | Couleur d'accent. Utilisée pour les détails subtils (icônes, bordures fines). |

### Typographies & Hiérarchie
L'alliance d'une Serif et d'une Sans-Serif crée une dynamique éditoriale haut de gamme.

- **Playfair Display (Serif)** : Exclusivement pour les Titres.
  - `H1` : 48px/56px (Desktop) - 36px/40px (Mobile), Font-Weight 700.
  - `H2` : 36px/40px (Desktop) - 28px/32px (Mobile), Font-Weight 600.
  - `H3` : 24px/32px (Desktop) - 20px/28px (Mobile), Font-Weight 600.
- **Inter (Sans-Serif)** : Pour le texte courant et l'interface.
  - `Body Large` : 18px, Font-Weight 400.
  - `Body Regular` : 16px, Font-Weight 400.
  - `Caption` : 14px, Font-Weight 400.
  - `Button` : 16px, Font-Weight 500, Tracking normal.

### Espacements, Grille & Formes
- **Espacements (Spacing)** : Système basé sur des multiples de 8px (8, 16, 24, 32, 48, 64). L'utilisation de grands espaces blancs (whitespace) est essentielle pour l'aspect premium.
- **Grille** : 12 colonnes sur Desktop (max-width 1200px), 1 colonne sur Mobile.
- **Rayons de bordure (Border-Radius)** : Très légers. `0.375rem` (6px) ou `0.5rem` (8px) pour les cartes et boutons. Pas de coins excessivement arrondis (évite l'effet "jouet").
- **Élévations & Ombres** : Des ombres extrêmement douces, diffuses et teintées. Pas d'ombres noires dures. `box-shadow: 0 10px 40px -10px rgba(114, 47, 55, 0.08)`.

### Composants & Animations
- **Boutons** : Bouton Primaire = Fond Bordeaux, Texte Ivoire. Effet de survol doux avec léger fondu (transition 300ms).
- **Cartes & Formulaires** : Fond blanc ou Ivoire très clair, bordures ultra-fines (`1px solid #EBE6DF`), ombres douces. Champs de formulaire élégants avec placeholder subtil.
- **Transitions** : Durée de `0.3s` à `0.5s` en `ease-in-out`. Aucune animation saccadée ou agressive.
- **Icônes** : Utilisation de la librairie *Lucide Icons* avec un trait fin (`stroke-width: 1.5`), couleur Noir ou Or.

---

## 3. Direction Artistique Photographique

Toutes les images utilisées dans KELIA doivent respecter scrupuleusement les règles suivantes pour garantir un univers visuel cohérent, cinématographique et digne d'une marque de luxe.

### Règles de Style
- **Lumière** : Lumière naturelle exclusivement. Privilégier la "Golden Hour" (lumière de fin de journée, douce, chaude, rasante).
- **Couleurs** : Harmonisées avec la palette (Bordeaux, Ivoire, Noir, Or). Pas de couleurs criardes ou de néons.
- **Cadrage & Composition** : Profondeur de champ importante (flou d'arrière-plan/bokeh) pour un rendu photographique très réaliste. Toujours prévoir une zone assombrie ou "calme" dans l'image (Negative Space) pour garantir la lisibilité du texte superposé.
- **Sujets** : Couples élégants, habillés avec sobriété et raffinement (sans ostentation ni marques visibles). Différentes origines représentées.
- **Émotion & Attitude** : L'émotion est suggérée. Les sujets **ne regardent pas l'objectif** (pour permettre la projection de l'utilisateur). Les attitudes sont dignes, complices, avec des regards tendres et des gestes mesurés. Aucun cliché "Tinder" (pas de selfies, pas de smartphones visibles, pas de poses suggestives).

### Catégories d'Illustrations Requises
- Couples marchant ensemble dans la nature ou une architecture raffinée.
- Couples en prière ou méditation.
- Demande en mariage / Mariage chrétien élégant.
- Temps de réflexion individuelle, personne seule en prière.
- Paysages inspirants (montagnes, vignobles, lacs).
- Détails symboliques (Bible ouverte, alliances, mains jointes, lumière de vitrail).

---

## 4. États de l'Application

Les états UI doivent offrir la même qualité d'expérience que les pages principales :
- **Empty State (Vide)** : Illustration subtile dorée, typographie élégante, message d'encouragement (ex: "Dieu écrit votre histoire, la patience est une vertu.").
- **Loading (Chargement)** : Skeleton loaders aux teintes Ivoire/Or ou léger "Pulse" sur le logo.
- **Erreur/Réseau** : Message doux, sans icône d'alerte agressive. Utilisation du Bordeaux assombri.
- **Succès** : Confirmation élégante et minimaliste, apparition en fondu.

---

## 5. Accessibilité & Responsive
- Contraste validé (WCAG AA minimum). Le Noir Onyx sur Beige Ivoire offre une excellente lisibilité. Le blanc sur Bordeaux profond également.
- Mobile First absolu : Toutes les grilles, tailles de polices et espacements s'adaptent de manière fluide via Tailwind.

---
*(Ce document est la source de vérité pour tout développement futur sur l'application KELIA).*
