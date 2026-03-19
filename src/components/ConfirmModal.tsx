import React from 'react';
import Button from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(28,25,23,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <div className="card fade-in" style={{ maxWidth: '420px', width: '100%', borderRadius: 'var(--radius-xl)' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'var(--color-red-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 style={{ textAlign: 'center', fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="primary" onClick={onCancel}>{cancelText}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;