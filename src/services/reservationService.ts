import { generateReference } from '@/lib/reference';
import { createSeed } from '@/mocks/seed';
import { useDataStore } from '@/store/dataStore';
import { ALLOWED_TRANSITIONS, RESERVATION_STATUS } from '@/types';
import type {
  Assignment,
  CreateReservationInput,
  Driver,
  Reservation,
  ReservationFilters,
  ReservationStatus,
  Vehicle,
} from '@/types';
import { withLatency } from './delay';
import {
  AssignmentRequiredError,
  InsufficientCapacityError,
  InvalidStatusTransitionError,
  ReservationNotFoundError,
  ResourceUnavailableError,
} from './errors';
import {
  getDriverAvailability,
  getVehicleAvailability,
  type AvailabilityContext,
} from './availabilityService';

/**
 * Couche d'acces aux donnees. La signature est celle d'une vraie API (Promise,
 * latence, erreurs typees) mais aucun appel reseau n'est effectue : les fonctions
 * lisent et ecrivent dans le store Zustand. `async` documente le contrat futur.
 *
 * Substituer un vrai backend consiste a reimplementer ce seul fichier ; ni les
 * hooks ni les composants ne changent.
 */

function readContext(): AvailabilityContext {
  const { reservations, drivers, vehicles } = useDataStore.getState();
  return { reservations, drivers, vehicles };
}

function byCreatedAtDesc(first: Reservation, second: Reservation): number {
  return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
}

function matchesSearch(reservation: Reservation, search: string): boolean {
  const needle = search.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  return (
    reservation.reference.toLowerCase().includes(needle) ||
    reservation.customer.fullName.toLowerCase().includes(needle)
  );
}

function requireReservation(predicate: (item: Reservation) => boolean, label: string) {
  const found = useDataStore.getState().reservations.find(predicate);
  if (!found) {
    throw new ReservationNotFoundError(label);
  }
  return found;
}

function assertTransitionAllowed(from: ReservationStatus, to: ReservationStatus): void {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new InvalidStatusTransitionError(from, to);
  }
}

/**
 * Le filtrage cote UI n'est qu'une commodite : la contrainte de capacite et la
 * disponibilite sont revalidees ici, seul endroit qui fait autorite.
 */
function assertAssignmentUsable(
  reservation: Reservation,
  assignment: Assignment,
  context: AvailabilityContext,
): void {
  const vehicle = context.vehicles.find((item) => item.id === assignment.vehicleId);
  const driver = context.drivers.find((item) => item.id === assignment.driverId);

  if (!vehicle) {
    throw new ResourceUnavailableError('Ce vehicule');
  }
  if (!driver) {
    throw new ResourceUnavailableError('Ce chauffeur');
  }
  if (vehicle.seats < reservation.passengerCount) {
    throw new InsufficientCapacityError(vehicle.seats, reservation.passengerCount);
  }

  const options = { ignoreReservationId: reservation.id };
  if (!getDriverAvailability(driver.id, reservation.scheduledAt, context, options).available) {
    throw new ResourceUnavailableError(driver.fullName);
  }
  if (!getVehicleAvailability(vehicle.id, reservation.scheduledAt, context, options).available) {
    throw new ResourceUnavailableError(`${vehicle.model} (${vehicle.plate})`);
  }
}

export function listReservations(filters: ReservationFilters = {}): Promise<Reservation[]> {
  return withLatency(() =>
    useDataStore
      .getState()
      .reservations.filter(
        (reservation) =>
          (!filters.status || reservation.status === filters.status) &&
          matchesSearch(reservation, filters.search ?? ''),
      )
      .slice()
      .sort(byCreatedAtDesc),
  );
}

export function getReservationByReference(reference: string): Promise<Reservation> {
  return withLatency(() =>
    requireReservation((item) => item.reference === reference, reference),
  );
}

export function createReservation(input: CreateReservationInput): Promise<Reservation> {
  return withLatency(() => {
    const store = useDataStore.getState();
    const existingReferences = new Set(store.reservations.map((item) => item.reference));
    const now = new Date().toISOString();

    const reservation: Reservation = {
      id: `res-${now}-${existingReferences.size}`,
      reference: generateReference(existingReferences),
      customer: input.customer,
      pickupLocation: input.pickupLocation,
      dropoffLocation: input.dropoffLocation,
      scheduledAt: input.scheduledAt,
      passengerCount: input.passengerCount,
      note: input.note,
      status: RESERVATION_STATUS.PENDING,
      assignment: null,
      history: [{ from: null, to: RESERVATION_STATUS.PENDING, at: now }],
      createdAt: now,
      updatedAt: now,
    };

    store.insertReservation(reservation);
    return reservation;
  });
}

export function updateReservationStatus(
  id: string,
  nextStatus: ReservationStatus,
  assignment?: Assignment,
): Promise<Reservation> {
  return withLatency(() => {
    const reservation = requireReservation((item) => item.id === id, id);
    assertTransitionAllowed(reservation.status, nextStatus);

    let nextAssignment = reservation.assignment;

    if (nextStatus === RESERVATION_STATUS.CONFIRMED) {
      if (!assignment) {
        throw new AssignmentRequiredError();
      }
      assertAssignmentUsable(reservation, assignment, readContext());
      nextAssignment = assignment;
    }

    const now = new Date().toISOString();
    const patch: Partial<Reservation> = {
      status: nextStatus,
      assignment: nextAssignment,
      updatedAt: now,
      history: [...reservation.history, { from: reservation.status, to: nextStatus, at: now }],
    };

    useDataStore.getState().patchReservation(id, patch);
    return { ...reservation, ...patch };
  });
}

export function listDrivers(): Promise<Driver[]> {
  return withLatency(() => useDataStore.getState().drivers.slice());
}

export function listVehicles(): Promise<Vehicle[]> {
  return withLatency(() => useDataStore.getState().vehicles.slice());
}

export function resetData(): Promise<void> {
  return withLatency(() => {
    useDataStore.getState().replaceAll(createSeed());
  });
}
