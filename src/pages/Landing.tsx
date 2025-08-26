import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-2xl mb-4">Job Application Tracker</h1>
    <Link to="/register" className="text-blue-500 hover:underline mb-4">Register</Link>
    <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
  </div>
);

export default Landing;