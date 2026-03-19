import React from 'react';
import { JOB_STATUSES } from '../constants';

interface BaseProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  label?: string;
}

interface TextInputProps extends BaseProps, Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  placeholder: string;
  type?: 'text' | 'password' | 'date' | 'email' | string;
}
interface SelectInputProps extends BaseProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  type: 'select';
  placeholder: string;
}

type InputProps = TextInputProps | SelectInputProps;

const baseStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  height: '48px',
  padding: '0 16px',
  background: 'var(--color-surface)',
  border: '1.5px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  fontSize: '0.95rem',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-text-primary)',
  outline: 'none',
  transition: 'border-color var(--transition), box-shadow var(--transition)',
  appearance: 'none' as const,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.78rem',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
  marginBottom: '6px',
};

const Input: React.FC<InputProps> = ({ type = 'text', value, onChange, label, ...rest }) => {
  const [focused, setFocused] = React.useState(false);

  // Get placeholder for text input or select input
  const placeholder = (type === 'select')
    ? (rest as SelectInputProps).placeholder
    : (rest as TextInputProps).placeholder;

  const focusStyle: React.CSSProperties = focused
    ? { borderColor: 'var(--color-border-focus)', boxShadow: '0 0 0 3px rgba(99,102,241,0.12)' }
    : {};

  if (type === 'select') {
    const { ...selectRest } = rest as Omit<SelectInputProps, keyof BaseProps | 'type'>;
    return (
      <div>
        {label && <label style={labelStyle}>{label}</label>}
        <div style={{ position: 'relative' }}>
          <select
            value={value as string}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ ...baseStyle, ...focusStyle, paddingRight: '40px', cursor: 'pointer' }}
            {...selectRest}
          >
            <option value="" disabled>{placeholder}</option>
            {JOB_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <svg
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-muted)' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    );
  }

  const { ...inputRest } = rest as Omit<TextInputProps, keyof BaseProps | 'type'>;
  return (
    <div>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...baseStyle, ...focusStyle }}
        {...inputRest}
      />
    </div>
  );
};

export default Input;