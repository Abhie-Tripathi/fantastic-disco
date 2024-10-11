import React from "react";
import styles from "./squareRadioButton.module.css";

interface SquareRadioButtonProps {
  id: string;
  checked?: boolean;
  onChange: () => void;
}

const SquareRadioButton = ({
  id,
  checked,
  onChange,
}: SquareRadioButtonProps) => {
  console.log(checked);
  return (
    <label className={styles.container}>
      <input
        checked={checked}
        id={id}
        type="radio"
        onChange={() => onChange()}
      />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default SquareRadioButton;
