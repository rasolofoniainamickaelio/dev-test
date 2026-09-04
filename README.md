# Taxi

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

## Verifications effectuees

- `npm run build` : compilation reussie, 8 routes generees.
- `npm run typecheck` : aucune erreur en mode strict. Aucun `any`, aucun `@ts-ignore`.
- `npm run lint` : aucun avertissement.
- Les invariants du calcul de disponibilite ont ete verifies : detection du chevauchement,
  liberation exacte a la fin de la fenetre de 80 minutes, exclusion par statut administratif,
  croisement capacite/creneau, non-blocage d'une course par elle-meme en re-affectation, et
  neutralite des statuts `PENDING`, `CANCELLED` et `COMPLETED`.
- Contrastes de toutes les paires de couleurs calcules : AA au minimum.
