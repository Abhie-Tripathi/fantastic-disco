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

interface DateRangePickerProps {
  setState: ([]) => void;
}

function convertToCustomFormat(dateStr:string) {
  var dateObject = new Date(dateStr);
  var day = dateObject.getDate();
  var monthIndex = dateObject.getMonth();
  var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
  ];
  var formattedDate = day + ' ' + monthNames[monthIndex];
  return formattedDate;
}

const DateRangeCalendar = ({ setState }: DateRangePickerProps) => {
  return (
    <DateRangePicker
      aria-label="Date Range"
      className={styles.ariaDaterangepicker}
      onChange={(value) =>
        setState([convertToCustomFormat(value.start.toString()), convertToCustomFormat(value.end.toString())])
      }
    >
      <RangeCalendar className={styles.ariaRangeCalendar}>
        <header>
          <Button slot="previous" className={styles.ariaCalBtn}>
            <Image src={LeftArrow} alt="prev" width={24} />
          </Button>
          <Heading className={styles.ariaHeading} />
          <Button slot="next" className={styles.ariaCalBtn}>
            <Image src={RightArrow} alt="next" width={24} />
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