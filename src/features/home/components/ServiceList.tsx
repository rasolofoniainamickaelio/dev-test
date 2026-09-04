interface Service {
  duration: string;
  name: string;
  description: string;
}

/** La gouttiere porte la duree indicative : elle informe, elle ne decore pas. */
const SERVICES: readonly Service[] = [
  {
    duration: '45 min',
    name: 'Transfert aeroport Ivato',
    description:
      'Ville vers Ivato ou Ivato vers ville. Le chauffeur suit l horaire du vol et l attente en salle d arrivee est comprise.',
  },
  {
    duration: '20 min',
    name: 'Course urbaine',
    description:
      'Un trajet dans Antananarivo, d Analakely a Ivandry, d Ankorondrano a Ambatobe. Tarif annonce avant le depart.',
  },
  {
    duration: '4 h',
    name: 'Mise a disposition',
    description:
      'Un chauffeur et un vehicule reserves pour une demi-journee ou une journee, avec plusieurs arrets. Formule des entreprises.',
  },
  {
    duration: '1 jour',
    name: 'Longue distance',
    description:
      'Antsirabe, Tamatave, Majunga. Depart depuis Antananarivo, retour a convenir a la reservation.',
  },
];

export function ServiceList() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-section">Nos courses</h2>
        <ul className="mt-6">
          {SERVICES.map((service) => (
            <li key={service.name} className="border-filet gouttiere border-t">
              <div className="bg-fond-alt text-donnee text-ardoise-clair px-2 py-4 text-sm">
                {service.duration}
              </div>
              <div className="py-4 pl-4">
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-ardoise-clair prose-limite mt-1">{service.description}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="border-filet text-ardoise-clair border-t pt-4 text-sm">
          Les durees sont indicatives et varient avec la circulation.
        </p>
      </div>
    </section>
  );
}
