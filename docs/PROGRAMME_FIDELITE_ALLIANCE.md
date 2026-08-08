# Programme Fidélité Alliance — Référence officielle

> **Statut :** version officielle — **implémentée** (code app + migration SQL `20240101000030_alliance_loyalty.sql`).  
> **Remplace entièrement** toutes les propositions antérieures de bonus fidélité.  
> **Date :** 2026-08-07  
> **Produit :** KELIAA · formule Alliance  

---

## Objectif

Créer un programme de fidélité **simple, automatique et durable** afin d’encourager les renouvellements d’abonnement Alliance et d’améliorer la rétention des membres.

Cette règle **annule et remplace** toutes les précédentes propositions concernant les bonus de fidélité.

Elle est plus équilibrée, plus rentable et crée une vraie fidélisation **sans dévaloriser** l’offre Alliance.

---

## Règle majeure — messages bonus

Les messages bonus sont **cumulables** et **ne jamais expirent** tant que le compte existe.

| Règle | Détail |
|-------|--------|
| Acquisition | Définitive dès l’attribution |
| Consommation | Uniquement **après** les 100 messages inclus Alliance |
| Découverte | Solde **conservé** mais **inactif** |
| Réactivation Alliance | Solde bonus **immédiatement** de nouveau utilisable |
| Suppression | **Interdite** (aucun retrait d’une récompense gagnée) |

Ainsi KELIAA ne retire jamais un avantage gagné, tout en gardant un argument fort pour revenir sur Alliance.

---

## 1. Bonus de renouvellement mensuel

À chaque renouvellement **consécutif** d’un abonnement Alliance, le membre reçoit automatiquement :

**+15 messages bonus**

Ces messages sont ajoutés à son compteur personnel.

---

## 2. Récompense spéciale tous les 3 mois

Tous les **trois mois consécutifs**, le membre reçoit une récompense renforcée.

**À la place** des +15 habituels :

- **+30 messages bonus**
- **1 Boost Profil de 24 heures**

### Exemple

| Mois | Récompense |
|------|------------|
| 1 | +15 messages |
| 2 | +15 messages |
| **3** | **+30 messages + 1 Boost 24 h** |
| 4 | +15 messages |
| 5 | +15 messages |
| **6** | **+30 messages + 1 Boost 24 h** |
| 7 | +15 messages |
| 8 | +15 messages |
| **9** | **+30 messages + 1 Boost 24 h** |
| 10 | +15 messages |
| 11 | +15 messages |
| **12** | **+30 messages + 1 Boost 24 h** |

---

## 3. Récompense exceptionnelle après 12 mois

Les membres qui atteignent **12 mois consécutifs** d’abonnement Alliance rejoignent le cercle des membres les plus fidèles.

Ils reçoivent :

- les récompenses du 12ᵉ mois (**+30 messages + Boost 24 h**) ;
- une invitation à une **Session VIP Alliance**, organisée par l’équipe KELIAA.

### Formats possibles de la Session VIP

- coaching collectif exclusif ;
- atelier interactif réservé aux membres fidèles ;
- masterclass en direct ;
- rencontre privée en visioconférence.

**Objectif :** remercier les plus engagés **sans** créer une charge de coaching individuel difficile à maintenir.

---

## 4. Gestion des messages bonus

- Cumulables.
- Enregistrés **définitivement** sur le compte.
- **Jamais** supprimés.
- Utilisés uniquement lorsque le quota normal de messages est **entièrement consommé**.
- Solde consultable à tout moment par le membre.

---

## 5. Retour à la formule Découverte

Lorsque l’abonnement Alliance expire :

- le membre retrouve les limitations Découverte ;
- les bonus fidélité **restent enregistrés** ;
- ils deviennent simplement **inactifs** ;
- ils redeviennent accessibles dès la **réactivation** Alliance.

**Aucun bonus gagné n’est supprimé.**

> Note produit : le **compteur de mois consécutifs** repart à zéro après interruption ; le **solde bonus** et les Boosts non utilisés restent.

---

## 6. Affichage — page Alliance

### Section : Programme Fidélité Alliance

Texte :

> Votre fidélité est récompensée. Chaque renouvellement vous offre des avantages supplémentaires pour poursuivre vos échanges et préparer votre projet de mariage avec sérénité.

### Progression (exemple)

```
Mois 5 sur 12

████████░░░░

Prochaine récompense :

+30 messages bonus

+

Boost Profil 24 heures
```

---

## 7. Animation après renouvellement

Après validation du paiement :

1. Animation — badge Alliance.
2. Carte de récompense.

### Cas standard (+15)

🎁 Merci pour votre fidélité !

Vous venez de recevoir :

✓ +15 messages bonus

### Cas palier (3 / 6 / 9 / 12)

🎉 Félicitations !

Vous atteignez un nouveau palier de fidélité.

Vous recevez :

✓ +30 messages bonus  
✓ 1 Boost Profil de 24 heures

*(Au 12ᵉ mois : ajouter la mention Session VIP Alliance.)*

---

## 8. Console d’administration

Afficher / permettre :

- nombre de renouvellements consécutifs ;
- historique des récompenses attribuées ;
- solde de messages bonus ;
- nombre de Boosts disponibles ;
- statut d’éligibilité à la Session VIP des 12 mois ;
- ajustement exceptionnel des bonus si nécessaire (journalisé).

---

## Contraintes techniques (implémentation)

- Entièrement automatique.
- Déclenchement **uniquement** après confirmation effective du paiement (Mobile Money / carte).
- Pas de double attribution pour un même renouvellement / `payment_ref`.
- Compatible Moneroo / Bictorys (et flux paiement existants).
- Toutes les opérations journalisées (audit).
- Design : charte KELIAA (or, bordeaux, crème), composants et animations existants.

---

## Conclusion

Cette version est la **référence officielle** du Programme Fidélité Alliance. Elle remplace toutes les versions précédentes. Elle est simple à comprendre, facile à automatiser, économiquement maîtrisée et attractive pour la rétention long terme — sans jamais retirer un avantage déjà acquis.

---

## Checklist avant code / déploiement

- [ ] Validation produit de **ce** document  
- [ ] Migration + RLS + journal `loyalty_grants`  
- [ ] Branchement webhooks paiement (idempotence)  
- [ ] UI Alliance + animation post-paiement  
- [ ] Consommation : quota standard → puis bonus  
- [ ] Admin ops  
- [ ] Tests : mois 1–3, interruption, réactivation, double webhook  
- [ ] Déploiement prod **après** accord explicite


# NOUVELLE SPÉCIFICATION – PROGRAMME DE FIDÉLITÉ KELIAA
## (Cette spécification remplace toutes les propositions précédentes)

## Objectif

Mettre en place un véritable **Programme de Fidélité KELIAA** afin de récompenser l'ancienneté et l'engagement des membres.

L'objectif n'est pas uniquement de récompenser les abonnés Alliance, mais également les membres Découverte qui restent actifs pendant plusieurs mois.

Le système doit être entièrement automatique.

---

# PRINCIPE GÉNÉRAL

Chaque utilisateur possède désormais un **Parcours de Fidélité**.

Deux critères sont pris en compte :

- la durée de présence sur KELIAA ;
- l'activité réelle sur la plateforme.

L'utilisateur progresse naturellement dans son parcours.

À certains paliers, il débloque automatiquement une **nouvelle carte de fidélité**.

Ces cartes remplacent progressivement la carte affichée dans la barre située en haut de l'application (Accueil, Alliance, Profil...).

Ainsi, un utilisateur ancien et fidèle voit son interface évoluer naturellement.

---

# LES CARTES DE FIDÉLITÉ

Prévoir plusieurs designs de cartes.

Exemple :

Carte 1
Bienvenue

↓

Carte 2
Membre actif

↓

Carte 3
Membre engagé

↓

Carte 4
Membre fidèle

↓

Carte 5
Ambassadeur KELIAA

Les noms pourront être modifiés ultérieurement.

Chaque nouvelle carte possède :

- un design différent ;
- une couleur différente ;
- une illustration différente ;
- une animation lors du déblocage.

Le changement de carte doit donner l'impression d'une évolution.

---

# MEMBRES DÉCOUVERTE

Les membres Découverte peuvent eux aussi progresser.

Condition :

- être inscrit depuis au moins 6 mois ;
- rester actif sur la plateforme.

Activité prise en compte :

- connexion régulière ;
- profil complété ;
- questionnaires réalisés ;
- conversations engagées ;
- utilisation normale de l'application.

Si les conditions sont remplies :

la carte actuelle est remplacée automatiquement par une nouvelle carte.

Aucun bonus payant n'est offert.

Il s'agit uniquement d'une reconnaissance de fidélité.

L'objectif est de valoriser les utilisateurs fidèles, même sans abonnement.

---

# MEMBRES ALLIANCE

Les membres Alliance bénéficient du même système de cartes.

En plus de cela, ils reçoivent des récompenses exclusives.

---

# BONUS DE RENOUVELLEMENT

Chaque renouvellement consécutif :

+15 messages bonus

Ces messages sont ajoutés automatiquement.

---

# TOUS LES 3 MOIS

Au lieu des +15 messages :

+30 messages bonus

+

1 Boost Profil de 24 heures

Exemple :

Mois 1

+15

Mois 2

+15

Mois 3

+30

+

Boost 24 h

Puis le cycle recommence.

---

# APRÈS 12 MOIS CONSÉCUTIFS

Le membre reçoit :

- +30 messages bonus
- 1 Boost Profil de 24 heures
- invitation à une Session VIP Alliance organisée par KELIAA

Cette session pourra prendre plusieurs formes :

- coaching collectif ;
- atelier privé ;
- masterclass ;
- rencontre VIP.

Le format pourra évoluer.

---

# GESTION DES MESSAGES BONUS

Les messages bonus :

- sont cumulables ;
- sont enregistrés définitivement ;
- ne sont jamais supprimés.

Ils sont consommés uniquement lorsque le quota normal de messages est épuisé.

---

# EN CAS DE DOWNGRADE

Lorsque le membre quitte Alliance :

- retour aux limitations de Découverte ;
- les messages bonus restent enregistrés ;
- ils deviennent simplement inactifs.

Si Alliance est réactivé :

les bonus restants redeviennent immédiatement disponibles.

Aucun bonus gagné ne doit être perdu.

---

# DÉBLOCAGE D'UNE CARTE

Lorsqu'une nouvelle carte est obtenue :

Afficher une animation.

Exemple :

✨ Félicitations !

Vous venez de débloquer votre nouvelle Carte de Fidélité.

La nouvelle carte apparaît avec une animation premium.

Puis :

Continuer

---

# PAGE "MON PARCOURS"

Créer une nouvelle section.

Titre :

Mon Parcours de Fidélité

Afficher :

- la carte actuelle ;
- la prochaine carte à débloquer ;
- les conditions pour l'obtenir ;
- la progression actuelle.

Exemple :

━━━━━━━━━━━━━━

Carte actuelle

Membre engagé

Progression

██████░░░░

Encore 42 jours avant votre prochaine carte.

━━━━━━━━━━━━━━

---

# PAGE ALLIANCE

Ajouter une nouvelle carte.

Titre :

Programme de Fidélité

Afficher :

- renouvellements ;
- bonus obtenus ;
- prochaine récompense ;
- prochaine carte à débloquer.

---

# PAGE TARIFS

Ajouter un bloc.

Titre :

Votre fidélité est récompensée.

Texte :

Chaque renouvellement Alliance vous permet de débloquer progressivement des récompenses exclusives et de faire évoluer votre Carte de Fidélité.

---

# PROFIL

Afficher la carte actuelle.

Exemple :

Carte de Fidélité

Membre fidèle

ou

Carte Alliance

Membre engagé

Cette carte doit être visible sur le profil.

---

# MATCHING

Afficher discrètement la carte de fidélité sur les profils.

Objectif :

Valoriser les utilisateurs investis dans une démarche sérieuse.

Cette information doit renforcer la confiance sans influencer le score de compatibilité.

---

# CONSOLE ADMINISTRATEUR

Ajouter :

- date d'obtention de la carte ;
- historique des cartes ;
- renouvellements ;
- activité ;
- messages bonus ;
- boosts disponibles ;
- progression ;
- possibilité de changer une carte manuellement.

---

# CONTRAINTES

Le système doit être :

- entièrement automatique ;
- évolutif ;
- facilement configurable ;
- administrable sans développement futur.

Les noms des cartes, leurs couleurs, leurs conditions d'obtention et leurs récompenses devront être modifiables depuis la console d'administration.

L'objectif est que ce Programme de Fidélité devienne un élément central de l'expérience KELIAA, en valorisant aussi bien la fidélité que l'engagement des membres.
