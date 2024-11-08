import React from "react";
import styles from "./switchinput.module.css";

interface SwitchInput {
  id?: string;
  checked?: boolean;
  onChange?: () => void;
}

const SwitchInput = ({ id, checked, onChange }: SwitchInput) => {
  return (
    <label className={styles.container}>
      <input type="checkbox" id={id} checked={checked} onChange={onChange} />
      <span className={styles.slider}></span>
    </label>
  );
};

export default SwitchInput;
