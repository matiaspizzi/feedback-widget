import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  isLoading?: boolean;
}

export const Button = ({
  label,
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const variantClass = styles[variant];

  return (
    <button
      className={`${styles.btn} ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <div className={styles.spinner} />}
      <span>{label}</span>
    </button>
  );
};
