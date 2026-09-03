# KELIAA — CORRECTIONS UX/UI & CONTENU
## Brief produit (référence développeur)

> Document de cadrage pour épurer l’expérience KELIAA.
> Marque officielle : **KELIAA** (orthographe produit).

---

## Objectif

Peu de texte · hiérarchie claire · infos essentielles · pas d’accroche répétée · Premium visible mais discret · interface calme et lisible.

---

## Corrections livrées en priorité

1. Suppression globale de « KELIAA te fait un clin d’œil »
2. Page connexion épurée
3. Accueil : proposition de valeur + parcours Alliance
4. Messages accessibles sans like mutuel
5. Vocal Premium visible mais verrouillé
6. Compatibilité : prioriser les profils ayant complété les tests
7. Direction éditoriale concise

---

## Direction éditoriale

### À privilégier

- Votre compatibilité : 82 %
- Tests complétés
- Rapport disponible
- Matching enrichi
- Envoyer un message
- Liker
- Découvrir Premium

### Accroche accueil

**Foi, discernement et matching enrichi.**

**Votre parcours Alliance commence ici.**

Rappel discret (accueil uniquement) :

**Connectez-vous régulièrement : les bons profils n’attendent pas.**

---

## Philosophie

> Je comprends immédiatement où je suis.  
> Je comprends ce que je peux faire.  
> Je vois ce qui m’est accessible.  
> Je vois ce qui est Premium.  
> Je peux agir sans avoir besoin de lire beaucoup.

---

## Couche 2 — Système visuel (fait)

Tokens V2 dans `src/app/globals.css` + Inter dans `src/app/layout.tsx`.

| Token | Valeur |
| --- | --- |
| Fond | `#F7F1E8` |
| Carte | `#FCFAF6` |
| Secondaire | `#EFE5DA` |
| Bordeaux | `#641F2B` |
| Champagne | `#D7B866` |
| Texte | `#2B2421` |

- Header clair · nav basse / sidebar bordeaux
- Tests en mode quotidien clair
- Boutons radius 14px, hauteur mobile confortable
- PWA theme_color ivoire

### Suite (couche 3)

- Remplacement massif des hex anciens (#5C1F28 → #641F2B, #B8954A → #D7B866, etc.) — **fait**
- Page pricing / portes d’entrée éclaircies — **fait**
- Monogramme PWA (`public/icons/monogram.png`, 192/512, favicon, apple) — **fait**
