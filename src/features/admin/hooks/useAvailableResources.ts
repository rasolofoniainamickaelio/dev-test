'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getAvailableDrivers,
  getAvailableVehicles,
  type AvailabilityContext,
} from '@/services/availabilityService';
import { toDisplayMessage } from '@/services/errors';
import {
  listDrivers,
  listReservations,
  listVehicles,
} from '@/services/reservationService';
import type { Driver, Reservation, Vehicle } from '@/types';

interface UseAvailableResourcesResult {
  drivers: Driver[];
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

const EMPTY_CONTEXT: AvailabilityContext = { reservations: [], drivers: [], vehicles: [] };

/**
 * Assemble le contexte a partir des services puis delegue le calcul aux fonctions
 * pures d'availabilityService. Le filtrage sert l'ergonomie ; le service revalide.
 */
export function useAvailableResources(
  reservation: Reservation | null,
): UseAvailableResourcesResult {
  const [context, setContext] = useState<AvailabilityContext>(EMPTY_CONTEXT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reservation) {
      setContext(EMPTY_CONTEXT);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setError(null);

    Promise.all([listReservations(), listDrivers(), listVehicles()])
      .then(([reservations, drivers, vehicles]) => {
        if (isActive) {
          setContext({ reservations, drivers, vehicles });
        }
      })
      .catch((caught: unknown) => {
        if (isActive) {
          setError(toDisplayMessage(caught));
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [reservation]);

  const drivers = useMemo(
    () =>
      reservation
        ? getAvailableDrivers(reservation.scheduledAt, context, {
            ignoreReservationId: reservation.id,
          })
        : [],
    [reservation, context],
  );

  const vehicles = useMemo(
    () =>
      reservation
        ? getAvailableVehicles(reservation.scheduledAt, reservation.passengerCount, context, {
            ignoreReservationId: reservation.id,
          })
        : [],
    [reservation, context],
  );

  return { drivers, vehicles, isLoading, error };
}
