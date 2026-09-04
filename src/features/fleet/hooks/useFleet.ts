'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AvailabilityContext } from '@/services/availabilityService';
import { toDisplayMessage } from '@/services/errors';
import {
  listDrivers,
  listReservations,
  listVehicles,
} from '@/services/reservationService';

interface UseFleetResult {
  context: AvailabilityContext;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const EMPTY_CONTEXT: AvailabilityContext = { reservations: [], drivers: [], vehicles: [] };

export function useFleet(): UseFleetResult {
  const [context, setContext] = useState<AvailabilityContext>(EMPTY_CONTEXT);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [reservations, drivers, vehicles] = await Promise.all([
        listReservations(),
        listDrivers(),
        listVehicles(),
      ]);
      setContext({ reservations, drivers, vehicles });
    } catch (caught) {
      setError(toDisplayMessage(caught));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { context, isLoading, error, refresh };
}
