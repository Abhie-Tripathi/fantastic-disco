import React, { useState, useEffect } from "react";
import styles from "./month.style.module.css";
import { useCalendarServices } from "@/services/geniservices/calendarServices";
interface CalendarProps {
  cardBgColor?: string;
  widgetId?: string;
  onDateSelect?: (selectedDate: string) => void;
  handleResetEvents?: () => void;
  onMonthSelect?: (selectedMonth: string) => void;
  previewWindowBgColor?: string;
  isDark?:boolean;
  setIsDark?:(value: boolean) => void
}

const Calendar = ({
  cardBgColor,
  widgetId,
  onDateSelect,
  handleResetEvents,
  onMonthSelect,
  previewWindowBgColor,
  isDark,
  setIsDark
}: CalendarProps) => {
  const { getYearlyEvents, getMonthlyEvents } = useCalendarServices();
  const [year, setYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState<any>([]);
  const [monthlyEvents, setMonthlyEvent] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState("year");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const handlePrevYear = () => {
    if (viewMode === "year") {
      setYear(year - 1);
    } else {
      setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
      if (currentMonth === 0) {
        setYear(year - 1);
      }
    }
  };

  const handleNextYear = () => {
    if (viewMode === "year") {
      setYear(year + 1);
    } else {
      setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
      if (currentMonth === 11) {
        setYear(year + 1);
      }
    }
  };

  const handleBackToYear = () => {
    setViewMode("year");
  };

  // const hexToRgba = (hex?: string, alpha?: number) => {
  //   const hexWithoutHash = hex?.replace("#", "");
  //   if (hexWithoutHash) {
  //     const bigint = parseInt(hexWithoutHash, 16);
  //     const r = (bigint >> 16) & 255;
  //     const g = (bigint >> 8) & 255;
  //     const b = bigint & 255;
  //     return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  //   }
  // };

  // const rgbaBgColor = hexToRgba(cardBgColor, 0.4);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateDays = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDayOfWeek = getFirstDayOfMonth(month, year);
    const days = [];

    const prevMonthDays = getDaysInMonth(
      month === 0 ? 11 : month - 1,
      month === 0 ? year - 1 : year
    );
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
      });
    }

    const totalCells = 42;
    const nextMonthDays = totalCells - days.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
      });
    }

    return days;
  };
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthOrder = [
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

  // Function to fetch and sort data
  const getYearlyCalendarData = async () => {
    const data = await getYearlyEvents(widgetId, year);
    const sortedMonths = data.sort(
      (a: any, b: any) =>
        monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date)
    );

    setMonths(sortedMonths);
  };

  useEffect(() => {
    getYearlyCalendarData();
  }, [year]);

  const getMonthlyCalendarData = async () => {
    const res = await getMonthlyEvents(widgetId);
    setMonthlyEvent(res);
  };
  useEffect(() => {
    getMonthlyCalendarData();
  }, []);

  const today = new Date();

  const handleDayClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    const selectedFullDate = new Date(
      year,
      currentMonth,
      day
    ).toLocaleDateString("en-CA");
    const eventsForSelectedDate = monthlyEvents.filter((event: any) => {
      const eventDate = new Date(event.date).toLocaleDateString("en-CA");
      return eventDate === selectedFullDate;
    });
    setFilteredEvents(eventsForSelectedDate);
    if (onDateSelect) {
      onDateSelect(selectedFullDate);
    }

    setSelectedDate(selectedFullDate);
  };

  const clearSelectedDate = () => {
    if (handleResetEvents) {
      handleResetEvents();
    }

    setSelectedDate(null);
    setSelectedMonth(null);
  };

  const handleMonthClick = (monthDate: string) => {
    if (onMonthSelect) {
      onMonthSelect(monthDate);
      setSelectedMonth(monthDate);
    }
  };

  const isColorDark = (color?: string) => {
    if (color) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const luminance =
        0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
      return luminance < 0.5;
    }else{
      return false
    }
  };
  isDark = isColorDark(previewWindowBgColor);
  if(setIsDark){
    setIsDark(isDark)
  }
  
  console.log("3231", isDark, previewWindowBgColor);
  return (
    <div
      className={`${styles.calendar}`}
      style={{
        backgroundColor: isDark ? "#000000" : "#ffffff",
        color: isDark ? "#ffffff" : "#000000",
      }}
    >
      <div className={styles.calendar_header}>
        <div className={styles.year_month_icons_cotainer}>
          <div
            className={styles.year_month_calendar_icon}
            style={{ backgroundColor: isDark ? "#1F1F1F" : "#ebebeb" }}
            onClick={() => setViewMode("year")}
          >
            <YearCalendarIcon isDark={isDark} isActive={viewMode === "year"} />
          </div>
          <div
            className={styles.year_month_calendar_icon}
            style={{ backgroundColor: isDark ? "#1F1F1F" : "#ebebeb" }}
            onClick={() => setViewMode("month")}
          >
            <MonthCalendarIcon
              isDark={isDark}
              isActive={viewMode === "month"}
            />
          </div>
        </div>

        <div className={styles.currentMonthContainer}>
          <div
            className={styles.prevYear}
            style={{ backgroundColor: isDark ? "#000000" : "#ebebeb" }}
            onClick={handlePrevYear}
          >
            <LeftArrow isDark={isDark} />
          </div>
          <span
            style={{ cursor: viewMode === "month" ? "pointer" : "default" }}
          >
            {viewMode === "month" ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "2px" }}
              >
                {months[currentMonth].date} <span>{year}</span>
              </div>
            ) : (
              year
            )}
          </span>

          <div
            className={styles.nextYear}
            style={{ backgroundColor: isDark ? "#000000" : "#ebebeb" }}
            onClick={handleNextYear}
          >
            <RightArrow isDark={isDark} />
          </div>
        </div>
      </div>

      {viewMode === "year" ? (
        <>
          <div
            className={styles.year_calendar}
            style={{ backgroundColor: isDark ? "#1F1F1F" : "#fafafa" }}
          >
            {months.map((month: any, index: number) => {
              const isSelected = selectedMonth === month.date;

              return (
                <div
                  key={index}
                  className={styles.month}
                  style={{
                    cursor: month.totalEvents > 0 ? "pointer" : "default",
                    border: isSelected ? "1px solid #CCE6FF" : "#fff",
                    backgroundColor: isDark ? "#131313" : "#ffffff",
                  }}
                  onClick={() => {
                    if (month.totalEvents > 0) {
                      setSelectedMonth(month.date);
                      handleMonthClick(month.date);
                    }
                  }}
                >
                  <span className={styles.monthName}>
                    <span>{month.date.slice(0, 3)}</span>
                  </span>
                  <div
                    className={styles.eventCount_container}
                    style={{
                      backgroundColor: isDark ? "#1F1F1F" : "#fafafa",
                      color: isDark ? "#EDEDED" : "#171717",
                    }}
                  >
                    <div className={styles.eventCount}>
                      <span className={styles.eventCount}>
                        {month.totalEvents}
                      </span>
                      <span className={styles.eventCount}>events</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* <div className={styles.selectedMonthContainer}>
            {selectedMonth && (
              <div className={styles.selectedMonth}>
                <span>
                  {selectedMonth} {year}
                </span>
                <button
                  className={styles.clearButton}
                  onClick={clearSelectedDate}
                >
                  <CrossIcon />
                </button>
              </div>
            )}
          </div> */}
        </>
      ) : (
        <div className={styles.monthCalendar}>
          <div
            className={styles.daysGrid}
            style={{ backgroundColor: isDark ? "#1F1F1F" : "#fafafa" }}
          >
            {dayNames.map((day, index) => (
              <div
                key={index}
                className={styles.dayName}
                style={{ backgroundColor: isDark ? "#131313" : "" }}
              >
                {day}
              </div>
            ))}

            {generateDays(currentMonth, year).map((dayObj, index) => {
              const { day, isCurrentMonth } = dayObj;
              const currentCellDate = new Date(
                year,
                isCurrentMonth
                  ? currentMonth
                  : day <= 15
                  ? currentMonth + 1
                  : currentMonth - 1,
                day
              );
              const formattedDate = currentCellDate.toLocaleDateString("en-CA");

              const eventData: any = monthlyEvents.find((event: any) => {
                const eventDate = new Date(event.date).toLocaleDateString(
                  "en-CA"
                );
                return eventDate === formattedDate;
              });

              const isSelected = selectedDate === formattedDate;
              return (
                <div
                  key={index}
                  className={`${styles.dayCell}
                   
                  ${
                    eventData && eventData.totalEvents > 0
                      ? styles.eventHover
                      : ""
                  }`}
                  style={{
                    cursor:
                      eventData && eventData.totalEvents > 0
                        ? "pointer"
                        : "default",
                    border: isSelected ? "1px solid #0D3868" : "",
                    color:
                      !isDark && isSelected
                        ? "#fff"
                        : isDark && isCurrentMonth
                        ? "#ffffff"
                        : isCurrentMonth
                        ? "#171717"
                        : !isCurrentMonth && !isDark
                        ? "#C9C9C9"
                        : "#454545",

                    backgroundColor: isDark
                      ? isSelected
                        ? "#59478C"
                        : "#131313"
                      : isSelected
                      ? "#59478C"
                      : "#ffffff",
                  }}
                  onClick={() => {
                    if (eventData && eventData.totalEvents > 0) {
                      setSelectedDate(formattedDate);
                      handleDayClick(day, isCurrentMonth);
                    }
                  }}
                >
                  <span className={styles.dayNumber}>{day}</span>
                  {eventData && eventData.totalEvents > 0 && (
                    <span
                      className={styles.eventDot}
                      style={{ backgroundColor: cardBgColor }}
                    ></span>
                  )}
                </div>
              );
            })}
          </div>
          {/* {viewMode === "month" && (
            <div className={styles.selectedDateContainer}>
              {selectedDate && (
                <div className={styles.selectedDate}>
                  <span>
                    {new Intl.DateTimeFormat("en-US", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(selectedDate))}
                  </span>
                  <button
                    className={styles.clearButton}
                    onClick={clearSelectedDate}
                  >
                    <CrossIcon />
                  </button>
                </div>
              )}
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default Calendar;

interface IconProps {
  isActive?: boolean;
  isDark?: boolean;
}
interface ArrowProps {
  isDark?: boolean;
}
function CrossIcon() {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 8L8 16M8.00001 8L16 16"
        stroke="#000000"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function LeftArrow({ isDark }: ArrowProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 4 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.453891 2.79045C0.375777 2.86859 0.331896 2.97455 0.331896 3.08504C0.331896 3.19552 0.375777 3.30148 0.453891 3.37962L2.81097 5.7367C2.84941 5.7765 2.89539 5.80824 2.94622 5.83008C2.99706 5.85192 3.05173 5.86341 3.10706 5.86389C3.16238 5.86437 3.21725 5.85383 3.26845 5.83288C3.31966 5.81193 3.36618 5.78099 3.4053 5.74187C3.44443 5.70275 3.47537 5.65622 3.49632 5.60502C3.51727 5.55381 3.52781 5.49894 3.52733 5.44362C3.52685 5.38829 3.51535 5.33362 3.49352 5.28278C3.47168 5.23195 3.43994 5.18597 3.40014 5.14754L1.33764 3.08504L3.40014 1.02254C3.47604 0.943952 3.51804 0.838701 3.51709 0.729452C3.51614 0.620204 3.47232 0.515698 3.39506 0.438445C3.31781 0.361192 3.21331 0.317371 3.10406 0.316422C2.99481 0.315473 2.88956 0.35747 2.81097 0.433369L0.453891 2.79045Z"
        fill={isDark ? "#fff" : "#A1A1A1"}
      />
    </svg>
  );
}
function RightArrow({ isDark }: ArrowProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 4 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.71798 2.79045C3.7961 2.86859 3.83998 2.97455 3.83998 3.08504C3.83998 3.19552 3.7961 3.30148 3.71798 3.37962L1.3609 5.7367C1.32247 5.7765 1.27649 5.80824 1.22565 5.83008C1.17482 5.85192 1.12014 5.86341 1.06482 5.86389C1.00949 5.86437 0.954627 5.85383 0.903421 5.83288C0.852214 5.81193 0.805692 5.78099 0.76657 5.74187C0.727448 5.70275 0.696509 5.65622 0.675559 5.60502C0.654609 5.55381 0.644066 5.49894 0.644547 5.44362C0.645028 5.38829 0.656522 5.33362 0.678359 5.28278C0.700196 5.23195 0.731939 5.18597 0.771735 5.14754L2.83423 3.08504L0.771735 1.02254C0.695835 0.943952 0.653838 0.838701 0.654787 0.729452C0.655736 0.620204 0.699557 0.515698 0.77681 0.438445C0.854063 0.361192 0.958569 0.317371 1.06782 0.316422C1.17707 0.315473 1.28232 0.35747 1.3609 0.433369L3.71798 2.79045Z"
        fill={isDark ? "#fff" : "#A1A1A1"}
      />
    </svg>
  );
}
function MonthCalendarIcon({ isActive, isDark }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 11 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.8054 6.09304H5.60653V8.69673M1 4.29048H9.8125M7.40909 2.68821V1.08594M3.40341 2.68821V1.08594M1.80114 10.6996H9.01136C9.22384 10.6996 9.42761 10.6152 9.57785 10.4649C9.72809 10.3147 9.8125 10.1109 9.8125 9.89844V2.68821C9.8125 2.47574 9.72809 2.27196 9.57785 2.12172C9.42761 1.97148 9.22384 1.88707 9.01136 1.88707H1.80114C1.58866 1.88707 1.38489 1.97148 1.23465 2.12172C1.08441 2.27196 1 2.47574 1 2.68821V9.89844C1 10.1109 1.08441 10.3147 1.23465 10.4649C1.38489 10.6152 1.58866 10.6996 1.80114 10.6996Z"
        stroke={
          isDark
            ? isActive
              ? "#FFF"
              : "#A1A1A1"
            : isActive
            ? "#000"
            : "#A1A1A1"
        }
        stroke-width="0.801136"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function YearCalendarIcon({ isActive, isDark }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.66667 2.7526V2.08994C8.66667 1.71927 8.36667 1.41927 7.996 1.41927H6.66667V2.08594H6V1.41927H3.33333V2.08594H2.66667V1.41927H1.33733C0.966667 1.41927 0.666667 1.71927 0.666667 2.08994V8.7486C0.666667 9.11927 0.966667 9.41927 1.33733 9.41927H7.996C8.36667 9.41927 8.66667 9.11927 8.66667 8.7486V3.41927H0.666667V2.7526H8.66667ZM6.66667 0.752604H7.996C8.73467 0.752604 9.33333 1.3506 9.33333 2.08994V8.7486C9.33342 8.92425 9.29889 9.09819 9.23171 9.26048C9.16454 9.42278 9.06603 9.57024 8.94183 9.69444C8.81763 9.81864 8.67017 9.91714 8.50788 9.98432C8.34559 10.0515 8.17165 10.086 7.996 10.0859H1.33733C1.16169 10.086 0.987747 10.0515 0.825455 9.98432C0.663162 9.91714 0.515701 9.81864 0.391501 9.69444C0.2673 9.57024 0.168796 9.42278 0.10162 9.26048C0.0344439 9.09819 -8.74594e-05 8.92425 1.66349e-07 8.7486V2.08994C1.66349e-07 1.35127 0.598 0.752604 1.33733 0.752604H2.66667V0.0859375H3.33333V0.752604H6V0.0859375H6.66667V0.752604ZM2 4.7526H3.33333V5.41927H2V4.7526ZM4 4.7526H5.33333V5.41927H4V4.7526ZM6 4.7526H7.33333V5.41927H6V4.7526ZM2 6.08594H3.33333V6.7526H2V6.08594ZM4 6.08594H5.33333V6.7526H4V6.08594ZM6 6.08594H7.33333V6.7526H6V6.08594ZM2 7.41927H3.33333V8.08594H2V7.41927ZM4 7.41927H5.33333V8.08594H4V7.41927ZM6 7.41927H7.33333V8.08594H6V7.41927Z"
        fill={
          isDark
            ? isActive
              ? "#FFF"
              : "#A1A1A1"
            : isActive
            ? "#000"
            : "#A1A1A1"
        }
      />
    </svg>
  );
}
