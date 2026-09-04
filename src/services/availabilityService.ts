import {
  MINUTE_IN_MS,
  TRIP_DURATION_MINUTES,
  TURNAROUND_BUFFER_MINUTES,
} from '@/lib/constants';
import { DRIVER_STATUS, RESERVATION_STATUS, VEHICLE_STATUS } from '@/types';
import type { Driver, Reservation, Vehicle } from '@/types';

/**
 * Fonctions pures : elles recoivent tout leur contexte en parametre, ne lisent ni
 * le store ni l'horloge globale, et sont donc testables isolement.
 */
export interface AvailabilityContext {
  reservations: readonly Reservation[];
  drivers: readonly Driver[];
  vehicles: readonly Vehicle[];
}

export interface TripWindow {
  start: number;
  end: number;
}

export type UnavailabilityReason = 'OFF_DUTY' | 'MAINTENANCE' | 'BOOKED' | 'UNKNOWN';

export type AvailabilityResult =
  | { available: true }
  | { available: false; reason: UnavailabilityReason; busyUntil?: string };

interface AvailabilityOptions {
  /** Une reservation ne se bloque pas elle-meme lors d'une re-affectation. */
  ignoreReservationId?: string;
}

const AVAILABLE: AvailabilityResult = { available: true };

export function getTripWindow(scheduledAt: string): TripWindow {
  const start = new Date(scheduledAt).getTime();
  const durationMs = (TRIP_DURATION_MINUTES + TURNAROUND_BUFFER_MINUTES) * MINUTE_IN_MS;
  return { start, end: start + durationMs };
}

function overlaps(first: TripWindow, second: TripWindow): boolean {
  return first.start < second.end && second.start < first.end;
}

/** Seules les courses confirmees immobilisent une ressource. */
function isBlocking(reservation: Reservation, ignoreReservationId?: string): boolean {
  return (
    reservation.status === RESERVATION_STATUS.CONFIRMED &&
    reservation.assignment !== null &&
    reservation.id !== ignoreReservationId
  );
}

function findConflict(
  resourceId: string,
  resourceKey: 'driverId' | 'vehicleId',
  window: TripWindow,
  context: AvailabilityContext,
  options: AvailabilityOptions,
): Reservation | undefined {
  return context.reservations.find((reservation) => {
    if (!isBlocking(reservation, options.ignoreReservationId)) {
      return false;
    }
    if (reservation.assignment?.[resourceKey] !== resourceId) {
      return false;
    }
    return overlaps(window, getTripWindow(reservation.scheduledAt));
  });
}

function busyResult(conflict: Reservation): AvailabilityResult {
  return {
    available: false,
    reason: 'BOOKED',
    busyUntil: new Date(getTripWindow(conflict.scheduledAt).end).toISOString(),
  };
}

export function getDriverAvailability(
  driverId: string,
  scheduledAt: string,
  context: AvailabilityContext,
  options: AvailabilityOptions = {},
): AvailabilityResult {
  const driver = context.drivers.find((candidate) => candidate.id === driverId);
  if (!driver) {
    return { available: false, reason: 'UNKNOWN' };
  }
  if (driver.status === DRIVER_STATUS.OFF_DUTY) {
    return { available: false, reason: 'OFF_DUTY' };
  }

  const conflict = findConflict(
    driverId,
    'driverId',
    getTripWindow(scheduledAt),
    context,
    options,
  );
  return conflict ? busyResult(conflict) : AVAILABLE;
}

export function getVehicleAvailability(
  vehicleId: string,
  scheduledAt: string,
  context: AvailabilityContext,
  options: AvailabilityOptions = {},
): AvailabilityResult {
  const vehicle = context.vehicles.find((candidate) => candidate.id === vehicleId);
  if (!vehicle) {
    return { available: false, reason: 'UNKNOWN' };
  }
  if (vehicle.status === VEHICLE_STATUS.MAINTENANCE) {
    return { available: false, reason: 'MAINTENANCE' };
  }

  const conflict = findConflict(
    vehicleId,
    'vehicleId',
    getTripWindow(scheduledAt),
    context,
    options,
  );
  return conflict ? busyResult(conflict) : AVAILABLE;
}

export function getAvailableDrivers(
  scheduledAt: string,
  context: AvailabilityContext,
  options: AvailabilityOptions = {},
): Driver[] {
  return context.drivers.filter(
    (driver) => getDriverAvailability(driver.id, scheduledAt, context, options).available,
  );
}

/**
 * La capacite fait partie du filtre : proposer un vehicule trop petit serait
 * proposer une affectation que le service refusera de toute facon.
 */
export function getAvailableVehicles(
  scheduledAt: string,
  passengerCount: number,
  context: AvailabilityContext,
  options: AvailabilityOptions = {},
): Vehicle[] {
  return context.vehicles.filter(
    (vehicle) =>
      vehicle.seats >= passengerCount &&
      getVehicleAvailability(vehicle.id, scheduledAt, context, options).available,
  );
}
