import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { userService } from '../services';
import { setCurrentUser, validateUsername, validatePassword } from '../utils';
import { MESSAGES } from '../constants';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    const uv = validateUsername(username);
    if (!uv.valid) { setError(uv.error ?? 'Invalid username'); return; }
    const pv = validatePassword(password);
    if (!pv.valid) { setError(pv.error ?? 'Invalid password'); return; }

    setLoading(true);
    try {
      const users = await userService.login(username, password);
      if (users.length && users[0].password === password) {
        setCurrentUser(username);
        navigate('/home');
      } else {
        setError(MESSAGES.INVALID_CREDENTIALS);
      }
    } catch {
      setError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleLogin(); };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-red-soft)', border: '1px solid #fca5a5', color: 'var(--color-red)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '1.5rem' }}>
        <Input type="text" placeholder="e.g. johndoe" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={handleKeyDown as any} />
        <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKeyDown as any} />
      </div>
      <Button variant="primary" onClick={handleLogin} disabled={loading} >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        No account?{' '}
        <span onClick={() => navigate('/register')} style={{ color: 'var(--color-indigo)', fontWeight: 600, cursor: 'pointer' }}>
          Create one
        </span>
      </p>
    </AuthLayout>
  );
};

export default Login;