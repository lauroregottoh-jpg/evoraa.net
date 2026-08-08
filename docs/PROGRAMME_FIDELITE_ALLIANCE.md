# Programme Fidélité Alliance — Référence officielle

> **Statut :** version officielle à mettre en place.  
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
