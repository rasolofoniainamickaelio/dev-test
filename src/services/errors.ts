export type ServiceErrorCode =
  | 'NOT_FOUND'
  | 'INVALID_TRANSITION'
  | 'ASSIGNMENT_REQUIRED'
  | 'INSUFFICIENT_CAPACITY'
  | 'RESOURCE_UNAVAILABLE';

/**
 * Chaque erreur porte un code stable pour le traitement programmatique et un
 * message francais directement affichable. Aucun catch silencieux dans le projet.
 */
export class ServiceError extends Error {
  readonly code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message: string) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
  }
}

export class ReservationNotFoundError extends ServiceError {
  constructor(reference: string) {
    super(
      'NOT_FOUND',
      `Aucune reservation ne porte la reference ${reference}. Verifiez la reference recue apres l'envoi de votre demande : elle comporte six caracteres apres le tiret.`,
    );
  }
}

export class InvalidStatusTransitionError extends ServiceError {
  constructor(from: string, to: string) {
    super(
      'INVALID_TRANSITION',
      `Une course ${from} ne peut pas passer a ${to}. Rechargez la liste : le statut a peut-etre change entre-temps.`,
    );
  }
}

export class AssignmentRequiredError extends ServiceError {
  constructor() {
    super(
      'ASSIGNMENT_REQUIRED',
      'Confirmer une course exige d affecter un chauffeur et un vehicule.',
    );
  }
}

export class InsufficientCapacityError extends ServiceError {
  constructor(seats: number, passengerCount: number) {
    super(
      'INSUFFICIENT_CAPACITY',
      `Ce vehicule compte ${seats} places pour ${passengerCount} passagers. Choisissez un vehicule plus grand.`,
    );
  }
}

export class ResourceUnavailableError extends ServiceError {
  constructor(label: string) {
    super(
      'RESOURCE_UNAVAILABLE',
      `${label} n est pas disponible sur ce creneau. Choisissez une autre affectation.`,
    );
  }
}

export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

export function toDisplayMessage(error: unknown): string {
  if (isServiceError(error)) {
    return error.message;
  }
  return 'Une erreur inattendue est survenue. Reessayez dans un instant.';
}
