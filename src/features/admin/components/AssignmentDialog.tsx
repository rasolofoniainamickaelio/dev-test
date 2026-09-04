'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Field, fieldAria } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { formatFullDateTime, pluralize } from '@/lib/format';
import type { Assignment, Reservation } from '@/types';
import { useAvailableResources } from '../hooks/useAvailableResources';

interface AssignmentDialogProps {
  reservation: Reservation | null;
  isLoading: boolean;
  error: string | null;
  onConfirm: (assignment: Assignment) => void;
  onCancel: () => void;
}

const NO_SELECTION = '';

export function AssignmentDialog({
  reservation,
  isLoading,
  error,
  onConfirm,
  onCancel,
}: AssignmentDialogProps) {
  const { drivers, vehicles, isLoading: isLoadingResources, error: resourcesError } =
    useAvailableResources(reservation);
  const [driverId, setDriverId] = useState(NO_SELECTION);
  const [vehicleId, setVehicleId] = useState(NO_SELECTION);

  useEffect(() => {
    setDriverId(NO_SELECTION);
    setVehicleId(NO_SELECTION);
  }, [reservation]);

  if (!reservation) {
    return null;
  }

  const hasNoDriver = !isLoadingResources && drivers.length === 0;
  const hasNoVehicle = !isLoadingResources && vehicles.length === 0;
  const canConfirm = driverId !== NO_SELECTION && vehicleId !== NO_SELECTION;

  return (
    <Modal title="Confirmer la course" isOpen onClose={onCancel}>
      <p className="prose-limite">
        {reservation.reference}, {formatFullDateTime(reservation.scheduledAt)}, pour{' '}
        {reservation.passengerCount}{' '}
        {pluralize(reservation.passengerCount, 'passager', 'passagers')}. Seuls les chauffeurs
        et vehicules libres sur ce creneau sont proposes.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {isLoadingResources ? <Spinner label="Recherche des ressources libres" /> : null}

        <Field id="assign-driver" label="Chauffeur">
          <Select
            {...fieldAria('assign-driver', false, false)}
            value={driverId}
            onChange={(event) => setDriverId(event.target.value)}
            disabled={isLoadingResources || hasNoDriver}
          >
            <option value={NO_SELECTION}>Choisir un chauffeur</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.fullName}
              </option>
            ))}
          </Select>
        </Field>

        <Field id="assign-vehicle" label="Vehicule">
          <Select
            {...fieldAria('assign-vehicle', false, false)}
            value={vehicleId}
            onChange={(event) => setVehicleId(event.target.value)}
            disabled={isLoadingResources || hasNoVehicle}
          >
            <option value={NO_SELECTION}>Choisir un vehicule</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.model} — {vehicle.plate} — {vehicle.seats} places
              </option>
            ))}
          </Select>
        </Field>

        {hasNoDriver ? (
          <ErrorNotice message="Aucun chauffeur n est libre sur ce creneau. Vous pouvez traiter la demande plus tard ou l annuler." />
        ) : null}
        {hasNoVehicle ? (
          <ErrorNotice
            message={`Aucun vehicule de ${reservation.passengerCount} places ou plus n est libre sur ce creneau.`}
          />
        ) : null}
        {resourcesError ? <ErrorNotice message={resourcesError} /> : null}
        {error ? <ErrorNotice message={error} /> : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          onClick={() => onConfirm({ driverId, vehicleId })}
          disabled={!canConfirm || isLoading}
        >
          {isLoading ? 'Enregistrement' : 'Confirmer la course'}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Revenir a la liste
        </Button>
      </div>
    </Modal>
  );
}
