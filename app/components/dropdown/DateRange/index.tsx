import React, { useState } from "react";
import styles from "./daterange.module.css";
import Image from "next/image";
import Chevron from "/public/internal/Chevron.svg";
import {
  Button,
  CalendarCell,
  CalendarGrid,
  Heading,
  RangeCalendar,
} from "react-aria-components";
import { useTheme } from "@/context";

const rangeButtons = [
  "Any",
  "Today",
  "This week",
  "This month",
  "3 months",
  "6 months",
  "9 Months",
  "12 months",
];

interface DateRangeProps {
  state: any;
  setState: any;
}

function convertToISOFormat(dateString: string) {
  const isoString = dateString + "T00:00:00.000Z";
  return isoString;
}

const DateRange = ({ state, setState }: DateRangeProps) => {
const {theme} = useTheme()

  return (
    <div className={styles.container} style={{background: theme==="light"?"white":""}}>
      <RangeCalendar
        aria-label="input dates"
        className={styles.picker_container}
        onChange={(value) =>
          setState([
            convertToISOFormat(value.start.toString()),
            convertToISOFormat(value.end.toString()),
          ])
        }
      >
        <div className={styles.picker_header}>
          <Heading />
          <div className={styles.picker_header_buttons}>
            <Button slot="previous">
              <Image src={Chevron} alt="chevron" />
            </Button>
            <Button slot="next">
              <Image
                src={Chevron}
                alt="chevron"
                style={{ transform: "rotate(180deg)" }}
              />
            </Button>
          </div>
        </div>
        <CalendarGrid weekdayStyle="short" className={styles.calendarGrid}>
          {(date) => (
            <CalendarCell date={date} className={styles.calendarCell} />
          )}
        </CalendarGrid>
      </RangeCalendar>

      <div className={styles.range_buttons_container}>
        {rangeButtons.map((range) => (
          <button key={range}>{range}</button>
        ))}
      </div>
    </div>
  );
};

export default DateRange;