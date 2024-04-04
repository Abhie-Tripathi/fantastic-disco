import React from "react";
import styles from "./weekCalendar.module.css";

const daysAndDates = [
  {
    dayName: "SUNDAY",
    date: 14,
  },
  {
    dayName: "MONDAY",
    date: 15,
  },
  {
    dayName: "TUESDAY",
    date: 16,
  },
  {
    dayName: "WEDNESDAY",
    date: 17,
  },
  {
    dayName: "THURSDAY",
    date: 18,
  },
  {
    dayName: "FRIDAY",
    date: 19,
  },
  {
    dayName: "SATURDAY",
    date: 20,
  },
];

const eventsData = [
  {
    eventName: "Event #1",
    dateRange: "Sun, 14 Mar 2024  - Tue, 16 Mar 2024",
    startDayNo: 0,
    durationDays: 3,
    backgroundColor: "#F3EEFE",
    color: "#6D28D9",
  },
  {
    eventName: "Event #1",
    dateRange: "Wed, 17 Mar 2024 ",
    startDayNo: 3,
    durationDays: 1,
    backgroundColor: "#FEF5E6",
    color: "#B45309",
  },
  {
    eventName: "Event #1",
    dateRange: "Sun, 14 Mar 2024 ",
    startDayNo: 0,
    durationDays: 1,
    backgroundColor: "#FEF5E6",
    color: "#B45309",
  },
  {
    eventName: "Event #1",
    dateRange: "Mon, 15 Mar 2024 ",
    startDayNo: 1,
    durationDays: 1,
    backgroundColor: "#E6F6FC",
    color: "#0369A1",
  },
  {
    eventName: "Event #1",
    dateRange: "Fri, 19 Mar 2024 - Sat, 20 Mar 2024 ",
    startDayNo: 5,
    durationDays: 2,
    backgroundColor: "#E7F8F2",
    color: "#047857",
  },
  {
    eventName: "Event #1",
    dateRange: "Sun, 14 Mar 2024 ",
    startDayNo: 0,
    durationDays: 1,
    backgroundColor: "#FEF5E6",
    color: "#B45309",
  },
  {
    eventName: "Event #1",
    dateRange: "Mon, 15 Mar 2024 - Tue, 16 Mar 2024 ",
    startDayNo: 1,
    durationDays: 2,
    backgroundColor: "#FFE4E6",
    color: "#BE123C",
  },
  {
    eventName: "Event #1",
    dateRange: "Wed, 17 Mar 2024 - Fri, 19 Mar 2024 ",
    startDayNo: 3,
    durationDays: 3,
    backgroundColor: "#FEF5E6",
    color: "#B45309",
  },
  {
    eventName: "Event #1",
    dateRange: "Sun, 14 Mar 2024  - Tue, 15 Mar 2024",
    startDayNo: 0,
    durationDays: 3,
    backgroundColor: "#F3EEFE",
    color: "#6D28D9",
  },
];

const EventCards = () => {
  let i = 0;
  let j = 0;
  const cards = [];

  while (i < eventsData.length) {
    const event = eventsData[i];

    if (event.startDayNo === j % 7) {
      j += event.durationDays;
      i++;
      cards.push(
        <div
          key={`event_${i}`}
          className={styles.eventCard}
          style={{
            width: `calc((((100% - 90px) / 7) * ${event.durationDays}) + (${event.durationDays} - 1) * 15px)`,
            backgroundColor: "#1A1A1A",
            color: event.color,
          }}
        >
          <div className={styles.event_date}>{event.dateRange}</div>
          <div className={styles.event_title}>{event.eventName}</div>
        </div>
      );
    } else {
      j++;
      cards.push(<div key={`empty_${j}`} className={styles.emptyCard}></div>);
    }
  }

  return <div className={styles.eventCards_container}>{cards}</div>;
};

const WeekCalendar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dayCards_container}>
        {daysAndDates.map((day) => (
          <div key={day.date} className={styles.dayCard}>
            <div className={styles.day_title}>{day.dayName}</div>
            <div className={styles.date}>{day.date}</div>
          </div>
        ))}
      </div>
      <EventCards />
    </div>
  );
};

export default WeekCalendar;