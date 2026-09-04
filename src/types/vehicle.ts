export const VEHICLE_STATUS = {
  AVAILABLE: 'AVAILABLE',
  IN_SERVICE: 'IN_SERVICE',
  MAINTENANCE: 'MAINTENANCE',
} as const;

export type VehicleStatus = (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];

export interface Vehicle {
  id: string;
  model: string;
  plate: string;
  seats: number;
  status: VehicleStatus;
}
