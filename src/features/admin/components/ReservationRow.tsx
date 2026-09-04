import { Badge } from '@/components/ui/Badge';
import { formatDayMonth, formatTime, pluralize } from '@/lib/format';
import { formatPhone } from '@/lib/phone';
import { RESERVATION_STATUS_META } from '@/lib/statusMeta';
import type { Driver, Reservation, ReservationStatus, Vehicle } from '@/types';
import { StatusActions } from './StatusActions';

interface ReservationRowProps {
  reservation: Reservation;
  drivers: readonly Driver[];
  vehicles: readonly Vehicle[];
  isLoading: boolean;
  onRequestTransition: (reservation: Reservation, target: ReservationStatus) => void;
}

function describeAssignment(
  reservation: Reservation,
  drivers: readonly Driver[],
  vehicles: readonly Vehicle[],
): string | null {
  if (!reservation.assignment) {
    return null;
  }
  const driver = drivers.find((item) => item.id === reservation.assignment?.driverId);
  const vehicle = vehicles.find((item) => item.id === reservation.assignment?.vehicleId);
  if (!driver || !vehicle) {
    return null;
  }
  return `${driver.fullName}, ${vehicle.model} ${vehicle.plate}`;
}

export function ReservationRow({
  reservation,
  drivers,
  vehicles,
  isLoading,
  onRequestTransition,
}: ReservationRowProps) {
  const meta = RESERVATION_STATUS_META[reservation.status];
  const assignment = describeAssignment(reservation, drivers, vehicles);

  return (
    <li className="border-filet gouttiere border-t">
      {/* La gouttiere horaire est la colonne que le regulateur lit en premier. */}
      <div className="bg-fond-alt text-donnee px-2 py-4 text-center">
        <span className="block text-base">{formatTime(reservation.scheduledAt)}</span>
        <span className="text-ardoise-clair block text-xs">
          {formatDayMonth(reservation.scheduledAt)}
        </span>
      </div>

      <div className="flex flex-col gap-2 py-4 pl-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-donnee text-sm">{reservation.reference}</span>
          <span className="font-semibold">{reservation.customer.fullName}</span>
          <span className="text-ardoise-clair text-sm">
            {reservation.passengerCount}{' '}
            {pluralize(reservation.passengerCount, 'passager', 'passagers')}
          </span>
        </div>

        <p className="text-sm">
          {reservation.pickupLocation} vers {reservation.dropoffLocation}
        </p>

        <p className="text-ardoise-clair text-sm">
          {formatPhone(reservation.customer.phone)}
        </p>

        {reservation.note ? (
          <p className="border-filet prose-limite border-l-2 pl-3 text-sm italic">
            {reservation.note}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Badge tone={meta.tone} label={meta.label} />
          {assignment ? (
            <span className="text-ardoise-clair text-sm">{assignment}</span>
          ) : null}
        </div>

        <div className="pt-1">
          <StatusActions
            reservation={reservation}
            isLoading={isLoading}
            onRequestTransition={(target) => onRequestTransition(reservation, target)}
          />
        </div>
      </div>
    </li>
  );
}
