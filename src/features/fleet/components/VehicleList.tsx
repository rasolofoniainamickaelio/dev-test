import { getVehicleAvailability } from '@/services/availabilityService';
import type { AvailabilityContext } from '@/services/availabilityService';
import { AvailabilityLabel } from './AvailabilityLabel';

interface VehicleListProps {
  context: AvailabilityContext;
  scheduledAt: string;
}

export function VehicleList({ context, scheduledAt }: VehicleListProps) {
  return (
    <section>
      <h2 className="text-section">Vehicules</h2>
      <ul className="mt-4">
        {context.vehicles.map((vehicle) => (
          <li key={vehicle.id} className="border-filet border-t py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">{vehicle.model}</p>
              <AvailabilityLabel
                result={getVehicleAvailability(vehicle.id, scheduledAt, context)}
              />
            </div>
            <p className="text-donnee text-ardoise-clair mt-1 text-sm">{vehicle.plate}</p>
            <p className="text-ardoise-clair text-sm">{vehicle.seats} places assises</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
