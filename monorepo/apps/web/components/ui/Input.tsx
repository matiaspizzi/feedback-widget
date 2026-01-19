import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  // variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
}

export const Input = ({
  label,
  required = false,
  // variant = 'primary',
  disabled,
  className = '',
  ...props
}: InputProps) => {

  // const variantClass = styles[variant];

  return (
    <>
      {label && <label className={`${styles.InputLabel}`}>
        {label} {required ? '*' : ''}
      </label>}
      <input
        className={`${styles.Input} ${className}`}
        disabled={disabled}
        {...props}
      />
    </>
  );
};