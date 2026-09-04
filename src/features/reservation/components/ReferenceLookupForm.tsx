'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Field, fieldAria } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { useReservationByReference } from '../hooks/useReservationByReference';
import { ReservationSummary } from './ReservationSummary';

interface ReferenceLookupFormProps {
  initialReference?: string;
}

export function ReferenceLookupForm({ initialReference = '' }: ReferenceLookupFormProps) {
  const [reference, setReference] = useState(initialReference);
  const { data, isLoading, error, lookup } = useReservationByReference();

  // Recherche automatique quand on arrive depuis le lien de confirmation.
  useEffect(() => {
    if (initialReference) {
      void lookup(initialReference);
    }
  }, [initialReference, lookup]);

  return (
    <div className="flex flex-col gap-6">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void lookup(reference);
        }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Field
            id="reference"
            label="Reference de la course"
            hint="Six caracteres apres le tiret, par exemple TX-4K9P2M."
          >
            <Input
              {...fieldAria('reference', false, true)}
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="TX-4K9P2M"
              className="text-donnee uppercase"
              autoComplete="off"
            />
          </Field>
        </div>
        <Button type="submit" disabled={isLoading || reference.trim().length === 0}>
          {isLoading ? 'Recherche en cours' : 'Voir ma course'}
        </Button>
      </form>

      {isLoading ? <Spinner label="Recherche de la course" /> : null}
      {error ? <ErrorNotice message={error} /> : null}
      {data ? <ReservationSummary reservation={data} /> : null}
    </div>
  );
}
