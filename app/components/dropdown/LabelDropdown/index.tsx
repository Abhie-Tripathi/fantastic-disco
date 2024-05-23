import React, { useRef } from "react";
import styles from "./labelDropdown.module.css";
import SearchIcon from "/public/search.svg";
import Image from "next/image";
import { labels } from "@/public/data/categories";
import CheckboxInput from "../../UI/CheckBoxInput";

interface LabelDropdownProps {
  state: string[];
  setState: ([]) => void;
}

const LabelDropdown = ({ state, setState }: LabelDropdownProps) => {
  const onClickHandler = (value: string) => {
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <input type="text" placeholder="Search Labels" />
        <Image src={SearchIcon} alt="searchIcon" />
      </div>
      <ul className={styles.list}>
        {labels?.map((label) => {
          return (
            <li key={label}>
              <CheckboxInput
                id={label}
                checked={state.includes(label)}
                onChange={() => onClickHandler(label)}
              />
              <label htmlFor={label}>{label}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LabelDropdown;