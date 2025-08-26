import React from 'react';
import styles from './Input.module.css';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder, value, onChange, className = '' }) => {
  const baseStyles = 'p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 w-full mb-4'; // Space between forms

  if (type === 'select') {
    return (
      <select value={value} onChange={onChange} className={`${baseStyles} bg-white ${className}`}>
        <option value="">{placeholder}</option>
        <option>Applied</option>
        <option>Interviewed</option>
        <option>Rejected</option>
      </select>
    );
  }

  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} className={`${baseStyles} ${className}`} />
  );
};

export default Input;