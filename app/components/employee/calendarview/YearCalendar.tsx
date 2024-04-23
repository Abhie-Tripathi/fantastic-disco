import React from "react";
import styles from './yearCalendar.module.css'

interface MonthObject {
  monthName: string;
  year: number;
  dates: (Date | string)[];
}

function generateMonthArray(year: number, month: number): MonthObject {
  const monthNames: string[] = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  const firstDayOfMonth: Date = new Date(year, month - 1, 1);
  const lastDayOfMonth: Date = new Date(year, month, 0);
  const daysInMonth: number = lastDayOfMonth.getDate();

  const firstDayIndex: number = firstDayOfMonth.getDay();

  const monthObject: MonthObject = {
    monthName: monthNames[month - 1],
    year: year,
    dates: []
  };

  for (let i = 0; i < firstDayIndex; i++) {
    monthObject.dates.push("");
  }

  for (let day = 1; day <= daysInMonth; day++) {
    monthObject.dates.push(new Date(year, month - 1, day));
  }

  return monthObject;
}

function generateYearArray(year: number): MonthObject[] {
  const yearArray: MonthObject[] = [];
  for (let month = 1; month <= 12; month++) {
    yearArray.push(generateMonthArray(year, month));
  }
  return yearArray;
}

const yearData: MonthObject[] = generateYearArray(2024);

const YearCalendar: React.FC = () => {
  return (
    <div className={styles.container}>
      {yearData.map((year: MonthObject, index: number) => (
        <div key={index} className={styles.monthcard_container}>
          <div className={styles.monthcard_header}>
            <div className={styles.monthcard_name}>{year.monthName}</div>
            <div className={styles.events_details}>23609 EVENTS</div>
          </div>

          <div className={styles.dayCard_container}>
            {year.dates.map((date: Date | string, index: number) => {
              if (date === "") {
                return <div key={index} className={styles.emptyDayCard}></div>;
              } else {
                return <div key={index} className={styles.dayCard}>{(date as Date).getDate()}</div>;
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearCalendar;
