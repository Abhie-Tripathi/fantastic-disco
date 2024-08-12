import React from "react";
import styles from "./eventtype.module.css";
import CheckboxInput from "@/app/components/UI/CheckBoxInput";
import { useTheme } from "@/context";
import EventStatusData from "@/public/data/eventType.json";

interface EventStatusProps {
  state: string[];
  setState: ([]) => void;
  selectedEventTypeName?: string;
  setSelectedEventTypeName: (name: string) => void;
}

const EventTypeData = ["Tradeshow", "Conference", "Workshop"];

const EventType = ({ state, setState, setSelectedEventTypeName }: EventStatusProps) => {
  const {theme} = useTheme();
  const onClickHandler = (value: string) => {
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sub_container}>
        {EventTypeData.map((item) => (
          <div key={item} className={styles.checkbox_container}>
            <CheckboxInput
              id={item}
              onChange={() => onClickHandler(item)}
              checked={state.includes(item)}
            />
            <label htmlFor={item}>{item}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventType;
