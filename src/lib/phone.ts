/** Prefixes mobiles malgaches en service : Telma 032, Airtel 033, Orange 034, Blueline 038. */
const MALAGASY_PHONE_PATTERN = /^(?:\+261|0)3[2348]\d{7}$/;
const NON_DIGIT_EXCEPT_PLUS = /[^\d+]/g;

export function normalizePhone(raw: string): string {
  const compact = raw.replace(NON_DIGIT_EXCEPT_PLUS, '');
  if (compact.startsWith('0')) {
    return `+261${compact.slice(1)}`;
  }
  if (compact.startsWith('261')) {
    return `+${compact}`;
  }
  return compact;
}

export function isValidMalagasyPhone(raw: string): boolean {
  return MALAGASY_PHONE_PATTERN.test(raw.replace(NON_DIGIT_EXCEPT_PLUS, ''));
}

/** +261321234567 -> +261 32 12 345 67 */
export function formatPhone(normalized: string): string {
  const digits = normalized.replace(NON_DIGIT_EXCEPT_PLUS, '').replace(/^\+261/, '');
  if (digits.length !== 9) {
    return normalized;
  }
  return `+261 ${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}
