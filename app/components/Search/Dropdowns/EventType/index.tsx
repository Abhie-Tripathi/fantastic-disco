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

const EventType = ({ state, setState, setSelectedEventTypeName }: EventStatusProps) => {
  const {theme} = useTheme();
  const onClickHandler = (value: any) => {
    if(state.includes(value.id)) {
      setState(state.filter((data) => data !== value.id))
    } else {
      setState([...state, value.id]);
      setSelectedEventTypeName(value.name);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sub_container}>
        {EventStatusData.map((item) => (
          <div key={item.id} className={styles.checkbox_container}>
            <CheckboxInput
              id={item.id}
              onChange={() => onClickHandler(item)}
              checked={state.includes(item.id)}
            />
            <label htmlFor={item.id}>{item.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventType;
