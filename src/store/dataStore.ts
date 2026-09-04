import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEY } from '@/lib/constants';
import { createSeed } from '@/mocks/seed';
import type { DataSnapshot } from '@/mocks/seed';
import type { Reservation } from '@/types';

/**
 * Le store est un detail d'implementation : il ne porte aucune regle metier et
 * n'est jamais importe par un composant. Seuls les services l'appellent.
 */
interface DataState extends DataSnapshot {
  hasHydrated: boolean;
  setHydrated: (value: boolean) => void;
  insertReservation: (reservation: Reservation) => void;
  patchReservation: (id: string, patch: Partial<Reservation>) => void;
  replaceAll: (snapshot: DataSnapshot) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      ...createSeed(),
      hasHydrated: false,
      setHydrated: (value) => set({ hasHydrated: value }),
      insertReservation: (reservation) =>
        set((state) => ({ reservations: [reservation, ...state.reservations] })),
      patchReservation: (id, patch) =>
        set((state) => ({
          reservations: state.reservations.map((reservation) =>
            reservation.id === id ? { ...reservation, ...patch } : reservation,
          ),
        })),
      replaceAll: (snapshot) => set({ ...snapshot }),
    }),
    {
      name: STORAGE_KEY,
      // hasHydrated decrit le cycle de vie du store, pas les donnees : il ne se persiste pas.
      partialize: ({ reservations, drivers, vehicles }) => ({
        reservations,
        drivers,
        vehicles,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
