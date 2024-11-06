import React from "react";
import { Switch, SwitchProps } from "react-aria-components";
import styles from "./switch.module.css";

interface SwitchButtonProps extends Omit<SwitchProps, "children"> {
  children: React.ReactNode;
}

const SwitchButton = ({ children, ...props }: SwitchButtonProps) => {
  return (
    <Switch className={styles.container} {...props}>
      <div className={styles.indicator} />
      {children}
    </Switch>
  );
};

export default SwitchButton;
