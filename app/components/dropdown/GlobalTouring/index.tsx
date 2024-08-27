import React from "react";
import styles from "./globaltouring.module.css";
import { useTheme } from "@/context";

interface LabelDropdownProps {
  state: string[];
  setState: ([]) => void;
  data: any;
  selectedBrandedEvent: boolean;
  setSelectedBrandedEvent: (val: any) => void;
}

const GlobalTouring = ({
  state,
  setState,
  data,
  selectedBrandedEvent,
  setSelectedBrandedEvent,
}: LabelDropdownProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.sub_item}>
        <div className={styles.checkbox_title}>Branded Event</div>
        <div className={styles.toggle_container}>
          <span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                onChange={() => {
                  setSelectedBrandedEvent((prev: any) => !prev);
                }}
                checked={selectedBrandedEvent}
                disabled={true}
              />
              <span className={styles.slider}></span>
            </label>
          </span>
        </div>
      </div>
      <div className={styles.sub_item}>
        <div className={styles.checkbox_title}>Series Event</div>
        <div className={styles.toggle_container}>
          <span>
            <label className={styles.switch}>
              <input type="checkbox" disabled={true} />
              <span className={styles.slider}></span>
            </label>
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalTouring;
