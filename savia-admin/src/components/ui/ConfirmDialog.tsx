'use client';

import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  variant?: 'danger' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  message,
  variant = 'info',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
}: ConfirmDialogProps) {
  const Icon = variant === 'danger' ? AlertTriangle : Info;

  return (
    <Modal open={open} onClose={onCancel} title={title} icon={Icon} width={520}>
      <p className="text-sm text-text-secondary">{message}</p>
      <div className="flex items-center justify-center gap-3 mt-6">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          loading={loading}
          className={
            variant === 'danger'
              ? 'bg-error hover:bg-error/90 shadow-[0_4px_12px_rgba(244,67,54,0.4)]'
              : ''
          }
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
