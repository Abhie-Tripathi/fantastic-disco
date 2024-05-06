import React, { useRef } from "react";
import styles from "./eventstatus.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import { useTheme } from "@/context";
// import CheckboxInput from "@/components/UI/CheckboxInput";

interface EventStatusProps {
  dropdownRef: React.MutableRefObject<null>;
  state: string[];
  setState: ([]) => void;
  onClose: () => void;
}

const EventStatusData = ["Active", "Cancelled", "Postponed", "Predicted"];

const EventStatus = ({dropdownRef ,state, setState, onClose }: EventStatusProps) => {
  const menuNode = useRef(null);
  useClickOutside(dropdownRef, () => onClose());
  const {theme} = useTheme();

  const onClickHandler = (value: string) => {
    console.log(value);
    state.includes(value)
      ? setState(state.filter((data) => data !== value))
      : setState([...state, value]);
  };

  return (
    <div className={`${styles.container} ${theme === 'light' && styles.container_light}`} ref={menuNode}>
      <div className={styles.header_container}>
        <div className={styles.header_title}>Event Status</div>
        <div className={styles.header_button} onClick={() => onClose()}>
          Done
        </div>
      </div>

      <div className={styles.sub_container}>
        {EventStatusData.map((eventStatus) => (
          <div key={eventStatus} className={styles.checkbox_container}>
            <label htmlFor={eventStatus}>{eventStatus}</label>
          </div>
        ))}
      </div>

      <div className={styles.daterange_container}>
        <div className={styles.daterange_title}>CANCELED DATE RANGE</div>
        <div className={styles.daterange}>Any time</div>
        <div className={styles.daterange}>Last hour</div>
        <div className={styles.daterange}>Last 24 hours</div>
        <div className={styles.daterange}>Last 7 days</div>
        <div className={styles.daterange}>Last 30 days</div>
      </div>
    </div>
  );
};

export default EventStatus;