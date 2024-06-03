import React, { useRef } from "react";
import styles from "./eventstatus.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import { useTheme } from "@/context";

interface EventStatusProps {
  state: string[];
  setState: ([]) => void;
}

const EventStatusData = ["Active", "Cancelled", "Postponed", "Predicted"];

const EventStatus = ({ state, setState }: EventStatusProps) => {
  const {theme} = useTheme();
  const onClickHandler = (value: string) => {
    console.log(value);
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  return (
    <div className={styles.container} style={{background: theme==="light"?"white":""}}>
      <div className={styles.sub_container}>
        {EventStatusData.map((eventStatus) => (
          <div key={eventStatus} className={styles.checkbox_container}>
            <CheckboxInput
              id={eventStatus}
              onChange={() => onClickHandler(eventStatus.toUpperCase())}
              checked={state.includes(eventStatus.toUpperCase())}
            />
            <label htmlFor={eventStatus}>{eventStatus}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventStatus;