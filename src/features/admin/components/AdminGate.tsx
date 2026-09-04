'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { Field, fieldAria } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { useAdminSession } from '../hooks/useAdminSession';

interface AdminGateProps {
  children: (signOut: () => void) => ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const { isReady, isAuthenticated, signIn, signOut } = useAdminSession();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isReady) {
    return null;
  }

  if (isAuthenticated) {
    return <>{children(signOut)}</>;
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-section">Regulation</h1>
      <p className="text-ardoise-clair mt-2 text-sm">
        Cet espace est reserve aux regulateurs de la compagnie.
      </p>
      <form
        noValidate
        className="mt-6 flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!signIn(password)) {
            setError('Mot de passe incorrect. Le regulateur de garde peut vous le redonner.');
          }
        }}
      >
        <Field id="admin-password" label="Mot de passe">
          <Input
            {...fieldAria('admin-password', Boolean(error), false)}
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(null);
            }}
            autoComplete="current-password"
          />
        </Field>
        {error ? <ErrorNotice message={error} /> : null}
        <Button type="submit">Ouvrir la regulation</Button>
      </form>
    </div>
  );
}
