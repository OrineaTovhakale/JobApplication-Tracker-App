import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '16px', padding: '2rem', textAlign: 'center',
    }}>
      <p style={{ fontSize: '4rem', lineHeight: 1 }}>🔍</p>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Page not found</h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '300px', lineHeight: 1.6 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>Go home</Button>
    </div>
  );
};

export default NotFound;