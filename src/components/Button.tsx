import React from 'react';
import styles from'./Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'danger' | 'save' | 'edit';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`${styles.button} ${variant === 'danger' ? styles.danger : variant === 'save' ? styles.save : variant === 'edit' ? styles.edit : ''} ${className}`}
  >
    {children}
  </button>
);

export default Button;