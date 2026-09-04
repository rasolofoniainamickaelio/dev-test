import { COMPANY_PHONE } from '@/lib/constants';
import { formatPhone } from '@/lib/phone';

export function CoverageNotice() {
  return (
    <section className="bg-fond-alt px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-section">Nous joindre</h2>

            <div className="mt-4">
              <p className="border-filet border-t py-2">
                <span className="text-ardoise-clair block text-sm">
                  Standard, 24 h sur 24
                </span>

                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="text-donnee underline"
                >
                  {formatPhone(COMPANY_PHONE)}
                </a>
              </p>

              <p className="border-filet border-t py-2">
                <span className="text-ardoise-clair block text-sm">
                  Bureau
                </span>

                Lot II M 14 bis, Ankorondrano, Antananarivo 101
              </p>

              <p className="border-filet border-t py-2">
                <span className="text-ardoise-clair block text-sm">
                  Reservation en ligne
                </span>

                Reponse d un regulateur sous une heure en journee.
              </p>
            </div>
          </div>
          <div>
            <div className="mt-4 overflow-hidden rounded-xl">
              <iframe
                src="https://www.google.com/maps?q=Lot+II+M+14+bis,+Ankorondrano,+Antananarivo+101,+Madagascar&output=embed"
                width="100%"
                height="350"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation de notre bureau"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}