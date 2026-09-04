'use client';

import { useCallback, useState } from 'react';
import { createReservation } from '@/services/reservationService';
import { toDisplayMessage } from '@/services/errors';
import type { CreateReservationInput, Reservation } from '@/types';

interface UseCreateReservationResult {
  data: Reservation | null;
  isLoading: boolean;
  error: string | null;
  submit: (input: CreateReservationInput) => Promise<void>;
}

export function useCreateReservation(): UseCreateReservationResult {
  const [data, setData] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (input: CreateReservationInput) => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await createReservation(input));
    } catch (caught) {
      setError(toDisplayMessage(caught));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, submit };
}
