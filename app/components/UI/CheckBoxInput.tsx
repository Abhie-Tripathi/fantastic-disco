import React from "react";
import styles from "./checbox.style.module.css";

interface CheckboxInputProps {
  id: string;
  checked?: boolean;
  onChange: () => void;
}

const CheckboxInput = ({ id, checked, onChange }: CheckboxInputProps) => {
  return (
    <label className={styles.container} >
      <input
        id={id}
        type="checkbox"
        onChange={() => onChange()}
        checked={checked}
      />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default CheckboxInput;