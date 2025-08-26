import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/users?username=${username}`);
      if (res.data.length && res.data[0].password === password) {
        localStorage.setItem('token', username);
        navigate('/home');
      } else { alert('Invalid credentials'); }
    } catch (err) { alert('Error logging in'); }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl mb-4">Login</h1>
      <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-4" />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
      <Button onClick={handleLogin} className="mb-4">Login</Button>
      <Button onClick={() => navigate('/')} variant="danger">Sign Out</Button>
    </div>
  );
};

export default Login;