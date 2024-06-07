import React, { useState, useEffect } from "react";
import styles from "./weekCalendar.module.css";
import { useTheme } from "@/context";
import Image from "next/image";
import CalendarList from "./CalendarList";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import LeftArrow from "/public/leftArrow.svg";
import RightArrow from "/public/rightArrow.svg";

/*
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
*/

const backgroundColors = [
  {
    backgroundColor: "#F3EEFE",
    color: "#6D28D9",
  },
  {
    backgroundColor: "#FEF5E6",
    color: "#B45309",
  },
  {
    backgroundColor: "#E6F6FC",
    color: "#0369A1",
  },
  {
    backgroundColor: "#E7F8F2",
    color: "#047857",
  },
  {
    backgroundColor: "#FFE4E6",
    color: "#BE123C",
  },
];

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * backgroundColors.length);
  return backgroundColors[randomIndex];
}

var eventPosition = Array.from({ length: 5 }, () => new Array(7).fill(0));

const resetEventPosition = () => {
  eventPosition = Array.from({ length: 5 }, () => new Array(7).fill(0));
};

const months = [
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

function getCurrentWeek() {
  const today = new Date();
  const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const startDate = new Date(today);
  const endDate = new Date(today);

  startDate.setDate(today.getDate() - currentDay); // Start from Sunday
  endDate.setDate(today.getDate() + (6 - currentDay)); // End on Saturday

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const days = [];

  for (let i = 0; i <= 6; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    days.push({
      dayName: weekDays[currentDate.getDay()],
      date: currentDate,
      isoDate: currentDate.toISOString(),
    });
  }

  return days;
}

function getDurationInDays(startDate: string, endDate: string) {
  const start = new Date(startDate.substring(0, 10));
  const end = new Date(endDate.substring(0, 10));

  const differenceInMilliseconds = Math.abs(Number(end) - Number(start));

  const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

  return differenceInDays + 1;
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
};

function fillPosition(event: any) {
  let startRow = 0; // Start filling from the first row
  let startCol = event.startDayNo; // Start filling from the start day
  let duration = event.durationDays;
  let found = false;

  // Loop through rows until a suitable row is found or all rows are exhausted
  while (!found && startRow < 5) {
    let col = startCol;
    let overlap = false; // Flag to track if there's an overlap with another event

    // Check if the entire duration can fit in the current row without overlaps
    while (col < 7 && duration > 0 && !overlap) {
      if (eventPosition[startRow][col] === 0) {
        duration--;
      } else {
        overlap = true; // There's an overlap with another event
      }
      col++;
    }

    // If the entire duration can fit in the row without overlaps
    if (duration === 0 && !overlap) {
      col = startCol;
      while (col < 7 && event.durationDays > 0) {
        eventPosition[startRow][col] = event.id;
        col++;
        event.durationDays--;
      }
      found = true;
    } else {
      // Move to the next row if the current row is filled or overlaps with another event
      startRow++;
      // startCol = 0; // Start from the beginning of the next row
      duration = event.durationDays; // Reset duration
    }
  }

  // If no suitable row is found, don't enter the ID
  if (startRow === 5 && !found) {
    console.log("Event could not be placed in the calendar.");
  }
}

interface WeekCalendarProps {
  queryString: string;
}

const WeekCalendar = (props: WeekCalendarProps) => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [weekDates, setWeekDates] = useState(getCurrentWeek());
  const [startDate, setStartDate] = useState(new Date());

  const [eventsData2, setEventsData] = useState<any>([]);

  const [eventListDate, setEventListDate] = useState<string>('');

  const handleListOpen = (date: string) => {
    if (date === eventListDate)
      setEventListDate('0');
    else
      setEventListDate(date);
  }

  const EventCards = () => {
    const { theme } = useTheme();
    let i = 0;
    let j = 0;
    const cards = [];

    while (i < eventsData2.length) {
      const event = eventsData2[i];

      if (event.startDayNo === j % 7) {
        j += event.durationDays;
        i++;
        cards.push(
          <div
            key={`event_${i}`}
            className={`${styles.eventCard} ${theme === 'light' ? styles.eventCard_light : ""}`}
            style={{
              width: `calc((((100% - 90px) / 7) * ${event.durationDays}) + (${event.durationDays} - 1) * 15px)`,
              // backgroundColor: "#1A1A1A",
              color: event.color,
            }}
          >
            <div className={styles.event_date}>{event.dateRange}</div>
            <div className={styles.event_title} data-name={event.eventName} >{event.eventName}</div>
          </div>
        );
      } else {
        j++;
        cards.push(<div key={`empty_${j}`} className={styles.emptyCard}></div>);
      }
    }

    return <div className={styles.eventCards_container}>{cards}</div>;
  };

  const prevDates = () => {
    const firstDate = weekDates[0]?.date; // Get the date of the first element in weekDates

    // Subtract 7 days from the first date to get the new start date
    startDate.setTime(firstDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const days = [];

    for (let i = 0; i <= 6; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push({
        dayName: weekDays[currentDate.getDay()],
        date: currentDate,
        isoDate: currentDate.toISOString(),
      });
    }

    setWeekDates(days); // Update weekDates state with the new previous week's dates
  };

  const nextDates = () => {
    const lastDate = weekDates[weekDates.length - 1]?.date; // Get the date of the last element in weekDates

    // Add 7 days to the last date to get the new start date
    startDate.setTime(lastDate.getTime() + 24 * 60 * 60 * 1000); // Add 1 day to start from the next day

    const weekDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const days = [];

    for (let i = 0; i <= 6; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push({
        dayName: weekDays[currentDate.getDay()],
        date: currentDate,
        isoDate: currentDate.toISOString(),
      });
    }

    setWeekDates(days); // Update weekDates state with the new next week's dates
  };

  const prevButtonHandler = () => {
    prevDates();
  };

  const nextButtonHandler = () => {
    nextDates();
  };

  const [apiResult, setApiResult] = useState<any>({});

  const fetchEventsData = async () => {
    try {
      let start = weekDates[0].isoDate.substring(0, 10);
      let end = weekDates[6].isoDate.substring(0, 10);
      const apiUrl = `${baseUrl}/event/search?groupBy=${start},${end}&${props.queryString}`;
      const apiData = await myFetch(apiUrl, {
        method: "GET",
        headers: headers,
      });
      if (apiData.data) {
        resetEventPosition();
        var tmpData2: any = {};
        var eventIds: string[] = [];
        Object.keys(apiData.data).forEach(function (key) {
          apiData.data[key].event.map((event: any, index: number) => {
            if (!eventIds.includes(event.id)) {
              eventIds.push(event.id);
              let e_startDayNo = new Date(event.startDate).getDay();
              let e_duration = getDurationInDays(event.startDate, event.endDate);

              let week_startDay = new Date(weekDates[0].isoDate.substring(0, 10));
              let week_endDay = new Date(weekDates[6].isoDate.substring(0, 10));

              let event_startDay = new Date(event.startDate.substring(0, 10));
              let event_endDay = new Date(event.endDate.substring(0, 10));

              if (event_startDay.getTime() < week_startDay.getTime()) {
                e_startDayNo = 0;
                e_duration = getDurationInDays(weekDates[0].isoDate, event.endDate);
              }
              if (event_endDay.getTime() > week_endDay.getTime()) {
                e_duration = getDurationInDays(event.startDate, weekDates[6].isoDate);
              }

              let card_color = getRandomColor();

              tmpData2[event.id] = {
                eventName: event.name,
                dateRange: formatDate(event.startDate) + ' - ' + formatDate(event.endDate),
                startDayNo: e_startDayNo,
                durationDays: e_duration,
                backgroundColor: card_color.backgroundColor,
                color: card_color.color,
              }
              fillPosition({
                id: event.id,
                startDayNo: e_startDayNo,
                durationDays: e_duration,
              });
            }
          })
        })
        setApiResult(tmpData2);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function fillCalendarData() {
    const uniqueIds: Set<string> = new Set();

    var tmpData: any = [];
    for (const row of eventPosition) {
      for (const id of row) {
        if (id && id !== 0 && !uniqueIds.has(id)) {
          uniqueIds.add(id);
          tmpData.push(apiResult[id]);
        }
      }
    }
    setEventsData(tmpData);
  }

  useEffect(() => {
    fetchEventsData();
  }, [weekDates, props.queryString]);

  useEffect(() => {
    if (Object.keys(apiResult).length > 0) {
      fillCalendarData();
    }
  }, [apiResult]);

  return (
    <>
      <div className={styles.control_buttons_container}>
        <button onClick={prevButtonHandler}>
          <Image className={iconClass} src={LeftArrow} width={28} alt="leftarrow" />
        </button>
        <div>
          {`${weekDates[0].date.getDate()} ${months[weekDates[0].date.getMonth()]
            } - ${weekDates[weekDates.length - 1].date.getDate()} ${months[weekDates[weekDates.length - 1].date.getMonth()]
            } ${weekDates[weekDates.length - 1].date.getFullYear()}`
          }
        </div>
        <button onClick={nextButtonHandler}>
          <Image className={iconClass} src={RightArrow} width={28} alt="rightarrow" />
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.dayCards_container}>
          {weekDates.map((day, index) => (
            <div key={index} className={styles.dayCard}>
              <div className={styles.day_title}>{day.dayName}</div>
              <div className={styles.date}>{day.date.getDate()}</div>
            </div>
          ))}
        </div>
        {(eventsData2 && Object.keys(eventsData2).length > 0) &&
          <EventCards />
        }
      </div>
      <div className={styles.eventList_container}>
        <button
          onClick={() => handleListOpen(weekDates[0].isoDate.substring(0, 10))}
          className={styles.event_list_button}
        >
          EVENTS LIST
        </button>
        <CalendarList filters={''} startDate={eventListDate} endDate={weekDates[6].isoDate.substring(0, 10)} />
      </div>
    </>
  );
};

export default WeekCalendar;