import React, { ReactNode } from "react";
import styles from "./textinput.module.css";

const InputWrapper = ({
  children,
  title,
  className,
}: {
  children: ReactNode;
  title: string;
  className?: string;
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <label className={styles.input_title}>{title}</label>
      {children}
    </div>
  );
};

export default InputWrapper;
