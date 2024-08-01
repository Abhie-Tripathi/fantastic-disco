import React, { useRef } from "react";
import styles from "./labelDropdown.module.css";
import SearchIcon from "/public/search.svg";
import Image from "next/image";
import { labels } from "@/public/data/categories";
import CheckboxInput from "../../UI/CheckBoxInput";
import { useTheme } from "@/context";

interface LabelDropdownProps {
  state: string[];
  setState: ([]) => void;
}

const LabelDropdown = ({ state, setState }: LabelDropdownProps) => {
  const {theme} = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";
  const onClickHandler = (value: string) => {
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };
  return (
    <div className={styles.container} style={{background: theme==="light"?"white":""}}>
      <div className={styles.search} style={{background: theme==="light"?" #f7f7f9":""}}>
        <input type="text" placeholder="Search Labels" />
        <Image src={SearchIcon} alt="searchIcon" className={iconClass} />
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