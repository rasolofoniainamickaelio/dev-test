import { Button } from '@/components/ui/Button';
import { TRANSITION_LABELS } from '@/lib/statusMeta';
import { ALLOWED_TRANSITIONS, RESERVATION_STATUS } from '@/types';
import type { Reservation, ReservationStatus } from '@/types';

interface StatusActionsProps {
  reservation: Reservation;
  isLoading: boolean;
  onRequestTransition: (target: ReservationStatus) => void;
}

function variantFor(target: ReservationStatus) {
  if (target === RESERVATION_STATUS.CANCELLED) {
    return 'danger' as const;
  }
  return target === RESERVATION_STATUS.CONFIRMED ? ('primary' as const) : ('secondary' as const);
}

/**
 * Les boutons sont derives d'ALLOWED_TRANSITIONS : l'UI ne peut pas proposer une
 * action que le service refuserait, et la regle n'est ecrite qu'a un seul endroit.
 */
export function StatusActions({
  reservation,
  isLoading,
  onRequestTransition,
}: StatusActionsProps) {
  const targets = ALLOWED_TRANSITIONS[reservation.status];

  if (targets.length === 0) {
    return (
      <p className="text-ardoise-clair text-sm">
        Cette course est cloturee, son statut n evolue plus.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {targets.map((target) => (
        <Button
          key={target}
          size="sm"
          variant={variantFor(target)}
          disabled={isLoading}
          onClick={() => onRequestTransition(target)}
        >
          {TRANSITION_LABELS[target]}
        </Button>
      ))}
    </div>
  );
}
