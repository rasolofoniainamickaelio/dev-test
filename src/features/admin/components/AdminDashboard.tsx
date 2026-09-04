'use client';

import { useCallback, useEffect, useState } from 'react';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Spinner } from '@/components/ui/Spinner';
import { useHydrated } from '@/store/useHydrated';
import { toDisplayMessage } from '@/services/errors';
import { listDrivers, listVehicles } from '@/services/reservationService';
import { TRANSITION_LABELS } from '@/lib/statusMeta';
import { IRREVERSIBLE_STATUSES, RESERVATION_STATUS } from '@/types';
import type { Assignment, Driver, Reservation, ReservationStatus, Vehicle } from '@/types';
import { useReservations } from '../hooks/useReservations';
import {
  ALL_STATUSES,
  useFilteredReservations,
  type StatusFilter,
} from '../hooks/useFilteredReservations';
import { useUpdateReservationStatus } from '../hooks/useUpdateReservationStatus';
import { AssignmentDialog } from './AssignmentDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { ReservationFilters } from './ReservationFilters';
import { ReservationTable } from './ReservationTable';
import { ResetDataButton } from './ResetDataButton';
import { StatusCounters } from './StatusCounters';

interface PendingTransition {
  reservation: Reservation;
  target: ReservationStatus;
}

const IRREVERSIBLE_DESCRIPTIONS: Partial<Record<ReservationStatus, string>> = {
  [RESERVATION_STATUS.CANCELLED]:
    'La course est annulee definitivement et le client voit ce statut sur la page de suivi. Prevenez-le par telephone avant de valider.',
  [RESERVATION_STATUS.COMPLETED]:
    'La course passe en terminee et sort du flux de regulation. Ce statut ne peut plus etre modifie.',
};

export function AdminDashboard() {
  const isHydrated = useHydrated();
  const { data, isLoading, error, refresh } = useReservations();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [fleetError, setFleetError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>(ALL_STATUSES);
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState<PendingTransition | null>(null);

  const { isLoading: isUpdating, error: updateError, clearError, update } =
    useUpdateReservationStatus(refresh);

  const loadFleet = useCallback(async () => {
    try {
      const [nextDrivers, nextVehicles] = await Promise.all([listDrivers(), listVehicles()]);
      setDrivers(nextDrivers);
      setVehicles(nextVehicles);
    } catch (caught) {
      setFleetError(toDisplayMessage(caught));
    }
  }, []);

  useEffect(() => {
    void loadFleet();
  }, [loadFleet]);

  const visible = useFilteredReservations(data, statusFilter, search);
  const hasFilters = statusFilter !== ALL_STATUSES || search.trim().length > 0;

  const closeDialog = () => {
    setPending(null);
    clearError();
  };

  const applyTransition = async (assignment?: Assignment) => {
    if (!pending) {
      return;
    }
    const succeeded = await update(pending.reservation.id, pending.target, assignment);
    if (succeeded) {
      closeDialog();
    }
  };

  const clearFilters = () => {
    setStatusFilter(ALL_STATUSES);
    setSearch('');
  };

  const needsAssignment = pending?.target === RESERVATION_STATUS.CONFIRMED;
  const needsConfirmation =
    pending !== null && IRREVERSIBLE_STATUSES.includes(pending.target);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-section">Demandes recues</h1>
        <ResetDataButton
          onReset={async () => {
            await Promise.all([refresh(), loadFleet()]);
          }}
          onError={setFleetError}
        />
      </div>

      <div className="mt-4">
        <StatusCounters reservations={data} />
      </div>

      <ReservationFilters
        status={statusFilter}
        search={search}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearch}
      />

      {error ? <ErrorNotice message={error} /> : null}
      {fleetError ? <ErrorNotice message={fleetError} /> : null}
      {updateError && !pending ? <ErrorNotice message={updateError} /> : null}

      {!isHydrated || isLoading ? (
        <div className="border-filet border-t py-8">
          <Spinner label="Chargement des demandes" />
        </div>
      ) : (
        <ReservationTable
          reservations={visible}
          drivers={drivers}
          vehicles={vehicles}
          hasFilters={hasFilters}
          isLoading={isUpdating}
          onRequestTransition={(reservation, target) => setPending({ reservation, target })}
          onClearFilters={clearFilters}
        />
      )}

      {needsAssignment ? (
        <AssignmentDialog
          reservation={pending.reservation}
          isLoading={isUpdating}
          error={updateError}
          onConfirm={(assignment) => void applyTransition(assignment)}
          onCancel={closeDialog}
        />
      ) : null}

      {needsConfirmation && pending ? (
        <ConfirmDialog
          isOpen
          isLoading={isUpdating}
          title={TRANSITION_LABELS[pending.target]}
          description={
            IRREVERSIBLE_DESCRIPTIONS[pending.target] ??
            'Ce changement de statut ne peut pas etre annule.'
          }
          confirmLabel={TRANSITION_LABELS[pending.target]}
          onConfirm={() => void applyTransition()}
          onCancel={closeDialog}
        />
      ) : null}
    </div>
  );
}
