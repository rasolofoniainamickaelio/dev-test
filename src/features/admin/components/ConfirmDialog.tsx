'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onCancel}>
      <p className="prose-limite">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Enregistrement' : confirmLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Revenir a la liste
        </Button>
      </div>
    </Modal>
  );
}
