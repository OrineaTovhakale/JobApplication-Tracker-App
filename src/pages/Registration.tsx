import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:3001/users', { username, password });
      alert('Registered!');
      navigate('/login');
    } catch (err) { alert('Error registering'); }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl mb-4">Register</h1>
      <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-4" />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-4" />
      <Button onClick={handleRegister} className="mb-4">Register</Button>
      <Button onClick={() => navigate('/')} variant="danger">Sign Out</Button>
    </div>
  );
};

export default Registration;