import React from "react";
import styles from "./yearcalendar.style.module.css";

function generateMonthArray(year, month) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const firstDayIndex = firstDayOfMonth.getDay();

  const monthArray = [];

  let currentDate = new Date(firstDayOfMonth);

  // Pushing month name, year, and dates into the array
  const monthObject= {
    monthName: monthNames[month - 1],
    year: year,
    dates: []
  };

  for (let i = 0; i < firstDayIndex; i++) {
    monthObject.dates.push("");
  }

  for (let day = 1; day <= daysInMonth; day++) {
    monthObject.dates.push(new Date(year, month - 1, day));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return monthObject;
}

function generateYearArray(year) {
  const yearArray = [];
  for (let month = 1; month <= 12; month++) {
    yearArray.push(generateMonthArray(year, month));
  }
  return yearArray;
}

const yearData = generateYearArray(2024);


const YearCalendar = () => {
  return (
    <div className={styles.container}>
      {yearData.map((year)=><div key={year} className={styles.monthcard_container}>
        <div className={styles.monthcard_header}>
          <div className={styles.monthcard_name}>{year.monthName}</div>
          <div className={styles.events_details}>23609 EVENTS</div>
        </div>

        <div className={styles.dayCard_container}>
          {year.dates.map((date) => {
            if (date === "") {
              return <div key={date} className={styles.emptyDayCard}></div>;
            } else {
              return <div key={date} className={styles.dayCard}>{date.getDate()}</div>;
            }
          })}
        </div>
      </div>)}
    </div>
  );
};

export default YearCalendar;