import { formatPhone } from '@/lib/phone';
import { getDriverAvailability } from '@/services/availabilityService';
import type { AvailabilityContext } from '@/services/availabilityService';
import { AvailabilityLabel } from './AvailabilityLabel';

interface DriverListProps {
  context: AvailabilityContext;
  scheduledAt: string;
}

export function DriverList({ context, scheduledAt }: DriverListProps) {
  return (
    <section>
      <h2 className="text-section">Chauffeurs</h2>
      <ul className="mt-4">
        {context.drivers.map((driver) => (
          <li key={driver.id} className="border-filet border-t py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold">{driver.fullName}</p>
              <AvailabilityLabel
                result={getDriverAvailability(driver.id, scheduledAt, context)}
              />
            </div>
            <p className="text-ardoise-clair text-donnee mt-1 text-sm">
              {formatPhone(driver.phone)}
            </p>
            <p className="text-ardoise-clair text-sm">
              Dans la compagnie depuis {new Date(driver.hiredOn).getFullYear()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
