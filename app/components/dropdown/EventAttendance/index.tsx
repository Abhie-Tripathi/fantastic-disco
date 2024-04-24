import React, { use, useRef } from "react";
import styles from './eventattend.style.module.css'
import useClickOutside from "@/hooks/useClickOutside";

interface EventAttendanceProps {
  className?: string
  dropdownRef: React.MutableRefObject<null>;
  state: string[];
  setState: ([]) => void;
  onClose: () => void;
}

const EventAttendance = ({
  className,
  dropdownRef,
  state,
  setState,
  onClose,
}: EventAttendanceProps) => {
  const menuNode = useRef(null);
  useClickOutside(dropdownRef, () => onClose());

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header_container}>
        <div className={styles.header_title}>Event Attendance</div>
        <div className={styles.header_button} onClick={() => onClose()}>
          Done
        </div>
      </div>

      <div className={styles.sub_container}>
        <div className={styles.input_container}>
          <div className={styles.input_title}>From</div>
          <input
            placeholder="0"
            value={state[0]}
            onChange={(e) => setState([e.target.value, state[1]])}
          />
        </div>
        <div className={styles.separator}></div>
        <div className={styles.input_container}>
          <div className={styles.input_title}>To</div>
          <input
            placeholder="Unlimited"
            value={state[1]}
            onChange={(e) => setState([state[0], e.target.value])}
          />
        </div>
      </div>
    </div>
  );
};

export default EventAttendance;