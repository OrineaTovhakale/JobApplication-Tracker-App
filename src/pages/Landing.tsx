import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Landing = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-2xl mb-4">Job Application Tracker</h1>
    <Link to="/register" className="text-blue-500 hover:underline mb-4">
      <Button>Register</Button>
    </Link>
    <br></br>
    <Link to="/login" className="text-blue-500 hover:underline">
      <Button variant="edit" >Login</Button>
    </Link>
  </div>
);

export default Landing;
