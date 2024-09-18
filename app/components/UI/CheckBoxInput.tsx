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
        className={styles.text} 
        type="checkbox"
        onChange={() => onChange()}
        checked={checked}
      />
      <span className={`${styles.checkmark} ${id==='abc' ? styles.reqCheck : ''}`}></span>
    </label>
  );
};

export default CheckboxInput;