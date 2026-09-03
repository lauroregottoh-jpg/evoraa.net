# Audit harmonie — palette Farata pastel

## Problème constaté
Mélange de systèmes incompatibles dans l’UI membre :
- Sidebar desktop `#5C1F28` (bordeaux) vs mobile `#8B5A57` (rose)
- Titres parfois en rose, parfois en or `#B8954A` / bronze `#7A5F28`
- Fonds de cartes en ivoire `#F2EBE0` alors que le fond de page est déjà champagne → tout “rosâtre”
- CTA tests en or/bronze au lieu du rose mat

Résultat : pas d’harmonie, contraste faible, look “girly” ou “sale” selon les écrans.

## Palette Farata verrouillée (6 tons)

| Rôle | Hex | Usage |
|------|-----|--------|
| Champagne | `#F5EDE0` | Fond de page uniquement |
| Taupe clair | `#DED1C4` | Bordures, secondary |
| Rose poussière | `#CAAF9B` | Soft hover / muted soft |
| **Rose mauve sidebar / PWA** | `#A07070` | Sidebar desktop **et** mobile — **pas** `#AC7D79` (bordeaux blanchi) |
| Prune CTA | `#7F5557` | Boutons, liens actifs |
| Plum texte | `#3E222D` | Titres et texte principal |

## Règles d’harmonie
1. **Sidebar seule** = `#A07070` (même rose Farata / PWA, téléphone + ordinateur). Icônes **blanc opaque**.
2. **Pas de voile blanc** sur le fond sidebar (`white/12`, cream/15, backdrop-blur interdits sur le rail).
3. **Page** = champagne `#F5EDE0` — jamais le même rose que la sidebar.
4. **Cartes / tests** = blanc pur `#FFFFFF` + bordure `#DED1C4`.
5. **Texte** = `#3E222D` (lisible) — pas de titres or/bronze.
6. **CTA** = `#7F5557` texte `#F7F1EA` — pas d’or sur les boutons d’action.
7. Or `#B8954A` = ornements fins uniquement (filet, badge Alliance), jamais fond de carte ni CTA principal.
