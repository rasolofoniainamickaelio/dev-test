'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, fieldAria } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { toDateInputValue } from '@/lib/format';

/**
 * Le hero ouvre sur ce que le metier a de plus caracteristique : etre pris en
 * charge a une heure convenue. Les trois champs preremplissent le formulaire complet.
 */
export function Hero() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const goToReservation = () => {
    const params = new URLSearchParams();
    if (pickupLocation) params.set('depart', pickupLocation);
    if (dropoffLocation) params.set('destination', dropoffLocation);
    if (date) params.set('date', date);
    if (time) params.set('heure', time);
    router.push(`/reservation?${params.toString()}`);
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-14">
        <div>
          <h1 className="text-display">
            On vous prend
            <br />
            a l heure dite.
          </h1>
          <p className="prose-limite mt-5 text-lg">
            Courses urbaines et transferts vers l aeroport d Ivato, 7 jours sur 7 a
            Antananarivo. Vous reservez en ligne, un regulateur confirme la course et vous
            affecte un chauffeur.
          </p>
        </div>

        <div className="bg-ardoise border-l-4 border-ambre p-5 text-white">
          <p className="text-colonne text-white/70">Demander une course</p>
          <div className="mt-4 flex flex-col gap-4 [&_label]:text-white">
            <Field id="hero-depart" label="Depart">
              <Input
                {...fieldAria('hero-depart', false, false)}
                value={pickupLocation}
                onChange={(event) => setPickupLocation(event.target.value)}
                placeholder="Analakely"
              />
            </Field>
            <Field id="hero-destination" label="Destination">
              <Input
                {...fieldAria('hero-destination', false, false)}
                value={dropoffLocation}
                onChange={(event) => setDropoffLocation(event.target.value)}
                placeholder="Aeroport Ivato"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field id="hero-date" label="Date">
                <Input
                  {...fieldAria('hero-date', false, false)}
                  type="date"
                  min={toDateInputValue(new Date())}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </Field>
              <Field id="hero-heure" label="Heure">
                <Input
                  {...fieldAria('hero-heure', false, false)}
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </Field>
            </div>
            <Button
              onClick={goToReservation}
              className="!bg-ambre !text-ardoise hover:!bg-ambre/90 w-full"
            >
              Continuer ma demande
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
