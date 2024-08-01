import React, { useRef } from "react";
import styles from "./EventAdvFilter.module.css";
import CheckboxInput from "../../UI/CheckBoxInput";
import { useTheme } from "@/context";

interface LabelDropdownProps {
  state: string[];
  setState: ([]) => void;
  data: any;
}

const EventAdvFilter = ({ state, setState, data }: LabelDropdownProps) => {
  const {theme} = useTheme()
  const onClickHandler = (value: string) => {
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  return (
    <div className={styles.container} style={{background: theme==="light"?"white":""}}>
      <ul className={styles.list}>
        {data.map((item: any) => (
          <li key={item.slug}>
            <CheckboxInput
              id={item.slug}
              checked={state.includes(item.slug)}
              onChange={() => onClickHandler(item.slug)}
            />
            <label>{item.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventAdvFilter;
