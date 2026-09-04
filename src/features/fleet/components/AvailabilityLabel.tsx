import { Badge } from '@/components/ui/Badge';
import { formatTime } from '@/lib/format';
import type { AvailabilityResult } from '@/services/availabilityService';

interface AvailabilityLabelProps {
  result: AvailabilityResult;
}

/**
 * Le motif de l'indisponibilite est plus utile qu'un simple "indisponible", et il
 * montre que la disponibilite est calculee sur le creneau, pas relue d'un statut.
 */
export function AvailabilityLabel({ result }: AvailabilityLabelProps) {
  if (result.available) {
    return <Badge tone="confirme" label="Libre sur ce creneau" />;
  }

  switch (result.reason) {
    case 'OFF_DUTY':
      return <Badge tone="neutre" label="En repos" />;
    case 'MAINTENANCE':
      return <Badge tone="annule" label="A l atelier" />;
    case 'BOOKED':
      return (
        <Badge
          tone="attente"
          label={
            result.busyUntil
              ? `En course jusqu a ${formatTime(result.busyUntil)}`
              : 'En course'
          }
        />
      );
    default:
      return <Badge tone="neutre" label="Ressource inconnue" />;
  }
}
