import React, { useRef } from "react";
import styles from "./index.module.css";
import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import starIcon from "/public/internal/star.svg";
import Image from "next/image";

interface LabelDropdownProps {
  state: string[];
  setState: ([]) => void;
}

const UserRatings = ({ state, setState }: LabelDropdownProps) => {
  const onClickHandler = (value: string) => {
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        <li>
          <CheckboxInput
            id="0-1"
            checked={state.includes("0+")}
            onChange={() => onClickHandler("0+")}
          />
          <label className={styles.label}>
            0 - 1 <Image src={starIcon} alt="rating" width={20} height={20} className={styles.image} />
          </label>
        </li>
        <li>
          <CheckboxInput
            id="1-2"
            checked={state.includes("1+")}
            onChange={() => onClickHandler("1+")}
          />
          <label className={styles.label}>
            1 - 2 <Image src={starIcon} alt="rating" width={20} height={20} className={styles.image} />
          </label>
        </li>
        <li>
          <CheckboxInput
            id="2-3"
            checked={state.includes("2+")}
            onChange={() => onClickHandler("2+")}
          />
          <label className={styles.label}>
            2 - 3 <Image src={starIcon} alt="rating" width={20} height={20} className={styles.image} />
          </label>
        </li>
        <li>
          <CheckboxInput
            id="3-4"
            checked={state.includes("3+")}
            onChange={() => onClickHandler("3+")}
          />
          <label className={styles.label}>
            3 - 4 <Image src={starIcon} alt="rating" width={20} height={20} className={styles.image} />
          </label>
        </li>
        <li>
          <CheckboxInput
            id="4-5"
            checked={state.includes("4+")}
            onChange={() => onClickHandler("4+")}
          />
          <label className={styles.label}>
            4 - 5 <Image src={starIcon} alt="rating" width={20} height={20} className={styles.image} />
          </label>
        </li>
      </ul>
    </div>
  );
};

export default UserRatings;
