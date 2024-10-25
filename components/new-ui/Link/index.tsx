import React from "react";
import Link from "next/link";
import classNames from "classnames";
import styles from "./link.module.css";

interface NextLinkProps {
  type?: "anchor" | "action";
  size?: "xs" | "sm" | "md" | "lg";
  color?:
    | "primary"
    | "white"
    | "neutral"
    | "positive"
    | "negative"
    | "notice"
    | "info";
  children: React.ReactNode;
  href: string;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

const NextLink = ({
  type = "anchor",
  size = "md",
  color = "primary",
  disabled,
  children,
  href,
  className,
  ...props
}: NextLinkProps) => {
  return (
    <Link href={href} className={classNames(styles.link, styles[size], styles[color],className)}>
      {children}
    </Link>
  );
};

export default NextLink;
