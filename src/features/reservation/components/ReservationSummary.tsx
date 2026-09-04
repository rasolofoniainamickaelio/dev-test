import { Badge } from '@/components/ui/Badge';
import { formatFullDateTime, formatTime, pluralize } from '@/lib/format';
import { formatPhone } from '@/lib/phone';
import { RESERVATION_STATUS_META } from '@/lib/statusMeta';
import type { Reservation } from '@/types';

interface ReservationSummaryProps {
  reservation: Reservation;
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-filet grid gap-1 border-t py-3 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-ardoise-clair text-sm">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

/** Recapitulatif partage : meme rendu apres l'envoi et sur la page de suivi. */
export function ReservationSummary({ reservation }: ReservationSummaryProps) {
  const meta = RESERVATION_STATUS_META[reservation.status];

  return (
    <div>
      <div className="border-filet flex flex-wrap items-baseline justify-between gap-3 border-t-2 border-t-ardoise py-3">
        <p className="text-donnee text-xl">{reservation.reference}</p>
        <Badge tone={meta.tone} label={meta.label} />
      </div>

      <dl>
        <Line label="Prise en charge" value={reservation.pickupLocation} />
        <Line label="Destination" value={reservation.dropoffLocation} />
        <Line
          label="Date et heure"
          value={`${formatFullDateTime(reservation.scheduledAt)}`}
        />
        <Line
          label="Passagers"
          value={`${reservation.passengerCount} ${pluralize(reservation.passengerCount, 'passager', 'passagers')}`}
        />
        <Line label="Nom" value={reservation.customer.fullName} />
        <Line label="Telephone" value={formatPhone(reservation.customer.phone)} />
        <Line label="E-mail" value={reservation.customer.email} />
        {reservation.note ? <Line label="Remarque" value={reservation.note} /> : null}
      </dl>

      <div className="border-filet border-t pt-3">
        <p className="text-ardoise-clair text-sm">
          Demande enregistree le {formatFullDateTime(reservation.createdAt)}, derniere mise a
          jour a {formatTime(reservation.updatedAt)}.
        </p>
      </div>
    </div>
  );
}
