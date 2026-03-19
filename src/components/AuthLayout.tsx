import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="fade-in" style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </Button>
        </div>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'var(--color-indigo)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2"/>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>{title}</h1>
            {subtitle && <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;