# Taxi Antsiva

Plateforme de reservation pour une compagnie de taxi d'Antananarivo : espace public de
demande et de suivi de course, back-office de regulation. Test technique frontend.

**Toutes les donnees sont fictives et vivent dans le navigateur. L'application n'effectue
aucun appel reseau.** Onglet Reseau vide, fonctionnement hors ligne complet.

---

## Installation

```bash
npm install
npm run dev
```

Ouvrir <http://localhost:3000>.

Scripts disponibles :

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de developpement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint, zero avertissement attendu |
| `npm run typecheck` | `tsc --noEmit` en mode strict |
| `npm run format` | Prettier |

### Acces au back-office

`/admin` — mot de passe **`regulation2026`** (constante `ADMIN_PASSWORD` dans
`src/lib/constants.ts`).

### Reference a tester immediatement

La page `/suivi` accepte `TX-4K9P2M` (course en attente) ou `TX-7T3B8N` (course confirmee).

---

## Stack et justification

| Choix | Pourquoi |
| --- | --- |
| **Next.js 15, App Router, TypeScript strict** | Impose par l'enonce. `strict` complete par `noUncheckedIndexedAccess` et `noUnusedLocals`. |
| **Tailwind CSS v4** | Configuration CSS-first : les tokens de design sont declares dans `@theme` au sein de `globals.css`, au meme endroit que les polices, et deviennent automatiquement des utilitaires. Pas de `tailwind.config.ts`. |
| **Zustand + middleware `persist`** | Impose par l'enonce. Sert de couche de stockage uniquement, sans logique metier. |
| **react-hook-form + zod** | Impose par l'enonce. Le schema zod est aussi la source du type du formulaire (`z.infer`) : aucun type duplique entre validation et formulaire. |
| **Aucune librairie UI** | Impose. Les primitives de `components/ui/` sont ecrites a la main. |
| **Aucune librairie de dates** | `Intl.DateTimeFormat` couvre le formatage et les timestamps couvrent les comparaisons. `date-fns` serait une dependance non justifiee pour trois fonctions. |
| **Polices via `next/font/google`** | Auto-hebergement au build, pas de requete vers Google a l'execution — coherent avec la contrainte « aucun appel reseau ». |

### Trois defauts que j'ai retenus, a discuter

1. **Duree de course forfaitaire** de 60 min + 20 min de battement, identique quelle que
   soit la destination. Sans calcul d'itineraire, toute autre valeur serait arbitraire de la
   meme facon. Une duree variable par type de course se brancherait dans
   `getTripWindow()`, seul endroit concerne.
2. **Tailwind v4** plutot que v3. Passer a v3 consiste a deplacer le bloc `@theme` vers un
   `tailwind.config.ts`.
3. **Nom de la societe** : « Taxi Antsiva », invente faute de nom impose par l'enonce.

---

## Arborescence

```
src/
  app/                       Routing Next.js uniquement, aucune logique metier
    (public)/
      layout.tsx             En-tete et pied de page public
      page.tsx               Vitrine : hero, services, zone desservie
      reservation/page.tsx   Formulaire de demande (lit les parametres du hero)
      suivi/page.tsx         Consultation par reference
    admin/
      layout.tsx             Garde d'acces + navigation du back-office
      page.tsx               Tableau de bord des demandes
      flotte/page.tsx        Chauffeurs et vehicules
    layout.tsx               Polices, lang="fr", lien d'evitement
    globals.css              Tokens de design (@theme) et classes typographiques
    not-found.tsx

  features/                  Logique par domaine fonctionnel
    reservation/{components,hooks,schemas}
    admin/{components,hooks}
    fleet/{components,hooks}
    home/components

  components/ui/             Primitives sans connaissance du domaine
                             Button, Input, Textarea, Select, Field, Badge,
                             Modal, Spinner, EmptyState, ErrorNotice

  services/
    reservationService.ts    Contrat d'API : le seul fichier a reecrire pour un backend
    availabilityService.ts   Calcul de disponibilite, fonctions pures
    errors.ts                Classes d'erreur typees
    delay.ts                 Latence simulee, centralisee

  store/
    dataStore.ts             Zustand + persist. Aucune regle metier.
    useHydrated.ts           Etat de rehydratation, pour eviter la divergence SSR

  mocks/seed.ts              Jeu de donnees initial deterministe
  types/                     reservation.ts, driver.ts, vehicle.ts
  lib/                       constants, format, phone, reference, statusMeta
```

### Regle de dependance

`app → features → services → store → types`, a sens unique.

Cette regle n'est pas qu'une intention : elle est **verifiee par ESLint** via
`no-restricted-imports` applique par repertoire (`eslint.config.mjs`). Un composant `app/`
qui importerait le store, ou une primitive `ui/` qui importerait un service, casse
`npm run lint`.

---

## Couche de donnees

C'est le point central de l'exercice, detaille ici.

### Le principe

Le mock est isole derriere une couche service dont la signature est celle d'une vraie API,
**sans qu'aucun appel reseau ne soit effectue**.

- Les fonctions de `reservationService.ts` sont de simples fonctions TypeScript locales qui
  lisent et ecrivent dans le store Zustand. Elles ne contactent rien.
- Elles retournent des `Promise` avec une latence simulee de 400 ms (`withLatency`), afin
  que les etats `loading`, `error` et `empty` de l'interface soient reels et testables.
- **`async` ne signale pas ici un appel reseau** : c'est le contrat d'interface qui
  permettra de substituer un vrai backend plus tard sans toucher aux composants.
- Le store est un detail d'implementation. Aucun composant ne l'importe pour lire ou muter
  les reservations : tout passe par le service, et le linter le garantit.
- La persistance passe par `localStorage` (middleware `persist`), pour que le recapitulatif
  client et les changements de statut survivent a un rafraichissement.

### Substituabilite

Brancher un vrai backend consiste a reimplementer **le seul fichier
`services/reservationService.ts`**, en remplacant les acces `useDataStore.getState()` par
des `fetch`. Les signatures, les types de retour et les classes d'erreur restent identiques :
ni les hooks, ni les composants, ni les schemas de validation ne changent.

### Jeu de donnees initial

- Deterministe, sans aucun `Math.random()`.
- Les quatre statuts sont representes au premier chargement.
- Les dates sont **relatives a `new Date()`**, jamais codees en dur : le jeu reste coherent
  quelle que soit la date d'ouverture du projet.
- Les references sont fixes, pour que ce README puisse en citer une a tester.
- Un vehicule est en maintenance et un chauffeur au repos, pour que l'exclusion par statut
  administratif soit visible. Un van de 8 places rend la contrainte de capacite
  demonstrable.
- Le bouton **Reinitialiser les donnees** du back-office restaure ce jeu.

### Hydratation

`localStorage` n'existe pas cote serveur. Le store expose `hasHydrated`, positionne dans
`onRehydrateStorage` et exclu de la persistance via `partialize`. Le hook `useHydrated()` le
lit, et toute vue listant des donnees affiche un indicateur de chargement tant qu'il vaut
`false`. Sans cela, le premier rendu client divergerait du rendu SSR.

### Consequences assumees de l'absence de backend

Plutot que de les masquer :

- **Les donnees sont propres au navigateur.** Elles ne sont partagees ni entre postes, ni
  avec une fenetre de navigation privee. Une demande envoyee depuis un poste n'apparait pas
  dans le back-office d'un autre poste.
- **La validation est exclusivement cote client.** Avec un backend, le meme schema zod
  serait execute cote serveur, qui serait alors la seule source de verite. Le fait de n'avoir
  qu'un schema (`reservationSchema.ts`) rend cette duplication triviale.
- **Les regles de transition de statut et de disponibilite sont appliquees cote client.**
  Elles appartiendraient au domaine serveur en production, ou elles seraient les seules a
  faire autorite.

---

## Modele de donnees

Trois entites : `Reservation`, `Driver`, `Vehicle`.

### Statuts

Unions de litteraux derivees d'objets `as const`, jamais de chaines libres.

- Reservation : `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- Chauffeur : `AVAILABLE`, `ON_TRIP`, `OFF_DUTY`
- Vehicule : `AVAILABLE`, `IN_SERVICE`, `MAINTENANCE`

### Transitions

```
PENDING   → CONFIRMED, CANCELLED
CONFIRMED → COMPLETED, CANCELLED
CANCELLED → (terminal)
COMPLETED → (terminal)
```

`ALLOWED_TRANSITIONS` (`types/reservation.ts`) est la **source unique** de cette regle. Le
service la consulte pour rejeter une transition interdite avec une erreur typee
(`InvalidStatusTransitionError`) ; l'interface la consulte pour deriver ses boutons. Elle
n'est donc ecrite qu'a un seul endroit, et l'UI ne peut pas proposer une action que le
service refuserait.

Les transitions vers `CANCELLED` et `COMPLETED` declenchent une confirmation explicite.

### Reference publique

Format `TX-XXXXXX`, alphabet de 32 caracteres sans `0/O` ni `1/I/L` — une reference dictee
au telephone reste sans ambiguite. Environ 1,07 milliard de combinaisons, avec verification
de collision a la generation.

Le client consulte sa course par cette reference, jamais par un identifiant sequentiel.

### Disponibilite calculee

Deux notions volontairement distinctes :

- **Eligibilite** — le statut stocke. Un chauffeur `OFF_DUTY` ou un vehicule `MAINTENANCE`
  est hors jeu, quel que soit le creneau.
- **Occupation** — derivee des reservations `CONFIRMED`. Une ressource est occupee si sa
  fenetre de trajet chevauche celle demandee.

Fenetre : `[scheduledAt, scheduledAt + 60 min + 20 min]`. Chevauchement si
`aStart < bEnd && bStart < aEnd`.

`availabilityService.ts` contient **uniquement des fonctions pures** : elles recoivent leur
contexte (`{ reservations, drivers, vehicles }`) en parametre, ne lisent ni le store ni
l'horloge globale, et sont donc testables isolement.

Le resultat porte un motif (`OFF_DUTY`, `MAINTENANCE`, `BOOKED`) et, pour `BOOKED`, l'heure
de liberation. La vue flotte affiche « En course jusqu'a 14 h 30 » plutot qu'un vague
« indisponible » : l'information est plus utile, et elle montre que le calcul est reel.

**Contrainte metier** : un vehicule dont le nombre de places est inferieur au nombre de
passagers ne peut pas etre affecte. Le filtrage a l'affectation n'est qu'une commodite —
`reservationService` revalide capacite et disponibilite avant d'ecrire, seul endroit qui
fait autorite.

---

## Perimetre couvert

### Espace public

- Page d'accueil : presentation de la societe, quatre services (transfert Ivato, course
  urbaine, mise a disposition, longue distance), zone desservie, coordonnees.
- Formulaire de demande : nom, e-mail, telephone, depart, destination, date, heure,
  passagers, remarque. Validation zod avec messages francais sous chaque champ. Bouton
  desactive pendant l'envoi, double soumission impossible.
- Confirmation : reference mise en evidence, avec la mention de son role.
- Page de suivi : saisie de la reference, recapitulatif complet et statut courant. Reference
  inconnue traitee explicitement.

### Back-office

- Liste triee par date de creation decroissante.
- Compteurs par statut en tete de page.
- Filtre par statut, recherche par nom ou reference.
- Changement de statut limite aux transitions autorisees, avec confirmation pour les actions
  irreversibles.
- Affectation d'un chauffeur et d'un vehicule a la confirmation, limitee aux ressources
  reellement libres sur le creneau et compatibles avec le nombre de passagers.
- Vue flotte avec **selecteur de creneau** : la disponibilite se recalcule pour la date et
  l'heure choisies.
- Bouton de reinitialisation des donnees.
- Garde d'acces par mot de passe.

---

## Problemes identifies

Signales plutot que masques.

### Securite

1. **Le garde `/admin` n'est pas une frontiere de securite.** Le mot de passe est compare
   cote client et se trouve donc dans le bundle JavaScript. C'est un garde d'ergonomie :
   il evite qu'une interface d'entreprise soit ouverte a tous, rien de plus. Avec un
   backend : session serveur, cookie `httpOnly` `SameSite=Strict`, controle d'autorisation
   sur chaque mutation.
2. **L'anti-enumeration par reference est ici symbolique.** Toutes les reservations vivent
   dans le `localStorage` du visiteur : qui a acces au navigateur a deja acces a tout. La
   reference non sequentielle reste la bonne pratique parce qu'elle deviendra le seul
   rempart le jour ou un backend exposera `GET /reservations/:reference` — c'est a ce
   moment-la qu'elle protegera reellement.
3. **Donnees personnelles en clair.** Nom, e-mail et telephone sont stockes sans chiffrement
   ni expiration dans `localStorage`. Acceptable pour des donnees fictives, a ne pas
   reproduire en production.
4. **Validation cote client uniquement.** Detaille plus haut.

### Performance

- Le jeu de donnees est petit, mais deux reflexes conditionnent la maintenabilite : les
  selecteurs Zustand sont fins (aucun composant ne s'abonne au store entier) et le filtrage
  de la liste admin passe par `useMemo`.
- Le calcul de disponibilite est en O(reservations x ressources). Negligeable a cette
  echelle ; en production il descendrait cote base avec un index sur `scheduledAt`.
- `useAvailableResources` recharge le contexte a chaque ouverture du dialogue d'affectation.
  Volontaire : cela garantit que les disponibilites affichees sont a jour. Avec un vrai
  backend, ce serait exactement la requete qu'on voudrait fraiche.

### Maintenabilite

- La duree de course forfaitaire est la simplification la plus discutable du modele. Elle
  est isolee dans deux constantes et une fonction, ce qui rend son remplacement local.
- `getTripWindow` fait aujourd'hui autorite sur la notion d'occupation. Si les durees
  devenaient variables, c'est la signature de cette fonction qui changerait, pas ses
  appelants.

---

## Ce qui serait fait differemment avec un backend reel

- Validation dupliquee cote serveur a partir du meme schema zod, le serveur faisant autorite.
- Table de transitions et calcul de disponibilite deplaces dans le domaine serveur, avec
  verrouillage optimiste sur la reservation pour eviter que deux regulateurs affectent le
  meme chauffeur simultanement.
- Authentification reelle du back-office, avec roles (regulateur, administrateur).
- Recherche et filtrage cote serveur, avec pagination : la liste admin ne tiendra pas en
  memoire au-dela de quelques milliers de courses.
- Notification du client par e-mail ou SMS au changement de statut.
- Journal d'audit des changements de statut (l'historique existe deja dans le modele, mais
  sans auteur : il faudrait y ajouter l'identifiant du regulateur).

---

## Design

Le motif directeur n'est ni la voiture ni la ville : c'est **la feuille de route du
regulateur**, la fiche de dispatch ou chaque course est une ligne, avec l'heure dans une
colonne a gauche. C'est le document qui gouverne le metier.

Consequence structurelle : **aucune carte**. Les listes sont des lignes separees par des
filets, avec une gouttiere horaire a gauche — le premier element que lisent le regulateur
comme le client. Les filets encodent la chronologie, ils ne decorent pas.

**Le rayon de 4 px est reserve aux elements interactifs** (boutons, champs). Il signale
« ceci repond au clic » au lieu de decorer, et distingue la grille du pastiche de journal.

### Couleurs

| Token | Hex | Role |
| --- | --- | --- |
| `ardoise` | `#22303F` | Texte principal, bandeaux pleins |
| `ardoise-clair` | `#5A6B7A` | Texte secondaire, metadonnees |
| `filet` | `#C7CED4` | Filets et separateurs |
| `fond-alt` | `#EDF0F2` | Gouttiere horaire, en-tetes |
| `ambre` | `#E4A11B` | Accent unique : lanterne de toit |
| `vert-route` | `#17694C` | Statut confirmee |
| `rouge-signal` | `#A8271C` | Statut annulee, erreurs |

L'ambre plafonne a 2,23:1 sur blanc : **il ne sert jamais de couleur de texte**, seulement
de remplissage, d'anneau de focus et de filet. Toutes les paires effectivement utilisees
sont a 4,80:1 minimum (AA), la plupart au-dela de 7:1.

Un statut n'est **jamais** signale par la couleur seule : le libelle voyage toujours avec la
teinte, via `lib/statusMeta.ts` — source unique reutilisee a l'identique cote public et
cote admin.

### Typographie

Deux familles aux roles disjoints.

- **Archivo** (variable, axe de chasse) pour tout le texte. Le display est condense a 88 %,
  ce qui evoque le lettrage de signalisation sans caricature.
- **IBM Plex Mono** exclusivement pour les **donnees tabulaires** : heures, references,
  immatriculations, compteurs. Ce sont des colonnes qui doivent s'aligner verticalement
  (`tabular-nums`). Aucune etiquette d'interface n'est en monospace.

Les capitales espacees sont reservees aux en-tetes de colonne de tableau, ou c'est la
convention du genre. Longueur de ligne limitee a 66 caracteres.

### Mobile first

Les styles sont ecrits pour le mobile puis elargis avec `sm:`, `md:`, `lg:`. Chaque ecran a
ete pense a 375 px de large. Cibles tactiles a 44 px minimum.

### Motion

Uniquement en reponse a une action : ouverture d'un dialogue (opacite et 4 px de
translation, 150 ms). Aucune entree en fondu sur les sections, aucune transition au survol
des lignes. `prefers-reduced-motion: reduce` neutralise tout.

---

## Deploiement Vercel

Importer le depot sur Vercel. Le framework est detecte nativement, **aucune configuration
particuliere n'est requise** : ni variable d'environnement, ni commande de build
personnalisee, ni fichier `vercel.json`.

Le projet ne contient volontairement **aucun Dockerfile ni docker-compose** : il n'y a pas
de backend a conteneuriser, et la detection native du framework suffit.

---

## Verifications effectuees

- `npm run build` : compilation reussie, 8 routes generees.
- `npm run typecheck` : aucune erreur en mode strict. Aucun `any`, aucun `@ts-ignore`.
- `npm run lint` : aucun avertissement.
- Les invariants du calcul de disponibilite ont ete verifies : detection du chevauchement,
  liberation exacte a la fin de la fenetre de 80 minutes, exclusion par statut administratif,
  croisement capacite/creneau, non-blocage d'une course par elle-meme en re-affectation, et
  neutralite des statuts `PENDING`, `CANCELLED` et `COMPLETED`.
- Contrastes de toutes les paires de couleurs calcules : AA au minimum.
