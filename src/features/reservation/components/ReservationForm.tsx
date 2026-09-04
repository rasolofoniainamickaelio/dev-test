'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Spinner } from '@/components/ui/Spinner';
import { MIN_PASSENGERS } from '@/lib/constants';
import { useCreateReservation } from '../hooks/useCreateReservation';
import {
  reservationFormSchema,
  toCreateReservationInput,
  type ReservationFormValues,
} from '../schemas/reservationSchema';
import { ReservationFormFields } from './ReservationFormFields';
import { ReservationReceipt } from './ReservationReceipt';

export interface ReservationPrefill {
  pickupLocation?: string;
  dropoffLocation?: string;
  date?: string;
  time?: string;
}

interface ReservationFormProps {
  prefill?: ReservationPrefill;
}

function buildDefaultValues(prefill: ReservationPrefill): ReservationFormValues {
  return {
    fullName: '',
    email: '',
    phone: '',
    pickupLocation: prefill.pickupLocation ?? '',
    dropoffLocation: prefill.dropoffLocation ?? '',
    date: prefill.date ?? '',
    time: prefill.time ?? '',
    passengerCount: MIN_PASSENGERS,
    note: '',
  };
}

export function ReservationForm({ prefill = {} }: ReservationFormProps) {
  const { data, isLoading, error, submit } = useCreateReservation();
  const defaultValues = buildDefaultValues(prefill);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  if (data) {
    return <ReservationReceipt reservation={data} onNewRequest={() => reset(defaultValues)} />;
  }

  const onSubmit = handleSubmit(async (values) => {
    await submit(toCreateReservationInput(values));
  });

  // isSubmitting couvre la fenetre entre le clic et la resolution : pas de double envoi.
  const isBusy = isLoading || isSubmitting;

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <ReservationFormFields register={register} errors={errors} />

      {error ? <ErrorNotice message={error} /> : null}

      <div className="border-filet flex flex-wrap items-center gap-4 border-t pt-5">
        <Button type="submit" disabled={isBusy}>
          {isBusy ? 'Envoi en cours' : 'Envoyer ma demande'}
        </Button>
        {isBusy ? <Spinner label="Enregistrement de la demande" /> : null}
      </div>
    </form>
  );
}
