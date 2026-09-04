'use client';

import { useState } from 'react';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Field, fieldAria } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { combineDateAndTime, toDateInputValue, toTimeInputValue } from '@/lib/format';
import { useHydrated } from '@/store/useHydrated';
import { useFleet } from '../hooks/useFleet';
import { DriverList } from './DriverList';
import { VehicleList } from './VehicleList';

export function FleetOverview() {
  const isHydrated = useHydrated();
  const { context, isLoading, error } = useFleet();
  const now = new Date();
  const [date, setDate] = useState(toDateInputValue(now));
  const [time, setTime] = useState(toTimeInputValue(now));

  const scheduled = combineDateAndTime(date, time);
  const scheduledAt = (scheduled ?? now).toISOString();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-section">Flotte</h1>
      <p className="text-ardoise-clair prose-limite mt-2">
        La disponibilite est calculee pour le creneau choisi, en croisant les courses
        confirmees. Changez la date ou l heure pour verifier une affectation a venir.
      </p>

      <div className="border-filet mt-5 grid gap-4 border-y py-4 sm:max-w-md sm:grid-cols-2">
        <Field id="fleet-date" label="Date du creneau">
          <Input
            {...fieldAria('fleet-date', false, false)}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </Field>
        <Field id="fleet-time" label="Heure du creneau">
          <Input
            {...fieldAria('fleet-time', false, false)}
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </Field>
      </div>

      {error ? <ErrorNotice message={error} /> : null}

      {!isHydrated || isLoading ? (
        <div className="py-8">
          <Spinner label="Chargement de la flotte" />
        </div>
      ) : (
        <div className="mt-8 grid gap-10 sm:grid-cols-2">
          <DriverList context={context} scheduledAt={scheduledAt} />
          <VehicleList context={context} scheduledAt={scheduledAt} />
        </div>
      )}
    </div>
  );
}
