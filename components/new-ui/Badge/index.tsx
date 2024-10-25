import * as React from "react";
import styles from "./badge.module.css";
import cn from "classnames";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?:
    | "primary"
    | "positive"
    | "negative"
    | "notice"
    | "information"
    | "neutral";
  size: "sm" | "md" | "lg";
  emphasis?: "subtle" | "intense";
}

function Badge({
  className,
  color = "positive",
  size = "md",
  emphasis = "subtle",
  ...props
}: BadgeProps): JSX.Element {
  const variant = `${color}_${emphasis}`;
  return (
    <div
      className={cn(styles.badge, styles[variant], styles[size], className)}
      role="status"
      {...props}
    />
  );
}

Badge.displayName = "Badge";

export default Badge;
