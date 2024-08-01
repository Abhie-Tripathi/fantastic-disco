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

const currentDate = new Date();

function formatDateToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const rangeButtons = [
  { title: "Any", range: [null, null] },
  {
    title: "Today",
    range: [
      convertToISOFormat(formatDateToYYYYMMDD(currentDate)),
      convertToISOFormat(formatDateToYYYYMMDD(currentDate)),
    ],
  },
  {
    title: "This week",
    range: [
      convertToISOFormat(formatDateToYYYYMMDD(currentDate)),
      convertToISOFormat(
        formatDateToYYYYMMDD(
          new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        )
      ),
    ],
  },
  {
    title: "This month",
    range: [
      convertToISOFormat(
        formatDateToYYYYMMDD(
          new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        )
      ),
      convertToISOFormat(
        formatDateToYYYYMMDD(
          new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        )
      ),
    ],
  },
  {
    title: "3 months",
    range: [
      convertToISOFormat(formatDateToYYYYMMDD(currentDate)),
      convertToISOFormat(
        formatDateToYYYYMMDD(
          new Date(currentDate.getTime() + 90 * 24 * 60 * 60 * 1000)
        )
      ),
    ],
  },
  {
    title: "6 months",
    range: [
      convertToISOFormat(formatDateToYYYYMMDD(currentDate)),
      convertToISOFormat(
        formatDateToYYYYMMDD(
          new Date(currentDate.getTime() + 180 * 24 * 60 * 60 * 1000)
        )
      ),
    ],
  },
  {
    title: "9 months",
    range: [
      convertToISOFormat(formatDateToYYYYMMDD(currentDate)),
      convertToISOFormat(
        formatDateToYYYYMMDD(
          new Date(currentDate.getTime() + 270 * 24 * 60 * 60 * 1000)
        )
      ),
    ],
  },
  {
    title: "12 months",
    range: [
      convertToISOFormat(formatDateToYYYYMMDD(currentDate)),
      convertToISOFormat(
        formatDateToYYYYMMDD(
          new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000)
        )
      ),
    ],
  },
];

interface DateRangeProps {
  state: any;
  setState: any;
}

function convertToISOFormat(dateString: string) {
  console.log(dateString);
  const isoString = dateString + "T00:00:00.000Z";
  return isoString;
}

const DateRange = ({ state, setState }: DateRangeProps) => {
  rangeButtons.map((range) => console.log(range.range));
  return (
    <div className={styles.container}>
      <RangeCalendar
        aria-label="input dates"
        className={styles.picker_container}
        onChange={(value) => {
          setState([
            convertToISOFormat(value.start.toString()),
            convertToISOFormat(value.end.toString()),
          ]);
        }}
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
          <button
            key={range.title}
            onClick={(value) => {
              setState([range.range[0], range.range[1]]);
            }}
          >
            {range.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateRange;
