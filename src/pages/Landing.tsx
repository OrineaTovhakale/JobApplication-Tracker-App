import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px', borderRadius: '16px',
          background: 'var(--color-indigo)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem', boxShadow: '0 8px 24px rgba(99,102,241,0.28)',
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            <line x1="12" y1="12" x2="12" y2="16"/>
            <line x1="10" y1="14" x2="14" y2="14"/>
          </svg>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '10px', letterSpacing: '-0.02em' }}>
          Job Tracker
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
          Stay on top of every application.<br />Organised, focused, hired.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button variant="primary" onClick={() => navigate('/register')} >
            Create an account
          </Button>
          <Button variant="primary" onClick={() => navigate('/login')} >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;