'use client';

import { useMemo } from 'react';
import type { Reservation, ReservationStatus } from '@/types';

export const ALL_STATUSES = 'ALL' as const;
export type StatusFilter = ReservationStatus | typeof ALL_STATUSES;

function matchesSearch(reservation: Reservation, needle: string): boolean {
  if (!needle) {
    return true;
  }
  return (
    reservation.reference.toLowerCase().includes(needle) ||
    reservation.customer.fullName.toLowerCase().includes(needle)
  );
}

/** Le tri par date de creation decroissante est deja garanti par le service. */
export function useFilteredReservations(
  reservations: readonly Reservation[],
  status: StatusFilter,
  search: string,
): Reservation[] {
  return useMemo(() => {
    const needle = search.trim().toLowerCase();
    return reservations.filter(
      (reservation) =>
        (status === ALL_STATUSES || reservation.status === status) &&
        matchesSearch(reservation, needle),
    );
  }, [reservations, status, search]);
}
