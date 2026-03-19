import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

const config: Record<ToastType, { bg: string; icon: React.ReactNode }> = {
  success: {
    bg: 'var(--color-green)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  },
  error: {
    bg: 'var(--color-red)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  },
  info: {
    bg: 'var(--color-indigo)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  },
};

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3500, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const { bg, icon } = config[type];

  return (
    <div className="animate-slideIn" style={{
      position: 'fixed', top: '24px', right: '24px',
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 18px', background: bg, color: '#fff',
      borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
      zIndex: 1000, maxWidth: '360px', fontSize: '0.9rem', fontWeight: 500,
    }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
    </div>
  );
};

export default Toast;