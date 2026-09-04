'use client';

import { useCallback, useState } from 'react';
import { toDisplayMessage } from '@/services/errors';
import { updateReservationStatus } from '@/services/reservationService';
import type { Assignment, ReservationStatus } from '@/types';

interface UseUpdateReservationStatusResult {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  update: (
    id: string,
    nextStatus: ReservationStatus,
    assignment?: Assignment,
  ) => Promise<boolean>;
}

export function useUpdateReservationStatus(
  onSuccess: () => Promise<void> | void,
): UseUpdateReservationStatusResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const update = useCallback(
    async (id: string, nextStatus: ReservationStatus, assignment?: Assignment) => {
      setIsLoading(true);
      setError(null);
      try {
        await updateReservationStatus(id, nextStatus, assignment);
        await onSuccess();
        return true;
      } catch (caught) {
        setError(toDisplayMessage(caught));
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess],
  );

  return { isLoading, error, clearError, update };
}
