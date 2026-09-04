'use client';

import { useCallback, useEffect, useState } from 'react';
import { toDisplayMessage } from '@/services/errors';
import { listReservations } from '@/services/reservationService';
import type { Reservation } from '@/types';

interface UseReservationsResult {
  data: Reservation[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useReservations(): UseReservationsResult {
  const [data, setData] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await listReservations());
    } catch (caught) {
      setError(toDisplayMessage(caught));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { data, isLoading, error, refresh };
}
