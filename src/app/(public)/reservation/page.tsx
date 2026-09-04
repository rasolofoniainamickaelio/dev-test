import type { Metadata } from 'next';
import { ReservationForm } from '@/features/reservation/components/ReservationForm';
import type { ReservationPrefill } from '@/features/reservation/components/ReservationForm';

export const metadata: Metadata = {
  title: 'Demander une course',
};

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Les parametres viennent du bloc de saisie de la page d'accueil. Les lire ici
 * evite un useSearchParams cote client et garde la page purement compositionnelle.
 */
export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const prefill: ReservationPrefill = {
    pickupLocation: firstValue(params.depart),
    dropoffLocation: firstValue(params.destination),
    date: firstValue(params.date),
    time: firstValue(params.heure),
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-section">Demander une course</h1>
      <p className="text-ardoise-clair prose-limite mt-2">
        Un regulateur confirme la course et vous affecte un chauffeur. Vous recevez une
        reference pour suivre la demande.
      </p>
      <div className="mt-8">
        <ReservationForm prefill={prefill} />
      </div>
    </div>
  );
}
