import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { userService } from '../services';
import { validateUsername, validatePassword } from '../utils';
import { MESSAGES } from '../constants';

const Registration = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');

    // Validate inputs
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setError(usernameValidation.error || 'Invalid username');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Invalid password');
      return;
    }

    setLoading(true);
    try {
      const usernameExists = await userService.checkUsernameExists(username);
      
      if (usernameExists) {
        setError(MESSAGES.USERNAME_EXISTS);
        setLoading(false);
        return;
      }

      await userService.register(username, password);
      alert(MESSAGES.REGISTRATION_SUCCESS);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="fade-in min-h-screen bg-white p-6">
      <div className="container mx-auto">
        <div className="card w-full max-w-md mx-auto">
          <div className="flex justify-start mb-12">
            <Button onClick={() => navigate(-1)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300">
              Back
            </Button>
          </div>
          
          <h1 className="mb-12 text-3xl font-bold text-gray-800 text-center">Register</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          <div className="space-y-8">
            <Input 
              type="text" 
              placeholder="Username (min 3 characters)" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Input 
              type="password" 
              placeholder="Password (min 6 characters)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          
          <Button 
            onClick={handleRegister}
            disabled={loading}
            className="mt-12 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Registration;