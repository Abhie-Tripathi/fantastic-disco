import React, { useRef } from "react";
import styles from "./label.style.module.css";
import SearchIcon from "/public/search.svg";
import Image from "next/image";
import { labels } from "@/public/data/categories";
import useClickOutside from "@/hooks/useClickOutside";
import CheckboxInput from "@/app/components/UI/CheckBoxInput";

interface LabelDropdownProps {
  className?: string;
  dropdownRef: React.MutableRefObject<null>;
  state: string[];
  setState: ([]) => void;
  onClose: () => void;
}

const LabelDropdown = ({
  className,
  dropdownRef,
  state,
  setState,
  onClose,
}: LabelDropdownProps) => {
  useClickOutside(dropdownRef, () => onClose());

  const onClickHandler = (value: string) => {
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  return (
    <div className={`${styles.options} ${className}`}>
      <div className={styles.heading}>Labels</div>
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