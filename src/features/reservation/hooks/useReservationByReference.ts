'use client';

import { useCallback, useState } from 'react';
import { normalizeReference } from '@/lib/reference';
import { getReservationByReference } from '@/services/reservationService';
import { toDisplayMessage } from '@/services/errors';
import type { Reservation } from '@/types';

interface UseReservationByReferenceResult {
  data: Reservation | null;
  isLoading: boolean;
  error: string | null;
  lookup: (reference: string) => Promise<void>;
}

export function useReservationByReference(): UseReservationByReferenceResult {
  const [data, setData] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (reference: string) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      setData(await getReservationByReference(normalizeReference(reference)));
    } catch (caught) {
      setError(toDisplayMessage(caught));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, lookup };
}
