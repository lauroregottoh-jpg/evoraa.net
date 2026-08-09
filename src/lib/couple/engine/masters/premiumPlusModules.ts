/**
 * Modules Premium Plus V1 — extraits structurés du doc maître PP.
 * Sélectionnés selon dynamique / domaines (pas toute la bibliothèque).
 */

import type { CoupleDimensionId } from "@/lib/couple/questionBank"
import type { CoupleReportBlock } from "@/lib/couple/reportBlocks"
import { callout, fill, h2, ol, p, ul } from "@/lib/couple/engine/masters/formatBlocks"

export type PpModule = {
  id: string
  title: string
  subtitle: string
  /** Domaines qui déclenchent ce module. */
  domains: CoupleDimensionId[]
  /** Tags dynamiques. */
  tags: Array<"securite_avance" | "decision" | "communication" | "connexion" | "finances" | "frontieres" | "conflit">
  blocks: (names: { nameA: string; nameB: string }, securizer: string, advancer: string) => CoupleReportBlock[]
}

export const PREMIUM_PLUS_MODULES: PpModule[] = [
  {
    id: "pp-dynamique-profonde",
    title: "Au-delà des différences : comprendre ce qui se joue entre vous",
    subtitle: "Votre différence de rythme n’est peut-être pas le véritable problème",
    domains: ["finances", "projet_vie", "carriere", "mariage", "enfants"],
    tags: ["securite_avance"],
    blocks: (_n, securizer, advancer) => [
      h2("Comprendre votre dynamique profonde"),
      p(
        `Pris séparément, vos écarts pourraient donner l’impression d’opinions différentes sur plusieurs sujets. Mis en relation, une dynamique plus profonde apparaît souvent : ${securizer} semble avoir davantage besoin de sécurité avant de considérer qu’une étape est mûre ; ${advancer} semble avoir davantage besoin de voir cette étape devenir concrète.`
      ),
      p(
        `Vous ne poursuivez pas forcément deux directions différentes : vous utilisez parfois deux chemins pour la même direction. Lorsque vous ne voyez que le comportement, vous pouvez l’interpréter comme une opposition. Lorsque vous cherchez le besoin derrière le comportement, la prudence de ${securizer} peut devenir une manière de protéger votre avenir, et l’élan de ${advancer} une manière de protéger le projet contre l’immobilisme.`
      ),
      h2("Le cycle qui peut s’installer"),
      p(
        `Imaginez une décision importante. ${advancer} veut savoir quand vous avancez ; ${securizer} demande du temps ; ${advancer} insiste ; ${securizer} ressent davantage de pression. Le danger n’est pas seulement le désaccord initial : c’est de répondre à la réaction émotionnelle de la conversation précédente plutôt qu’au sujet.`
      ),
      callout(
        "À ce moment-là, vous ne cherchez plus seulement quoi faire — chacun cherche à faire comprendre pourquoi sa manière de faire est légitime.",
        "alert"
      ),
    ],
  },
  {
    id: "pp-conditions-pret",
    title: "Exercice Premium Plus — De quoi ai-je besoin pour être prêt ?",
    subtitle: "Transformer une attente vague en condition concrète",
    domains: ["finances", "projet_vie", "mariage", "carriere", "decision"],
    tags: ["securite_avance", "decision"],
    blocks: (_n, securizer, advancer) => [
      h2(`${securizer} — à compléter seul(e)`),
      p(
        `Cet exercice est proposé parce que la notion de sécurité joue un rôle important dans votre fonctionnement. Il ne s’agit pas de demander à ${securizer} de renoncer à la prudence, mais de la rendre claire pour ${advancer}.`
      ),
      fill("Quand je dis « je ne suis pas encore prêt(e) », qu’est-ce que cela signifie réellement pour moi ?"),
      fill("Les trois conditions dont j’ai réellement besoin avant d’avancer sont…"),
      fill("Parmi ces trois conditions, laquelle est réellement indispensable ?"),
      h2(`${advancer} — à compléter seul(e)`),
      fill("Ce que j’ai besoin de voir avancer concrètement, c’est…"),
      fill("Une première étape qui me ferait déjà sentir que le projet existe réellement…"),
      fill("Ce que j’entends parfois quand mon/ma partenaire demande du temps (et ce que j’aimerais entendre à la place)…"),
    ],
  },
  {
    id: "pp-decision-30min",
    title: "Protocole Premium Plus — Une décision en 30 minutes",
    subtitle: "Décider sans se combattre",
    domains: ["decision", "finances", "projet_vie", "carriere", "conflits"],
    tags: ["decision", "securite_avance"],
    blocks: (names) => [
      h2("Les 5 étapes"),
      ol([
        "Nommer le sujet en une phrase (2 min).",
        `${names.nameA} et ${names.nameB} : chacun expose son besoin (pas sa solution) — 90 secondes chacun.`,
        "Reformuler le besoin de l’autre avant de proposer (4 min).",
        "Lister 2 options acceptables pour chacun (8 min).",
        "Choisir une option ou une date de revue — écrire la décision (5 min).",
      ]),
      callout(
        "Règle : pendant le protocole, interdiction de diagnostiquer l’autre (« tu as toujours… »). Parlez du sujet et du besoin.",
        "gold"
      ),
      fill("Décision prise / ou date de revue :"),
    ],
  },
  {
    id: "pp-entendu-voulu",
    title: "Exercice Premium Plus — Ce que j’ai entendu / ce que tu voulais dire",
    subtitle: "Vérifier avant d’interpréter",
    domains: ["communication", "conflits", "emotions"],
    tags: ["communication"],
    blocks: (names) => [
      p(
        "Choisissez une conversation récente. Chacun écrit d’abord ce qu’il a entendu, puis ce qu’il voulait dire. L’écart entre les deux colonnes est souvent le vrai sujet."
      ),
      fill(`${names.nameA} — Ce que j’ai entendu…`),
      fill(`${names.nameA} — Ce que je voulais dire…`),
      fill(`${names.nameB} — Ce que j’ai entendu…`),
      fill(`${names.nameB} — Ce que je voulais dire…`),
      h2("Règle des 3 niveaux"),
      ul([
        "Niveau 1 — les faits",
        "Niveau 2 — ce que j’ai ressenti",
        "Niveau 3 — ce dont j’avais besoin",
      ]),
    ],
  },
  {
    id: "pp-charte-com",
    title: "Exercice Premium Plus — Votre charte de communication",
    subtitle: "Quelques règles simples que vous pouvez réellement tenir",
    domains: ["communication", "conflits"],
    tags: ["communication"],
    blocks: () => [
      fill("Lorsque l’un de nous a besoin de temps avant de répondre, nous nous engageons à…"),
      fill("Lorsque l’un de nous a besoin d’une clarification, nous nous engageons à…"),
      fill("Nous ne terminons jamais une conversation importante seulement par « on verra ». À la place…"),
      fill("Notre signal de pause (mot ou geste)…"),
      callout(
        "Une charte utile tient en une page. Si vous ne pouvez pas la relire en 2 minutes, elle est trop longue.",
        "info"
      ),
    ],
  },
  {
    id: "pp-7j-reconnexion",
    title: "Exercice Premium Plus — Les 7 jours de reconnexion",
    subtitle: "Petits gestes, rythme soutenable",
    domains: ["affection", "intimite", "emotions", "communication"],
    tags: ["connexion"],
    blocks: (names) => [
      p(
        "Pendant 7 jours, chaque partenaire propose un micro-geste de connexion (10 minutes max). Notez ce qui a été reçu — pas seulement ce qui a été offert."
      ),
      ol([
        "Jour 1 — attention sans écran",
        "Jour 2 — une reconnaissance précise",
        "Jour 3 — une question curieuse (pas un contrôle)",
        "Jour 4 — un geste d’affection demandé / offert",
        "Jour 5 — une tâche concrète qui soulage l’autre",
        "Jour 6 — un moment de jeu ou de légèreté",
        "Jour 7 — revue : qu’est-ce qui a vraiment touché ?",
      ]),
      fill(`${names.nameA} — le geste qui m’a le plus touché(e)…`),
      fill(`${names.nameB} — le geste qui m’a le plus touché(e)…`),
    ],
  },
  {
    id: "pp-finances-valeurs",
    title: "Exercice Premium Plus — Notre argent et nos valeurs",
    subtitle: "Relier les chiffres au sens",
    domains: ["finances", "valeurs", "decision"],
    tags: ["finances"],
    blocks: (names) => [
      p(
        "Avant le budget, clarifiez ce que l’argent protège pour chacun. Ensuite seulement, construisez des règles."
      ),
      fill(`${names.nameA} — L’argent me permet surtout de protéger…`),
      fill(`${names.nameB} — L’argent me permet surtout de protéger…`),
      fill("Nos 5 priorités financières communes (ordonnées)…"),
      fill("Avant une grosse dépense, nous nous engageons à…"),
    ],
  },
  {
    id: "pp-frontieres",
    title: "Exercice Premium Plus — Notre carte des frontières",
    subtitle: "Couple, familles, aides, intimité du foyer",
    domains: ["famille", "limites", "roles", "autonomie"],
    tags: ["frontieres"],
    blocks: () => [
      fill("Ce qui doit rester protégé dans notre couple face aux familles…"),
      fill("Notre politique d’aide familiale (quand oui / quand non / comment décider)…"),
      fill("Une situation récente où une frontière a été floue…"),
      fill("Notre règle pour les 30 prochains jours…"),
    ],
  },
  {
    id: "pp-reparation",
    title: "Exercice Premium Plus — Votre première réparation consciente",
    subtitle: "Après une tension : revenir sans humilier",
    domains: ["conflits", "communication", "emotions"],
    tags: ["conflit", "communication"],
    blocks: (names) => [
      ol([
        "Pause si nécessaire (signal convenu).",
        "Chacun nomme un fait + un ressenti + un besoin (pas trois accusations).",
        "Une phrase de réparation sincère (sans « mais »).",
        "Une micro-action de réparation dans les 48 h.",
      ]),
      fill(`${names.nameA} — Ma phrase de réparation…`),
      fill(`${names.nameB} — Ma phrase de réparation…`),
      fill("Notre micro-action de réparation…"),
    ],
  },
]
