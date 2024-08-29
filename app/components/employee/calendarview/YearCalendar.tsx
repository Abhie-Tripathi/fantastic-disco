import React, { useState, useEffect } from "react";
import styles from './yearCalendar.module.css'
import Image from "next/image";
import { useTheme } from "@/context";
import CalendarList from "./CalendarList";
import { myFetch } from "@/utils/myFetch";
import { baseUrl, headers } from "@/constants";
import LeftArrow from "/public/leftArrow.svg";
import RightArrow from "/public/rightArrow.svg";
import Loading from "../../UI/Loading";

interface countObj {
  [date: string]: { totalEvent: number }
}[]
interface MonthObject {
  monthName: string;
  year: number;
  dates: (Date | string)[];
}

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  if (year == 0) return [];
  const yearArray: MonthObject[] = [];
  for (let month = 1; month <= 12; month++) {
    yearArray.push(generateMonthArray(year, month));
  }
  return yearArray;
}

const initialMonthCounts: number[] = new Array(12).fill(0);

interface YearCalendarProps {
  queryString: string;
  handleButtonLoading?: (v: boolean) => void;
}

const YearCalendar: React.FC<YearCalendarProps> = (props) => {
  const { theme } = useTheme();
  const iconClass = theme === "light" ? "icons_light" : "icon";

  const [year, setYear] = useState<number>(0);
  const [eventListDate, setEventListDate] = useState<string>('');

  const yearData: MonthObject[] = generateYearArray(year);
  // const [yearData, setYearData] = useState<MonthObject[]>([]);
  const [eventCountArr, setEventCountArr] = useState<countObj>();
  const [monthEventCount, setMonthEventCount] = useState<number[]>(initialMonthCounts);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);


  function countEventsMonthWise() {
    const monthCounts: number[] = new Array(12).fill(0);

    for (const date in eventCountArr) {
      if (eventCountArr.hasOwnProperty(date)) {
        const month = parseInt(date.split('-')[1]) - 1;
        monthCounts[month] += eventCountArr[date].totalEvent;
      }
    }
    setMonthEventCount(monthCounts);
  }

  const handleListOpen = (date: Date) => {
    let d = formatDate(date);
    if (d === eventListDate)
      setEventListDate('0');
    else
      setEventListDate(d);
  }

  const fetchEventsData = async () => {
    if(props.queryString){
    try {
      setIsLoaded(false);
      const apiUrl = `${baseUrl}/event/search?groupBy=${year}-01-01,${year}-12-31&${props.queryString}`;
      const apiData = await myFetch(apiUrl, {
        method: "GET",
        headers: headers,
      });
      if (apiData.data) {
        setEventCountArr(apiData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setEventCountArr({});
    } finally {
      setIsLoaded(true);
      props?.handleButtonLoading?.(false);
    }
    }else{
      setEventCountArr({});
      setIsLoaded(true);
    }
  }

  const prevButtonHandler = () => {
    if (year > 0)
      setYear(year - 1);
  }

  const nextButtonHandler = () => {
    if (year > 0)
      setYear(year + 1);
  }

  useEffect(() => {
    if (eventCountArr && Object.keys(eventCountArr).length > 0) {
      countEventsMonthWise();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventCountArr]);

  useEffect(() => {
    if (year == 0) {
      setYear(2024);
    } else if (year > 0) {
      fetchEventsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, props.queryString]);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <>
      <div className={styles.control_buttons_container}>
        <button onClick={prevButtonHandler}>
          <Image className={iconClass} src={LeftArrow} width={28} alt="leftarrow" />
        </button>
        <div>
          {year > 0 &&
            year
          }
        </div>
        <button onClick={nextButtonHandler}>
          <Image className={iconClass} src={RightArrow} width={28} alt="rightarrow" />
        </button>
      </div>
      <div className={styles.container}>
        {yearData.map((year: MonthObject, index: number) => (
          <div key={index} className={styles.monthcard_container}>
            <div className={styles.monthcard_header}>
              <div className={styles.monthcard_name}>{year.monthName}</div>
              <div className={styles.events_details}>{monthEventCount[index] ? monthEventCount[index] : 0} EVENTS</div>
            </div>

            <div className={styles.dayCard_container}>
              {year.dates.map((date: Date | string, index: number) => {
                if (date === "") {
                  return <div key={index} className={styles.emptyDayCard}></div>;
                } else {
                  return (
                    <div key={index} className={`${styles.dayCard} ${theme === 'light' ? styles.dayCard_light : ""}`}>
                      {(date as Date).getDate()}
                      {(eventCountArr && eventCountArr[formatDate(date)] && eventCountArr[formatDate(date)]['totalEvent'] > 0) &&
                        <div onClick={() => handleListOpen(date as Date)} className={styles.eventsCount} >
                          {eventCountArr[formatDate(date)]['totalEvent']}
                        </div>
                      }
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
      <CalendarList filters={props.queryString} startDate={eventListDate} endDate={eventListDate} />
    </>
  );
};

export default YearCalendar;
