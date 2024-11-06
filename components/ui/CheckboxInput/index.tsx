import React from "react";
import styles from "./checkboxinput.module.css";

interface CheckboxInputProps {
  trendType?: string;
  id: string;
  checked?: boolean;
  onChange: () => void;
}

const CheckboxInput = ({ id, checked, onChange, trendType }: CheckboxInputProps) => {
  return (
    <label className={`${styles.container} ${trendType === "Predicted Spend" ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        id={id}
        type="checkbox"
        disabled={trendType === "Predicted Spend" ? true : false}
        onChange={() => onChange()}
        checked={checked}
      />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default CheckboxInput;
