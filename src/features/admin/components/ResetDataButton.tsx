'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { resetData } from '@/services/reservationService';
import { toDisplayMessage } from '@/services/errors';
import { ConfirmDialog } from './ConfirmDialog';

interface ResetDataButtonProps {
  onReset: () => Promise<void> | void;
  onError: (message: string) => void;
}

export function ResetDataButton({ onReset, onError }: ResetDataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await resetData();
      await onReset();
      setIsOpen(false);
    } catch (caught) {
      onError(toDisplayMessage(caught));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        Reinitialiser les donnees
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        isLoading={isLoading}
        title="Reinitialiser les donnees"
        description="Toutes les demandes enregistrees dans ce navigateur sont remplacees par le jeu de demonstration. Les demandes envoyees depuis ce poste seront perdues."
        confirmLabel="Reinitialiser"
        onConfirm={() => void handleConfirm()}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
