import { DRIVER_STATUS, RESERVATION_STATUS, VEHICLE_STATUS } from '@/types';
import type { DriverStatus, ReservationStatus, VehicleStatus } from '@/types';

export type BadgeTone = 'attente' | 'confirme' | 'annule' | 'termine' | 'neutre';

export interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

/**
 * Source unique des libelles de statut, partagee par l'espace public et le back-office.
 * Un statut n'est jamais signale par la couleur seule : le libelle voyage avec la teinte.
 */
export const RESERVATION_STATUS_META: Readonly<Record<ReservationStatus, StatusMeta>> = {
  [RESERVATION_STATUS.PENDING]: { label: 'En attente', tone: 'attente' },
  [RESERVATION_STATUS.CONFIRMED]: { label: 'Confirmee', tone: 'confirme' },
  [RESERVATION_STATUS.CANCELLED]: { label: 'Annulee', tone: 'annule' },
  [RESERVATION_STATUS.COMPLETED]: { label: 'Terminee', tone: 'termine' },
};

/** Libelle du bouton qui mene vers ce statut, identique partout dans le parcours. */
export const TRANSITION_LABELS: Readonly<Record<ReservationStatus, string>> = {
  [RESERVATION_STATUS.PENDING]: 'Remettre en attente',
  [RESERVATION_STATUS.CONFIRMED]: 'Confirmer la course',
  [RESERVATION_STATUS.CANCELLED]: 'Annuler la course',
  [RESERVATION_STATUS.COMPLETED]: 'Cloturer la course',
};

export const DRIVER_STATUS_META: Readonly<Record<DriverStatus, StatusMeta>> = {
  [DRIVER_STATUS.AVAILABLE]: { label: 'En service', tone: 'confirme' },
  [DRIVER_STATUS.ON_TRIP]: { label: 'En course', tone: 'attente' },
  [DRIVER_STATUS.OFF_DUTY]: { label: 'Repos', tone: 'neutre' },
};

export const VEHICLE_STATUS_META: Readonly<Record<VehicleStatus, StatusMeta>> = {
  [VEHICLE_STATUS.AVAILABLE]: { label: 'Disponible', tone: 'confirme' },
  [VEHICLE_STATUS.IN_SERVICE]: { label: 'En course', tone: 'attente' },
  [VEHICLE_STATUS.MAINTENANCE]: { label: 'Atelier', tone: 'annule' },
};
