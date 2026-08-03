# KELLIA — Design System

**Version :** 2.0
**Dernière mise à jour :** 30 juillet 2026
**Références techniques :** `src/app/globals.css`, `src/app/layout.tsx`

## 1. Identité

KELLIA associe foi, dignité, confiance et élégance. L’interface doit ressembler à un espace éditorial premium et humain, jamais à une application de swipe ou à un produit SaaS violet générique.

### Ton

- chaleureux ;
- rassurant ;
- digne ;
- biblique sans être moralisateur ;
- clair et concret ;
- inclusif pour l’Afrique francophone et la diaspora.

## 2. Tokens actifs

| Token | Valeur | Usage |
|---|---|---|
| `background` | `#F3EFE8` | Fond pierre chaude |
| `foreground` | `#1C1412` | Texte principal |
| `primary` | `#5C1F28` | Bordeaux, actions principales |
| `primary-foreground` | `#F8F4EE` | Texte sur primaire |
| `secondary` | `#E8E0D4` | Surfaces secondaires |
| `muted` | `#E8E0D4` | États atténués |
| `muted-foreground` | `#5C534A` | Texte secondaire |
| `accent` | `#B8954A` | Or patiné |
| `border` | `#D9D0C4` | Bordures |
| `ring` | `#B8954A` | Focus |
| `destructive` | `#9F1239` | Erreurs et actions destructives |

Les couleurs doivent être utilisées via les tokens Tailwind (`bg-background`, `text-primary`, etc.), pas recopiées arbitrairement.

## 3. Typographie active

### Titres

**Cormorant Garamond**, variable `--font-cormorant`, classe `font-serif`.

- H1 desktop : 48/56, 700.
- H1 mobile : 36/40, 700.
- H2 desktop : 36/40, 600.
- H2 mobile : 28/32, 600.
- H3 desktop : 24/32, 600.
- H3 mobile : 20/28, 600.

### Interface et texte

**DM Sans**, variable `--font-dm-sans`, classe `font-sans`.

- Corps standard : 16 px.
- Corps compact : 14 px.
- Légende : 12 px.
- CTA : 14 à 16 px, 600.

Playfair Display et Inter ne sont plus les polices officielles.

## 4. Espacement et layout

- Échelle principale : 4, 8, 12, 16, 24, 32, 48 et 64 px.
- Largeur membre habituelle : `max-w-6xl`.
- Largeur éditoriale : `max-w-3xl` à `max-w-5xl`.
- Mobile : une colonne et zones tactiles d’au moins 44 px.
- Desktop : grilles de 2 à 4 colonnes selon la densité.
- Les écrans administratifs peuvent être plus denses que les pages marketing.

## 5. Rayons et ombres

### Rayons

- `sm` : 4 px.
- `md` : 6 px.
- `lg` : 8 px.
- Les panneaux marketing flottants peuvent utiliser 12 à 16 px avec parcimonie.
- Éviter les coins excessivement arrondis sur tous les éléments.

### Ombres

- `shadow-card` : cartes standard.
- `shadow-premium` : surfaces importantes.
- `shadow-elevated` : overlays et panneaux élevés.

Les ombres sont chaudes, diffuses et basées sur le bordeaux.

## 6. Composants

### Fondamentaux

- Button
- MagneticButton
- Card / SectionCard
- Input, Select et Textarea
- Badge et StatusPill
- Avatar et galerie photo
- Dialog / Modal
- Progress
- Skeleton
- Toast/message d’état
- Tabs
- KPI card
- Graphiques simples admin

### Composants métier

- Carte de compatibilité.
- Explication du score.
- Progression profil.
- Questionnaires et badges des cinq piliers.
- Conversation et Bouclier de bienveillance.
- Coach EVA.
- Module/leçon Académie.
- Quotas Découverte/Alliance.
- Sélecteur Mobile Money/carte.
- Éditeurs CMS admin.
- Journal d’audit paiement.

## 7. Navigation

### Navigation publique

Accueil, Fonctionnement, Tarifs, Blog et Contact, avec Connexion et Créer mon compte.

### Navigation membre desktop

Accueil, Découvrir, Messages, Tests, Académie et Alliance.

### Navigation membre mobile

Accueil, Découvrir, Messages et Tests ; les autres entrées sont regroupées dans « Plus ».

### Navigation admin

Dashboard, Analytique, Membres, Profils, Modération, Alliance et paiements, Matching et conversations, Académie, Coach EVA, Contenu et marketing, Paramètres.

## 8. États

Chaque fonctionnalité doit prévoir :

- chargement ;
- vide ;
- erreur ;
- succès ;
- accès limité ;
- mode désactivé ;
- données partielles ;
- connexion lente.

Les messages sont humains et actionnables. Une erreur ne doit pas culpabiliser l’utilisateur.

## 9. Motion

- Transitions UI : 150 à 300 ms.
- Animations marketing : GSAP et Lenis, avec sobriété.
- Three.js uniquement si le bénéfice visuel justifie le coût.
- Respecter `prefers-reduced-motion`.
- Ne pas bloquer une action pendant une animation décorative.

## 10. Images

- Afrique francophone et diaspora représentées authentiquement.
- Lumière naturelle et scènes crédibles.
- Tenues dignes, gestes mesurés et absence de poses suggestives.
- Pas de selfies Tinder ni de couples génériques surjoués.
- Toujours optimiser et renseigner le texte alternatif.

## 11. Accessibilité

- Contraste WCAG AA.
- Focus visible.
- Utilisation complète au clavier.
- HTML sémantique.
- Libellés associés aux champs.
- Icônes seules accompagnées d’un `aria-label`.
- Ne jamais transmettre une information uniquement par couleur.

## 12. Règles anti-générique

Interdits :

- violet/rose en dégradé comme identité principale ;
- glow sur chaque bouton ;
- sparkles purement décoratifs partout ;
- glassmorphism omniprésent ;
- douze CTA concurrents ;
- gamification addictive ;
- copie qui promet « l’âme sœur garantie ».

## 13. Source de vérité

Pour toute implémentation :

1. Les tokens de `src/app/globals.css` ont priorité.
2. Les polices de `src/app/layout.tsx` ont priorité.
3. Les composants existants doivent être réutilisés avant d’en créer de nouveaux.
4. Toute modification des tokens ou polices doit mettre à jour ce document dans le même changement.
