'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, fieldAria } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { COMPANY_PHONE } from '@/lib/constants';
import { toDateInputValue } from '@/lib/format';
import { formatPhone } from '@/lib/phone';

/**
 * Photo de fond, à déposer dans /public. Si le fichier est absent, seul l'aplat
 * ardoise s'affiche : le hero reste parfaitement lisible, sans image cassée.
 */
const HERO_IMAGE_URL = '/hero-taxi.jpg';

interface ProofPoint {
  figure: string;
  label: string;
}

/** Trois repères qui répondent aux questions posées avant de réserver. */
const PROOF_POINTS: readonly ProofPoint[] = [
  { figure: '24 h/24', label: 'Standard joignable, vols de nuit compris' },
  { figure: '45 min', label: "Du centre-ville jusqu'à Ivato" },
  { figure: '8 places', label: 'Du sedan au van, selon le groupe' },
];

/**
 * Le hero ouvre sur ce que le métier a de plus caractéristique : être pris en
 * charge à une heure convenue. Les quatre champs préremplissent le formulaire complet.
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
    <section className="bg-ardoise relative text-white">
      {/* Damier de toit : l'audace du hero tient dans ce seul filet. */}
      <div className="damier relative z-10" aria-hidden />

      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
        />
        {/*
          Le voile n'est pas décoratif : il garantit le contraste quelle que soit la
          photo. Opaque en bas, il neutralise l'image sous les chiffres ambre, qui
          tomberaient sinon à 2,7:1 sur une carrosserie claire.
        */}
        <div className="from-ardoise/55 via-ardoise/80 to-ardoise absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_23rem] lg:items-start lg:gap-16">
          <div>
            <h1 className="text-display">
              On vous prend
              <br />
              à l&rsquo;heure dite.
            </h1>
            <p className="prose-limite mt-6 text-lg text-white/80">
              Courses urbaines et transferts vers l&rsquo;aéroport d&rsquo;Ivato, 7 jours sur 7
              à Antananarivo. Vous réservez en ligne, un régulateur confirme la course et vous
              affecte un chauffeur.
            </p>

            {/* Complète le formulaire au lieu de le doubler : joindre un humain tout de suite. */}
            <p className="mt-6 text-sm text-white/80">
              Départ dans l&rsquo;heure ou trajet à organiser de vive voix ?{' '}
              <a
                href={`tel:${COMPANY_PHONE}`}
                className="text-donnee text-ambre underline underline-offset-4"
              >
                {formatPhone(COMPANY_PHONE)}
              </a>
            </p>

            {/* Les filets séparent trois informations, ils ne décorent pas. */}
            <dl className="mt-10 border-t border-white/20 sm:grid sm:grid-cols-3">
              {PROOF_POINTS.map((point) => (
                <div
                  key={point.figure}
                  className="border-b border-white/20 py-4 last:border-b-0 sm:border-b-0 sm:border-l sm:px-5 sm:first:border-l-0 sm:first:pl-0 sm:last:pr-0"
                >
                  <dt className="text-donnee text-ambre text-xl">{point.figure}</dt>
                  <dd className="mt-1 text-sm leading-snug text-white/70">{point.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Panneau clair posé sur l'aplat : c'est là que se fait l'action. */}
          <div className="text-ardoise border-t-4 border-ambre bg-white p-5 sm:p-6">
            <p className="text-section">Demander une course</p>
            <p className="text-ardoise-clair mt-1 text-sm">
              Renseignez le trajet, nous complétons vos coordonnées à l&rsquo;étape suivante.
            </p>

            <div className="mt-5 flex flex-col gap-4">
              <Field id="hero-depart" label="Départ">
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
                  placeholder="Aéroport Ivato"
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

              <Button variant="accent" onClick={goToReservation} className="w-full">
                Continuer ma demande
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}