import { COMPANY_PHONE } from '@/lib/constants';
import { formatPhone } from '@/lib/phone';

const DISTRICTS = [
  'Analakely',
  'Ivandry',
  'Ankorondrano',
  'Andraharo',
  'Ambatobe',
  'Tanjombato',
  'Ambohibao',
  'Aeroport International Ivato',
];

export function CoverageNotice() {
  return (
    <section className="bg-fond-alt px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-section">Zone desservie</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4">
            {DISTRICTS.map((district) => (
              <li key={district} className="border-filet border-t py-2 text-sm">
                {district}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-section">Nous joindre</h2>
          <div className="mt-4">
            <p className="border-filet border-t py-2">
              <span className="text-ardoise-clair block text-sm">Standard, 24 h sur 24</span>
              <a href={`tel:${COMPANY_PHONE}`} className="text-donnee underline">
                {formatPhone(COMPANY_PHONE)}
              </a>
            </p>
            <p className="border-filet border-t py-2">
              <span className="text-ardoise-clair block text-sm">Bureau</span>
              Lot II M 14 bis, Ankorondrano, Antananarivo 101
            </p>
            <p className="border-filet border-t py-2">
              <span className="text-ardoise-clair block text-sm">Reservation en ligne</span>
              Reponse d un regulateur sous une heure en journee.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
