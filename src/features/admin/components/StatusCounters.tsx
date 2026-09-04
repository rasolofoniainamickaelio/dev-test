import { RESERVATION_STATUS_META } from '@/lib/statusMeta';
import { RESERVATION_STATUSES } from '@/types';
import type { Reservation, ReservationStatus } from '@/types';

interface StatusCountersProps {
  reservations: readonly Reservation[];
}

function countByStatus(
  reservations: readonly Reservation[],
): Record<ReservationStatus, number> {
  const counters: Record<ReservationStatus, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
    COMPLETED: 0,
  };
  for (const reservation of reservations) {
    counters[reservation.status] += 1;
  }
  return counters;
}

export function StatusCounters({ reservations }: StatusCountersProps) {
  const counters = countByStatus(reservations);

  return (
    <dl className="border-filet grid grid-cols-2 border-y sm:grid-cols-4">
      {RESERVATION_STATUSES.map((status) => (
        <div
          key={status}
          className="border-filet border-r border-b px-3 py-3 last:border-r-0 sm:border-b-0"
        >
          <dt className="text-ardoise-clair text-sm">
            {RESERVATION_STATUS_META[status].label}
          </dt>
          <dd className="text-donnee text-2xl">{counters[status]}</dd>
        </div>
      ))}
    </dl>
  );
}
