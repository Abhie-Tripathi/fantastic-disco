import React, { Suspense, lazy } from "react";
import styles from "./daterangeinput.style.module.css";
import useClickOutside from "@/hooks/useClickOutside";
import Loading from "@/app/components/UI/Loading";
const DateRangeCalendar = lazy(() => import("./DateRangeCalendar"));
import { useTheme } from "@/context";

interface DateRangeInputProps {
  className?: string;
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
  const { theme } = useTheme();

  const selectDateHandler = (event: any) => {
    const range = event.target.attributes[0].value;
    const rangeArray = range.split(',');
    setState(rangeArray);
    onClose();
  };

  const getDateRange = (daysToAdd: number) => {
    const currentDate = new Date();
    const endDate = new Date(
      currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000
    );

    const formattedStartDate = convertToCustomFormat(currentDate.toISOString());
    const formattedEndDate = convertToCustomFormat(endDate.toISOString());
    return [formattedStartDate, formattedEndDate];
  };

  const convertToCustomFormat = (dateStr: string) => {
    const dateObject = new Date(dateStr);
    const day = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const formattedDate = day + " " + monthNames[monthIndex] + " " + year;
    return formattedDate;
  };

  return (
    <div
      className={`${styles.container} ${className} ${
        theme === "light" ? styles.container_light : ""
      }`}
    >
      <div className={styles.header}>
        <div className={styles.header_title}>Date</div>
        <div className={styles.header_button} onClick={onClose}>
          Done
        </div>
      </div>

      <ul className={styles.dateRangeList} onClick={selectDateHandler}>
        <li data-value={getDateRange(0)}>Any time</li>
        <li data-value={getDateRange(0)}>Today</li>
        <li data-value={getDateRange(30)}>This month</li>
        <li data-value={getDateRange(7)}>Next 7 days</li>
        <li data-value={getDateRange(30)}>Next 30 days</li>
        <li data-value={getDateRange(90)}>Next 90 days</li>
        <li data-value={getDateRange(180)}>Next 180 days</li>
        <li data-value={getDateRange(365)}>Next 12 months</li>
      </ul>
      <Suspense
        fallback={<Loading className={styles.dateRangeCalendar_loading} />}
      >
        <DateRangeCalendar setState={setState} />
      </Suspense>
    </div>
  );
};

export default DateRangeInput;
