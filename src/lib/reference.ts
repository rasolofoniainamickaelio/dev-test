import { REFERENCE_ALPHABET, REFERENCE_BODY_LENGTH, REFERENCE_PREFIX } from './constants';

function randomBody(): string {
  let body = '';
  for (let index = 0; index < REFERENCE_BODY_LENGTH; index += 1) {
    const position = Math.floor(Math.random() * REFERENCE_ALPHABET.length);
    body += REFERENCE_ALPHABET.charAt(position);
  }
  return body;
}

/**
 * 32^6 combinaisons, soit ~1,07 milliard. La verification de collision reste
 * necessaire : elle est triviale ici et deviendra une contrainte d'unicite en base.
 */
export function generateReference(existing: ReadonlySet<string>): string {
  let candidate = `${REFERENCE_PREFIX}${randomBody()}`;
  while (existing.has(candidate)) {
    candidate = `${REFERENCE_PREFIX}${randomBody()}`;
  }
  return candidate;
}

export function normalizeReference(raw: string): string {
  const compact = raw.trim().toUpperCase().replace(/\s/g, '');
  return compact.startsWith(REFERENCE_PREFIX)
    ? compact
    : `${REFERENCE_PREFIX}${compact.replace(/^-/, '')}`;
}
