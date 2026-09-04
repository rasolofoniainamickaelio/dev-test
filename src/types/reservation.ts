export const RESERVATION_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type ReservationStatus =
  (typeof RESERVATION_STATUS)[keyof typeof RESERVATION_STATUS];

export const RESERVATION_STATUSES: readonly ReservationStatus[] = [
  RESERVATION_STATUS.PENDING,
  RESERVATION_STATUS.CONFIRMED,
  RESERVATION_STATUS.CANCELLED,
  RESERVATION_STATUS.COMPLETED,
];

/**
 * Source unique des transitions autorisees. Le service s'en sert pour rejeter,
 * l'UI pour n'afficher que les actions possibles. CANCELLED et COMPLETED sont terminaux.
 */
export const ALLOWED_TRANSITIONS: Readonly<
  Record<ReservationStatus, readonly ReservationStatus[]>
> = {
  PENDING: [RESERVATION_STATUS.CONFIRMED, RESERVATION_STATUS.CANCELLED],
  CONFIRMED: [RESERVATION_STATUS.COMPLETED, RESERVATION_STATUS.CANCELLED],
  CANCELLED: [],
  COMPLETED: [],
};

/** Actions sans retour possible : l'UI demande une confirmation explicite. */
export const IRREVERSIBLE_STATUSES: readonly ReservationStatus[] = [
  RESERVATION_STATUS.CANCELLED,
  RESERVATION_STATUS.COMPLETED,
];

export interface Customer {
  fullName: string;
  email: string;
  /** Toujours stocke normalise : +261XXXXXXXXX. */
  phone: string;
}

/**
 * Chauffeur et vehicule sont indissociables : une course ne peut pas avoir l'un sans l'autre.
 * Le type interdit donc l'etat incoherent, la ou deux champs optionnels l'auraient permis.
 */
export interface Assignment {
  driverId: string;
  vehicleId: string;
}

export interface StatusChange {
  from: ReservationStatus | null;
  to: ReservationStatus;
  at: string;
}

export interface Reservation {
  /** Identifiant interne, jamais expose dans une URL. */
  id: string;
  /** Identifiant public au format TX-XXXXXX, seul point d'entree du suivi client. */
  reference: string;
  customer: Customer;
  pickupLocation: string;
  dropoffLocation: string;
  scheduledAt: string;
  passengerCount: number;
  note: string | null;
  status: ReservationStatus;
  assignment: Assignment | null;
  history: StatusChange[];
  createdAt: string;
  updatedAt: string;
}

export type CreateReservationInput = Pick<
  Reservation,
  'pickupLocation' | 'dropoffLocation' | 'scheduledAt' | 'passengerCount' | 'note'
> & { customer: Customer };

export interface ReservationFilters {
  status?: ReservationStatus;
  search?: string;
}
