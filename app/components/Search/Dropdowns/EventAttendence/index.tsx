import React, { useState, useEffect, useRef } from "react";
import styles from "./eventAttendance.module.css";
import { useTheme } from "@/context";

interface EventAttendanceProps {
  className?: string
  state: string[];
  setState: ([]) => void;
  onClose: () => void;
}

const EventAttendance = ({
  className,
  state,
  setState,
  onClose,
}: EventAttendanceProps) => {
  const {theme} = useTheme();

  const [eventAttendanceRange, setEventAttendanceRange] = useState<string[]>(state);
  useEffect(()=>{
    console.log(eventAttendanceRange);
    
    if(eventAttendanceRange[0] && eventAttendanceRange[1]){
      setState(eventAttendanceRange);
    }else if(eventAttendanceRange[0] == '' || eventAttendanceRange[1] == '' ){
      setState([]);
    }
  },[eventAttendanceRange])
  const removeHandler=()=>{
    setState([]);
    setEventAttendanceRange([]);
  }
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header_container}>
        <div className={styles.header_title}>Event Attendance</div>
        <div className={styles.header_button} onClick={removeHandler}>
         Remove
        </div>
      </div>

      <div className={styles.sub_container}>
        <div className={styles.input_container}>
          <div className={styles.input_title}>From</div>
          <input
            placeholder="0"
            value={eventAttendanceRange[0]?eventAttendanceRange[0]:''}
            onChange={(e) => setEventAttendanceRange([e.target.value, eventAttendanceRange[1]])}
            type="number"
          />
        </div>
        <div className={styles.separator}></div>
        <div className={styles.input_container}>
          <div className={styles.input_title}>To</div>
          <input
            placeholder="Unlimited"
            value={eventAttendanceRange[1]?eventAttendanceRange[1]:''}
            onChange={(e) => {setEventAttendanceRange([eventAttendanceRange[0], e.target.value])}}
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default EventAttendance;