import type { Metadata } from 'next';
import { ReferenceLookupForm } from '@/features/reservation/components/ReferenceLookupForm';

export const metadata: Metadata = {
  title: 'Suivre ma course',
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function SuiviPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const reference = Array.isArray(params.ref) ? params.ref[0] : params.ref;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-section">Suivre ma course</h1>
      <p className="text-ardoise-clair prose-limite mt-2">
        Saisissez la reference recue apres l envoi de votre demande pour voir le
        recapitulatif et le statut de la course.
      </p>
      <div className="mt-8">
        <ReferenceLookupForm initialReference={reference ?? ''} />
      </div>
    </div>
  );
}
