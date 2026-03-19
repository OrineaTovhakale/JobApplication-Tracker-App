import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import type { ToastType } from '../components/Toast';
import { userService } from '../services';
import { validateUsername, validatePassword } from '../utils';
import { MESSAGES } from '../constants';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');
    const uv = validateUsername(username);
    if (!uv.valid) { setError(uv.error ?? 'Invalid username'); return; }
    const pv = validatePassword(password);
    if (!pv.valid) { setError(pv.error ?? 'Invalid password'); return; }

    setLoading(true);
    try {
      const exists = await userService.checkUsernameExists(username);
      if (exists) { setError(MESSAGES.USERNAME_EXISTS); return; }
      await userService.register(username, password);
      setToast({ message: MESSAGES.REGISTRATION_SUCCESS, type: 'success' });
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleRegister(); };

  return (
    <AuthLayout title="Create account" subtitle="Start tracking your applications today">
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-red-soft)', border: '1px solid #fca5a5', color: 'var(--color-red)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '1.5rem' }}>
        <Input type="text" placeholder="Min. 3 characters" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={handleKeyDown as any} />
        <Input type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown as any} />
      </div>
      <Button variant="primary" onClick={handleRegister} disabled={loading} >
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')} style={{ color: 'var(--color-indigo)', fontWeight: 600, cursor: 'pointer' }}>
          Sign in
        </span>
      </p>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </AuthLayout>
  );
};

export default Registration;