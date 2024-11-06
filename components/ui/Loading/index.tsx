import React from "react";
import styles from "./loading.module.css";

interface LoadingProps {
  className?: string;
}

const Loading = ({ className }: LoadingProps) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default Loading;
