import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import type { Driver, Reservation, ReservationStatus, Vehicle } from '@/types';
import { ReservationRow } from './ReservationRow';

interface ReservationTableProps {
  reservations: readonly Reservation[];
  drivers: readonly Driver[];
  vehicles: readonly Vehicle[];
  hasFilters: boolean;
  isLoading: boolean;
  onRequestTransition: (reservation: Reservation, target: ReservationStatus) => void;
  onClearFilters: () => void;
}

export function ReservationTable({
  reservations,
  drivers,
  vehicles,
  hasFilters,
  isLoading,
  onRequestTransition,
  onClearFilters,
}: ReservationTableProps) {
  if (reservations.length === 0) {
    return hasFilters ? (
      <EmptyState
        title="Aucune demande ne correspond a ce filtre."
        description="Elargissez la recherche pour retrouver les autres courses de la journee."
        action={
          <Button variant="secondary" onClick={onClearFilters}>
            Voir toutes les demandes
          </Button>
        }
      />
    ) : (
      <EmptyState
        title="Aucune demande pour le moment."
        description="Les demandes envoyees depuis le site apparaissent ici des leur reception."
      />
    );
  }

  return (
    <>
      <div className="gouttiere text-colonne text-ardoise-clair border-filet border-b pb-2">
        <span className="text-center">Depart</span>
        <span className="pl-4">Course</span>
      </div>
      <ul>
        {reservations.map((reservation) => (
          <ReservationRow
            key={reservation.id}
            reservation={reservation}
            drivers={drivers}
            vehicles={vehicles}
            isLoading={isLoading}
            onRequestTransition={onRequestTransition}
          />
        ))}
      </ul>
    </>
  );
}
