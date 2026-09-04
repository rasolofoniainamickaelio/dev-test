export const DRIVER_STATUS = {
  AVAILABLE: 'AVAILABLE',
  ON_TRIP: 'ON_TRIP',
  OFF_DUTY: 'OFF_DUTY',
} as const;

export type DriverStatus = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

export interface Driver {
  id: string;
  fullName: string;
  phone: string;
  /** Date d'entree dans la compagnie, affichee dans la vue flotte. */
  hiredOn: string;
  /**
   * Statut administratif, pas occupation. Un chauffeur AVAILABLE peut etre
   * indisponible sur un creneau donne : c'est availabilityService qui tranche.
   */
  status: DriverStatus;
}
