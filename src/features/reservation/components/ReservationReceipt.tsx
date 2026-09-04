import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { Reservation } from '@/types';
import { ReservationSummary } from './ReservationSummary';

interface ReservationReceiptProps {
  reservation: Reservation;
  onNewRequest: () => void;
}

export function ReservationReceipt({
  reservation,
  onNewRequest,
}: ReservationReceiptProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Bloc plein unique de l'ecran : la reference est ce que le client doit retenir. */}
      <div className="bg-ardoise border-l-4 border-ambre p-5 text-white sm:p-6">
        <p className="text-sm text-white/80">
          Votre demande est enregistree. Notez cette reference, elle vous sert a suivre la
          course.
        </p>
        <p className="text-donnee mt-3 text-3xl tracking-wide sm:text-4xl">
          {reservation.reference}
        </p>
        <p className="mt-3 text-sm text-white/80">
          Un regulateur confirme la course et affecte un chauffeur. Le statut evolue sur la
          page de suivi.
        </p>
      </div>

      <ReservationSummary reservation={reservation} />

      <div className="flex flex-wrap gap-3">
        <Link href={`/suivi?ref=${reservation.reference}`}>
          <Button variant="primary">Suivre ma course</Button>
        </Link>
        <Button variant="secondary" onClick={onNewRequest}>
          Envoyer une autre demande
        </Button>
      </div>
    </div>
  );
}
