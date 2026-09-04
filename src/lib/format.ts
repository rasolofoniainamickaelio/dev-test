import { LOCALE, TIMEZONE } from './constants';

/**
 * Tous les affichages passent par le fuseau d'Antananarivo. Sans cela, une demo
 * lancee depuis une machine reglee sur un autre fuseau afficherait des heures fausses.
 */
const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIMEZONE,
});

const dayMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'short',
  timeZone: TIMEZONE,
});

const fullDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TIMEZONE,
});

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function formatDayMonth(iso: string): string {
  return dayMonthFormatter.format(new Date(iso));
}

export function formatFullDate(iso: string): string {
  return fullDateFormatter.format(new Date(iso));
}

export function formatFullDateTime(iso: string): string {
  return `${formatFullDate(iso)} a ${formatTime(iso)}`;
}

export function combineDateAndTime(date: string, time: string): Date | null {
  if (!date || !time) {
    return null;
  }
  const parsed = new Date(`${date}T${time}:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Valeur par defaut d'un <input type="date"> : aujourd'hui, au format yyyy-mm-dd. */
export function toDateInputValue(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function toTimeInputValue(date: Date): string {
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count > 1 ? plural : singular;
}
