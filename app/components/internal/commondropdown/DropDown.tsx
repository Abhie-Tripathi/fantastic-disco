import React from "react";
import styles from "./commondropdown.style.module.css";
import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import { useTheme } from "@/context";
import EventStatusData from "@/public/data/eventType.json";

interface EventStatusProps {
  state: string[];
  status:string[];
  setState: ([]) => void;
  selectedEventTypeName?: string;
  setSelectedEventTypeName: (name: string) => void;
}

const EventType = ({ state, setState, setSelectedEventTypeName, status }: EventStatusProps) => {
  const {theme} = useTheme();
  const onClickHandler = (value: any) => {
    // if(state.includes(value)) {
    //   setState(state.filter((data) => data !== value))
    // } else {
    //   setState([...state, value]);
    //   setSelectedEventTypeName(value);
    // }
    if(state.includes(value)) setState([]);
    else setState([value]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sub_container}>
        {status.map((item,ind) => (
          <div key={ind} className={styles.checkbox_container}>
            <CheckboxInput
              id={ind.toString()}
              onChange={() => onClickHandler(item)}
              checked={state.includes(item)}
            />
            <label htmlFor={ind.toString()}>{item}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventType;
