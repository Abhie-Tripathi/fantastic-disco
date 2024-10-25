import * as React from "react";
import styles from "./button.module.css";
import classnames from "classnames";
import Spinner from "@/components/new-ui/Spinner";
import Link from "next/link";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
  color?: "primary" | "white" | "negative" | "positive";
  size?: "xs" | "sm" | "md" | "lg";
  href?: string;
  disabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
}

export interface BtnWrapper {
  children: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isDisabled?: boolean;
  className?: string;
}

const BtnWrapper = ({
  children,
  href,
  onClick,
  isDisabled,
  className,
  ...rest
}: BtnWrapper) =>
  href ? (
    <Link className={className} href={href} {...rest}>
      {children}
    </Link>
  ) : (
    <button
      className={className}
      disabled={isDisabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      color = "primary",
      size = "md",
      isFullWidth = false,
      isLoading = false,
      children,
      href,
      ...props
    },
    ref
  ) => {
    const buttonClasses = classnames(
      styles[size],
      styles.button,
      { [styles.variant]: variant !== "secondary" },
      {
        [styles[`${color}_color`]]:
          variant !== "secondary" && variant !== "tertiary",
      },
      {
        [styles[`${variant}_${color}`]]:
          variant == "secondary" || variant == "tertiary",
      },
      { [styles.loading]: isLoading },
      { [styles.fullWidth]: isFullWidth },
      className
    );

    const spinnerColor: {
      [key: string]:
        | "primary"
        | "white"
        | "negative"
        | "positive"
        | "notice"
        | "info"
        | "default"
        | undefined;
    } = {
      primary: "white",
      white: "primary",
      negative: "white",
      positive: "white",
    };

    const spinnerSize: {
      [key: string]: "md" | "lg" | "xl" | undefined;
    } = {
      xs: "md",
      sm: "md",
      md: "lg",
      lg: "xl",
    };

    return (
      <BtnWrapper href={href} className={buttonClasses} {...props}>
        <span className={styles.children}>{children}</span>
        {isLoading && (
          <Spinner color={spinnerColor[color]} size={spinnerSize[size]} />
        )}
      </BtnWrapper>
    );
  }
);

Button.displayName = "Button";

export { Button };
