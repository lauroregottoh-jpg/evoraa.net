import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "../docs/eva/07_scenarios.md")

/** @type {Array<[string, string, string, string]>} */
const base = [
  ["Je viens de découvrir Keliaa.", "discover", "Accueil + discernement anti-swipe + 1 question d’objectif", "/register ou /how-it-works"],
  ["C’est quoi Keliaa ?", "discover", "Pitch court + charte", "/about"],
  ["Vous êtes une app de dating chrétienne ?", "discover", "Oui, niche assumée + cadre", "/charte"],
  ["Comment je m’inscris ?", "howto_signup", "register → email → onboarding → tests", "/register"],
  ["Faut-il confirmer son email ?", "howto_signup", "Oui ; sinon mot de passe oublié", "/login"],
  ["Je n’arrive pas à me reconnecter", "howto_signup", "Mot de passe oublié ; pas de double compte", "/forgot-password"],
  ["Le test est payant ?", "pricing", "Tests inclus Découverte ; quotas matching/EVA selon plan", "/assessments"],
  ["Combien coûte Alliance ?", "pricing", "5 000 FCFA/mois (ancrage 7 500)", "/billing"],
  ["Il y a un plan à 2 500 ?", "pricing", "Legacy non public", "/pricing"],
  ["Vous avez une offre à 10 000 ?", "pricing", "Pas encore vendue ; futur Souverain", "/pricing"],
  ["Je peux payer Mobile Money ?", "pricing", "Oui via flux paiement (CinetPay/Bictorys)", "/billing"],
  ["J’ai plus de questions Eva", "quota_block", "Quota 3/j Free → Alliance 20/j", "/billing"],
  ["Pourquoi seulement 3 suggestions ?", "quota_block", "Design Découverte ; Alliance 15/j", "/billing"],
  ["Mes messages sont limités", "quota_block", "5 msg/convo Free vs 100 Alliance", "/billing"],
  ["Comment fonctionne le matching ?", "matching", "5 piliers + questionnaires", "/compatibility"],
  ["Pourquoi on me propose cette personne ?", "matching", "Expliquer piliers sans inventer un score", "/compatibility"],
  ["Faut-il finir les tests ?", "matching", "Oui pour fiabiliser", "/assessments"],
  ["Je veux connaître mon style d’attachement", "assessment", "Orient vers Personnalité & stress + nuances", "/assessments/personality"],
  ["Quel test faire en premier ?", "assessment", "Selon objectif : personnalité ou spirituel", "/assessments"],
  ["Je peux refaire un test ?", "assessment", "Oui avec cooldown", "/assessments"],
  ["Je veux préparer mon mariage", "academy", "Présenter 8 modules ; en choisir 1", "/academie-mariage"],
  ["On parle d’argent avant le mariage ?", "academy", "Module finances", "/academie-mariage/finances"],
  ["Comment gérer les beaux-parents ?", "academy", "Module familles", "/academie-mariage/familles"],
  ["Poser des limites, c’est froid ?", "academy", "Module limites / pureté", "/academie-mariage/purete"],
  ["Je souffre énormément", "emotional_pain", "Validation + petit pas ; escalade si crise", "contact@keliaa.org si besoin"],
  ["Je pleure tous les soirs", "emotional_pain", "Écoute + Inspiration ; humain si lourd", "/inspiration"],
  ["Je me sens seul(e)", "emotional_pain", "Présence + boundaries ; pas promis de couple", "/inspiration"],
  ["Je veux retrouver mon ex", "ex_recovery", "Pas de manipulation ; reconstruction", "/academie-mariage/emotions"],
  ["Mon ex m’a trompé(e)", "ex_recovery", "Douleur OK ; pas de vengeance", "contact si besoin"],
  ["Je suis déjà en couple", "already_coupled", "Académie/coaching ; matching secondaire", "/academie-mariage"],
  ["Je suis fiancé(e)", "already_coupled", "Modules projet / finances / familles", "/academie-mariage"],
  ["Je suis marié(e)", "already_coupled", "Académie + coaching email", "contact@keliaa.org"],
  ["Comment prier concrètement ?", "faith_question", "Module foi (régularité)", "/academie-mariage/foi"],
  ["On doit prier ensemble dès le début ?", "faith_question", "Conseil prudent + transparence spirituelle", "/help"],
  ["Je suis chrétien mais peu pratiquant", "faith_question", "Sans jugement ; clarifier vision", "/assessments/spiritual"],
  ["Je veux un coaching", "coaching", "15k / 40k + email", "contact@keliaa.org"],
  ["Vous avez un psy ?", "coaching", "Pas de diagnostic ; coach + pro externe", "contact@keliaa.org"],
  ["On peut envoyer des nudes ?", "out_of_scope", "Non — charte pudeur", "/charte"],
  ["Je veux parler politique", "out_of_scope", "Refus poli", "—"],
  ["Conseil crypto ?", "out_of_scope", "Refus", "—"],
]

const more = [
  ["Je doute de trouver quelqu’un", "emotional_pain", "Patience + profil complet", "/assessments"],
  ["Les gens sont-ils sérieux ici ?", "discover", "Charte + réalisme", "/charte"],
  ["C’est pour quel âge ?", "discover", "Adultes ; onboarding âge", "/register"],
  ["Vous êtes au Togo seulement ?", "discover", "Opéré depuis le Togo ; offre francophone", "/about"],
  ["Combien de temps pour matcher ?", "matching", "Selon profil / tests / quotas", "/compatibility"],
  ["Je veux juste discuter spirituellement", "faith_question", "Aide + académie ; matching optionnel", "/help"],
  ["J’ai peur du mariage", "academy", "Modules émotions + projet", "/academie-mariage"],
  ["On se dispute toujours", "academy", "Module conflits", "/academie-mariage/conflits"],
  ["Il/elle ne communique pas", "academy", "Module dialogue", "/academie-mariage/dialogue"],
  ["Je suis dépendant(e) affectif(ve)", "emotional_pain", "Limites + test personnalité + coaching", "/assessments/personality"],
  ["J’ai été blessé(e) profondément", "emotional_pain", "Escalade douce + ressources humaines", "contact@keliaa.org"],
  ["Je veux supprimer mon compte", "howto_signup", "Orienter réglages / contact si process flou", "/settings"],
  ["Remboursement ?", "pricing", "Non documenté → contact (M05)", "contact@keliaa.org"],
  ["Photo refusée", "discover", "Rappeler règles photo", "/settings"],
  ["À quoi sert le badge Alliance ?", "pricing", "Visibilité / priorité soft", "/billing"],
  ["Inspiration, c’est quoi ?", "academy", "Bibliothèque éditoriale 1/jour", "/inspiration"],
  ["Différence Free / Alliance ?", "pricing", "Tableau quotas", "/pricing"],
  ["Je suis divorcé(e)", "already_coupled", "Accueil + rythme + tests", "/assessments"],
  ["Après une rupture récente", "emotional_pain", "Ralentir matching ; académie émotions", "/academie-mariage/emotions"],
  ["Peur de ne jamais se marier", "emotional_pain", "Recadrer la performance spirituelle", "/help"],
  ["La famille met la pression", "academy", "Module familles + limites", "/academie-mariage/familles"],
  ["Différence de dénomination", "faith_question", "Dialogue prudent ; pas débat", "/assessments/spiritual"],
  ["Longue distance", "matching", "Clarifier vision projet", "/academie-mariage/projet"],
  ["Premier message : que dire ?", "matching", "Icebreaker respectueux", "/messages"],
  ["La personne ne répond plus", "matching", "Limites ; ne pas harceler", "/charte"],
  ["Je compare à Tinder", "discover", "Contraste discernement", "/how-it-works"],
  ["Compatible avec mon église ?", "faith_question", "Cadre perso + pasteur humain", "/charte"],
  ["Comment savoir si je suis prêt(e) ?", "assessment", "Tests + questions discernement", "/assessments"],
  ["Peu de temps", "academy", "Leçons ~10 min de lecture", "/academie-mariage"],
  ["Booster mon profil", "pricing", "Alliance ; boosts avec prudence M14", "/billing"],
  ["Puis-je sans photo ?", "discover", "Photo recommandée ; règles", "/settings"],
  ["Confidentialité des données ?", "discover", "Charte sécurité + contact", "/confidentialite"],
  ["Signaler un membre", "out_of_scope", "Process signalement produit", "UI signalement"],
  ["Eva vs pasteur", "faith_question", "Complémentaire, jamais substitut", "/help"],
  ["Première rencontre IRL", "matching", "Sécurité + discernement", "/charte"],
  ["Parler pureté sans gêne", "academy", "Module limites", "/academie-mariage/purete"],
  ["Budget mariage", "academy", "Finances + projet", "/academie-mariage/finances"],
  ["Je mens sur mon âge", "out_of_scope", "Rappeler sincérité charte", "/charte"],
  ["Créer un faux profil", "out_of_scope", "Non / conséquences", "/charte"],
  ["Partager mon numéro tout de suite", "matching", "Prudence sécurité", "/charte"],
  ["Je suis introverti(e)", "assessment", "Personnalité + rythme messages", "/assessments/personality"],
  ["Partenaire potentiel sans la foi", "faith_question", "Clarifier non-négociables", "/assessments/spiritual"],
  ["Attente qui dure", "faith_question", "Paix intérieure ; FAQ attente", "/help"],
  ["Jalousie", "emotional_pain", "Émotions + limites", "/academie-mariage/emotions"],
  ["Peur de l’engagement", "academy", "Projet + émotions", "/academie-mariage/projet"],
  ["Parents contre la plateforme", "academy", "Familles + respect", "/academie-mariage/familles"],
  ["Suggestions max Alliance ?", "pricing", "15 / jour", "/pricing"],
  ["Messages Alliance = 100 ?", "pricing", "Oui / conversation", "/pricing"],
  ["Eva Alliance = 20 ?", "pricing", "20 questions / jour", "/pricing"],
  ["Académie seulement célibataires ?", "academy", "Utile aussi fiancés", "/academie-mariage"],
  ["Je veux du contenu chaque jour", "academy", "Inspiration 1/jour + académie", "/inspiration"],
  ["Comment aborder les finances en dating ?", "academy", "Intendance + module finances", "/academie-mariage/finances"],
  ["Place de la prière commune ?", "faith_question", "FAQ existante + prudence", "/help"],
  ["Je suis séparé(e)", "already_coupled", "Reconstruction + rythme", "/inspiration"],
  ["Alliance renouvelle comment ?", "pricing", "Renouvellement manuel (sans surprise)", "/billing"],
  ["Support prioritaire Alliance", "pricing", "Oui sur Alliance", "contact@keliaa.org"],
  ["CinetPay / Bictorys ?", "pricing", "Paiements notify ; Stripe non V1", "/billing"],
  ["Score jusqu’à 97–100 % ?", "matching", "Lié à complétion questionnaires", "/assessments"],
  ["EVA lit mes messages ?", "out_of_scope", "analyzeConversations=false aujourd’hui", "/help"],
  ["Je veux un essai Alliance", "pricing", "Expliquer valeur Free puis CTA ; trial exact = M unclear", "/billing"],
]

const lines = [
  "# 07 — Scénarios de conversation (amorce)",
  "",
  "> Environ 100 scénarios structurés. Template en bas pour monter à 200–500.",
  "",
  "Format de chaque entrée : intention, phrase utilisateur, stratégie Eva, CTA.",
  "",
  "---",
  "",
  "## Scénarios",
  "",
]

let id = 1
function add(user, intent, outline, cta) {
  lines.push(`### S${String(id).padStart(3, "0")} | \`${intent}\``)
  lines.push(`**User :** ${user}`)
  lines.push(`**Eva (intention) :** ${outline}`)
  lines.push(`**CTA :** ${cta}`)
  lines.push("")
  id++
}

for (const row of base) add(...row)
for (const row of more) add(...row)

while (id <= 100) {
  add(
    `Variante à personnaliser #${id}`,
    "discover",
    "Réutiliser le template ci-dessous avec une situation réelle du support",
    "outil adapté"
  )
}

lines.push(
  "---",
  "",
  "## Template pour ajouter un scénario",
  "",
  "```md",
  "### Sxxx | `intent`",
  "**User :** (phrase exacte possible)",
  "**Profil probable :** …",
  "**Eva (intention) :** 1) valider 2) insight 3) question/outil",
  "**Ne pas dire :** …",
  "**CTA :** lien ou contact",
  "**Upsell ? :** non | Alliance | coaching",
  "```",
  "",
  "## Comment atteindre 200–500",
  "",
  "1. Logger les vraies questions (`/help`, email support)",
  "2. Varier chaque intent × situations (Togo, diaspora, genre, âge)",
  "3. Ajouter edge cases billing / photo / sanction",
  "4. Faire relire product + pastoral avant freeze",
  ""
)

fs.writeFileSync(out, lines.join("\n"), "utf8")
console.log("Wrote", id - 1, "scenarios ->", out)
