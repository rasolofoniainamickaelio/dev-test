import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="text-ardoise-clair text-sm">
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-rouge-signal text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Attributs ARIA a passer au controle, derives de l'etat du champ. */
export function fieldAria(id: string, hasError: boolean, hasHint: boolean) {
  const describedBy = [hasHint ? `${id}-hint` : null, hasError ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ');

  return {
    id,
    'aria-invalid': hasError || undefined,
    'aria-describedby': describedBy || undefined,
  } as const;
}
