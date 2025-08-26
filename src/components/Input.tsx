import React from 'react';
import styles from './Input.module.css';

interface BaseInputProps {
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

interface InputSpecificProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
}

interface SelectSpecificProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  type: 'select';
}

type InputProps = BaseInputProps & (InputSpecificProps | SelectSpecificProps);

const Input: React.FC<InputProps> = ({ placeholder, type = 'text', value, onChange, ...props }) => {
  if (type === 'select') {
    return (
      <select
        className={styles.select}
        value={value as string}
        onChange={onChange}
        {...(props as SelectSpecificProps)}
      >
        <option value="" disabled>{placeholder}</option>
        <option value="Applied">Applied</option>
        <option value="Interviewed">Interviewed</option>
        <option value="Rejected">Rejected</option>
      </select>
    );
  }

  return (
    <input
      type={type}
      className={styles.input}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...(props as InputSpecificProps)}
    />
  );
};

export default Input;