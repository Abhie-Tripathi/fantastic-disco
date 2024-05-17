import React from "react";
import styles from "./daterangecal.style.module.css";
import Image from "next/image";
import LeftArrow from "/public/leftArrow.svg";
import RightArrow from "/public/rightArrow.svg";
import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateRangePicker,
  Heading,
  RangeCalendar,
} from "react-aria-components";
import { useTheme } from "@/context";
import { convertToCustomFormat } from "@/utils/dateFormat";

interface DateRangePickerProps {
  setState: ([]) => void;
}

const DateRangeCalendar = ({ setState }: DateRangePickerProps) => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? styles.icons_light : styles.icons;
  return (
    <DateRangePicker
      aria-label="Date Range"
      className={styles.ariaDaterangepicker}
      onChange={(value) =>
        setState([
          convertToCustomFormat(value.start.toString()),
          convertToCustomFormat(value.end.toString()),
        ])
      }
    >
      <RangeCalendar
        className={`${styles.ariaRangeCalendar} ${
          theme === "light" ? styles.ariaRangeCalendar_light : ""
        }`}
      >
        <header>
          <Button slot="previous" className={styles.ariaCalBtn}>
            <Image
              src={LeftArrow}
              alt="prev"
              width={24}
              className={iconClass}
            />
          </Button>
          <Heading className={styles.ariaHeading} />
          <Button slot="next" className={styles.ariaCalBtn}>
            <Image
              src={RightArrow}
              alt="next"
              width={24}
              className={iconClass}
            />
          </Button>
        </header>
        <CalendarGrid>
          {(date) => (
            <CalendarCell date={date} className={styles.ariaCalendarCell} />
          )}
        </CalendarGrid>
      </RangeCalendar>
    </DateRangePicker>
  );
};

export default DateRangeCalendar;
