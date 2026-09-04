import { Field, fieldAria } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { MAX_NOTE_LENGTH, MAX_PASSENGERS, MIN_PASSENGERS } from '@/lib/constants';
import { toDateInputValue } from '@/lib/format';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { ReservationFormValues } from '../schemas/reservationSchema';

interface ReservationFormFieldsProps {
  register: UseFormRegister<ReservationFormValues>;
  errors: FieldErrors<ReservationFormValues>;
}

export function ReservationFormFields({ register, errors }: ReservationFormFieldsProps) {
  const today = toDateInputValue(new Date());

  return (
    <>
      <fieldset className="flex flex-col gap-4">
        <legend className="text-colonne text-ardoise-clair mb-3">Vos coordonnees</legend>

        <Field id="fullName" label="Nom complet" error={errors.fullName?.message}>
          <Input
            {...fieldAria('fullName', Boolean(errors.fullName), false)}
            {...register('fullName')}
            autoComplete="name"
            placeholder="Rakotomalala Hery"
          />
        </Field>

        <Field id="email" label="Adresse e-mail" error={errors.email?.message}>
          <Input
            {...fieldAria('email', Boolean(errors.email), false)}
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="nom@exemple.mg"
          />
        </Field>

        <Field
          id="phone"
          label="Telephone"
          hint="Le chauffeur vous appelle a ce numero."
          error={errors.phone?.message}
        >
          <Input
            {...fieldAria('phone', Boolean(errors.phone), true)}
            {...register('phone')}
            type="tel"
            autoComplete="tel"
            placeholder="032 12 345 67"
          />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-colonne text-ardoise-clair mb-3">Votre course</legend>

        <Field
          id="pickupLocation"
          label="Lieu de depart"
          error={errors.pickupLocation?.message}
        >
          <Input
            {...fieldAria('pickupLocation', Boolean(errors.pickupLocation), false)}
            {...register('pickupLocation')}
            placeholder="Analakely, rue Ratsimilaho"
          />
        </Field>

        <Field
          id="dropoffLocation"
          label="Destination"
          error={errors.dropoffLocation?.message}
        >
          <Input
            {...fieldAria('dropoffLocation', Boolean(errors.dropoffLocation), false)}
            {...register('dropoffLocation')}
            placeholder="Aeroport International Ivato"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="date" label="Date" error={errors.date?.message}>
            <Input
              {...fieldAria('date', Boolean(errors.date), false)}
              {...register('date')}
              type="date"
              min={today}
            />
          </Field>

          <Field id="time" label="Heure" error={errors.time?.message}>
            <Input
              {...fieldAria('time', Boolean(errors.time), false)}
              {...register('time')}
              type="time"
            />
          </Field>
        </div>

        <Field
          id="passengerCount"
          label="Nombre de passagers"
          hint={`De ${MIN_PASSENGERS} a ${MAX_PASSENGERS} selon le vehicule.`}
          error={errors.passengerCount?.message}
        >
          <Input
            {...fieldAria('passengerCount', Boolean(errors.passengerCount), true)}
            {...register('passengerCount', { valueAsNumber: true })}
            type="number"
            inputMode="numeric"
            min={MIN_PASSENGERS}
            max={MAX_PASSENGERS}
            className="sm:max-w-32"
          />
        </Field>

        <Field
          id="note"
          label="Remarque"
          hint={`Bagages, numero de vol, point de rendez-vous. ${MAX_NOTE_LENGTH} caracteres au maximum.`}
          error={errors.note?.message}
        >
          <Textarea
            {...fieldAria('note', Boolean(errors.note), true)}
            {...register('note')}
            maxLength={MAX_NOTE_LENGTH}
            placeholder="Vol a 17 h 05, deux valises en soute."
          />
        </Field>
      </fieldset>
    </>
  );
}
