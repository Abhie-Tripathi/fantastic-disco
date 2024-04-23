import React, { Suspense, lazy } from "react";
import styles from "./daterangeinput.style.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import Loading from "@/app/components/UI/Loading";
const DateRangeCalendar = lazy(() => import("./DateRangeCalendar"));

interface DateRangeInputProps {
  className?: string
  dropdownRef: React.MutableRefObject<null>;
  state: string[];
  setState: ([]) => void;
  onClose: () => void;
}

const DateRangeInput = ({
  className,
  dropdownRef,
  state,
  setState,
  onClose,
}: DateRangeInputProps) => {
  useClickOutside(dropdownRef, () => onClose());

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className={styles.header_title}>Date</div>
        <div className={styles.header_button} onClick={onClose}>Done</div>
      </div>

      <ul className={styles.dateRangeList}>
        <li>Any time</li>
        <li>Today</li>
        <li>This month</li>
        <li>Next 7 days</li>
        <li>Next 30 days</li>
        <li>Next 90 days</li>
        <li>Next 180 days</li>
        <li>Next 12 months</li>
      </ul>
      <Suspense fallback={<Loading className={styles.dateRangeCalendar_loading}/>}>
        <DateRangeCalendar setState={setState} />
      </Suspense>
    </div>
  );
};

export default DateRangeInput;