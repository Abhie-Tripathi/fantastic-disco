import * as React from "react";
import styles from "./input.module.css"; // Import the CSS module
import cn from "classnames";
import { Eye, EyeOff } from "geist-icons"; // Example icons for visibility toggle

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  varient?: "medium" | "large";
  isFullWidth?: boolean;
  error?: string | any;
  success?: boolean;
  warning?: boolean;
  info?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  leftLabel?: string;
  rightLabel?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      varient = "medium",
      isFullWidth,
      type,
      label,
      error,
      helperText,
      icon,
      leftLabel,
      rightLabel,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const inputType = type === "password" && isPasswordVisible ? "text" : type;

    return (
      <div
        className={cn(styles.container, { [styles.fullwidth]: isFullWidth })}
      >
        {label && <label className={styles.label}>{label}</label>}
        <div className={cn(styles.inputWrapper, className)}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {leftLabel && <span className={styles.leftLabel}>{leftLabel}</span>}

          <input
            type={inputType}
            className={cn(
              styles.input,
              [styles[varient]],
              {
                [styles.errorInput]: !!error,
              },
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={
              error ? "error-message" : helperText ? "helper-text" : undefined
            }
            {...props}
          />
          {type === "password" && (
            <span
              className={styles.toggleVisibility}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <EyeOff /> : <Eye />}
            </span>
          )}

          {rightLabel && (
            <span className={styles.rightLabel}>{rightLabel}</span>
          )}
        </div>
        {helperText && !error && (
          <p id="helper-text" className={styles.helperText}>
            {helperText}
          </p>
        )}
        {error && (
          <p id="error-message" className={styles.error}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
