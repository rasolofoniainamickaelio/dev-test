import { z } from 'zod';
import {
  MAX_NAME_LENGTH,
  MAX_NOTE_LENGTH,
  MAX_PASSENGERS,
  MAX_PLACE_LENGTH,
  MIN_NAME_LENGTH,
  MIN_PASSENGERS,
  MIN_PLACE_LENGTH,
} from '@/lib/constants';
import { combineDateAndTime } from '@/lib/format';
import { isValidMalagasyPhone, normalizePhone } from '@/lib/phone';
import type { CreateReservationInput } from '@/types';

const place = (label: string) =>
  z
    .string()
    .trim()
    .min(MIN_PLACE_LENGTH, { message: `Indiquez ${label}, au moins ${MIN_PLACE_LENGTH} caracteres.` })
    .max(MAX_PLACE_LENGTH, { message: `${MAX_PLACE_LENGTH} caracteres au maximum.` });

/**
 * Ce schema est la seule definition de la validation. Avec un backend reel, le
 * meme fichier serait execute cote serveur, qui ferait alors autorite.
 */
export const reservationFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(MIN_NAME_LENGTH, { message: 'Indiquez votre nom complet.' })
      .max(MAX_NAME_LENGTH, { message: `${MAX_NAME_LENGTH} caracteres au maximum.` }),
    email: z.email({ message: 'Adresse e-mail invalide, par exemple nom@exemple.mg.' }),
    phone: z.string().trim().refine(isValidMalagasyPhone, {
      message: 'Numero malgache attendu : 032, 033, 034 ou 038, par exemple 032 12 345 67.',
    }),
    pickupLocation: place('votre lieu de depart'),
    dropoffLocation: place('votre destination'),
    date: z.string().min(1, { message: 'Choisissez une date.' }),
    time: z.string().min(1, { message: 'Choisissez une heure.' }),
    passengerCount: z
      .number({ message: 'Indiquez le nombre de passagers.' })
      .int({ message: 'Nombre entier attendu.' })
      .min(MIN_PASSENGERS, { message: `Au moins ${MIN_PASSENGERS} passager.` })
      .max(MAX_PASSENGERS, { message: `Nos vehicules accueillent ${MAX_PASSENGERS} passagers au maximum.` }),
    note: z
      .string()
      .trim()
      .max(MAX_NOTE_LENGTH, { message: `${MAX_NOTE_LENGTH} caracteres au maximum.` }),
  })
  .superRefine((values, ctx) => {
    const scheduled = combineDateAndTime(values.date, values.time);
    if (!scheduled) {
      ctx.addIssue({ code: 'custom', path: ['date'], message: 'Date ou heure invalide.' });
      return;
    }
    if (scheduled.getTime() <= Date.now()) {
      ctx.addIssue({
        code: 'custom',
        path: ['time'],
        message: 'Choisissez une date et une heure a venir.',
      });
    }
  });

export type ReservationFormValues = z.infer<typeof reservationFormSchema>;

export function toCreateReservationInput(
  values: ReservationFormValues,
): CreateReservationInput {
  const scheduled = combineDateAndTime(values.date, values.time);
  if (!scheduled) {
    throw new Error('toCreateReservationInput appele sur des valeurs non validees.');
  }

  return {
    customer: {
      fullName: values.fullName,
      email: values.email,
      phone: normalizePhone(values.phone),
    },
    pickupLocation: values.pickupLocation,
    dropoffLocation: values.dropoffLocation,
    scheduledAt: scheduled.toISOString(),
    passengerCount: values.passengerCount,
    note: values.note.length > 0 ? values.note : null,
  };
}
