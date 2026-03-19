import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  className?: string;
}



const base: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '0 20px',
  height: '44px',
  borderRadius: 'var(--radius-md)',
  fontSize: '0.9rem',
  fontWeight: '600',
  fontFamily: 'var(--font-sans)',
  letterSpacing: '0.01em',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'all var(--transition)',
  border: '1.5px solid transparent',
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: 'var(--color-indigo)',  color: '#fff' },
  secondary: { background: 'var(--color-surface)', color: 'var(--color-text-primary)', borderColor: 'var(--color-border)' },
  danger:    { background: 'var(--color-red)',      color: '#fff' },
  ghost:     { background: 'transparent',           color: 'var(--color-text-secondary)' },
};

const hoverStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary:   { background: 'var(--color-indigo-dark)' },
  secondary: { borderColor: 'var(--color-indigo)', color: 'var(--color-indigo)', background: 'var(--color-indigo-soft)' },
  danger:    { background: '#b91c1c' },
  ghost:     { background: 'var(--color-bg)', color: 'var(--color-text-primary)' },
};

const Button: React.FC<ButtonProps> = ({
  children, onClick, variant = 'primary', disabled = false, type = 'button', fullWidth = false,
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...base,
        ...variantStyles[variant],
        ...(hovered && !disabled ? hoverStyles[variant] : {}),
        ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
        ...(fullWidth ? { width: '100%' } : {}),
      }}
    >
      {children}
    </button>
  );
};

export default Button;