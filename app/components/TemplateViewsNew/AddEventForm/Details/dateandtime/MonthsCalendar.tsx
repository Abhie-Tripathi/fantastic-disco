import React, { useState, useEffect } from "react";
import styles from "./month.style.module.css";
import { useCalendarServices } from "@/services/geniservices/calendarServices";
const Calendar = ({
  cardBgColor,
  widgetId,
  onDateSelect,
  handleResetEvents,
  onMonthSelect,
}: any) => {
  const { getYearlyEvents, getMonthlyEvents } = useCalendarServices();
  const [year, setYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState<any>([]);
  const [monthlyEvents, setMonthlyEvent] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [viewMode, setViewMode] = useState<"month" | "year">("year"); // State to toggle between year and month view
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

  const hexToRgba = (hex: string, alpha: number) => {
    const hexWithoutHash = hex.replace("#", "");
    const bigint = parseInt(hexWithoutHash, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const rgbaBgColor = hexToRgba(cardBgColor, 0.4);

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
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
    onDateSelect(selectedFullDate);
    setSelectedDate(selectedFullDate);
  };

  const clearSelectedDate = () => {
    handleResetEvents();
    setSelectedDate(null);
    setSelectedMonth(null);
  };

  const handleMonthClick = (monthDate: string) => {
    if (onMonthSelect) {
      onMonthSelect(monthDate);
      setSelectedMonth(monthDate);
    }
  };
  return (
    <div className={styles.calendar} style={{ backgroundColor: rgbaBgColor }}>
      <div className={styles.yearButtons}>
        <div className={styles.navButtons}>
          <button
            className={styles.prevYear}
            onClick={handlePrevYear}
            style={{ backgroundColor: cardBgColor }}
          >
            &lt;
          </button>
          <button
            className={styles.nextYear}
            onClick={handleNextYear}
            style={{ backgroundColor: cardBgColor }}
          >
            &gt;
          </button>
        </div>

        <span style={{ cursor: viewMode === "month" ? "pointer" : "default" }}>
          {viewMode === "month" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {months[currentMonth].date} <span>{year}</span>
            </div>
          ) : (
            year
          )}
        </span>

        <div className={styles.currentMonthContainer}>
          {viewMode === "year" ? (
            <span
              className={styles.switchBtn}
              style={{ backgroundColor: cardBgColor }}
              onClick={() =>
                setViewMode(viewMode === "year" ? "month" : "year")
              }
            >
              Month
            </span>
          ) : (
            <span
              className={styles.switchBtn}
              style={{ backgroundColor: cardBgColor }}
              onClick={viewMode === "month" ? handleBackToYear : undefined}
            >
              Year
            </span>
          )}
        </div>
      </div>

      {viewMode === "year" ? (
        <>
          <div className={styles.year_calendar}>
            {months.map((month: any, index: number) => (
              <div
                key={index}
                className={styles.month}
                style={{
                  cursor: month.totalEvents > 0 ? "pointer" : "default",
                }}
                onClick={() => {
                  if (month.totalEvents > 0) {
                    handleMonthClick(month.date);
                  }
                }}
              >
                <span
                  className={styles.monthName}
                  style={{ backgroundColor: cardBgColor }}
                >
                  {month.date.slice(0, 3)}
                </span>
                <span className={styles.eventCount}>{month.totalEvents}</span>
                <span className={styles.eventCount}>events</span>
              </div>
            ))}
          </div>

          <div className={styles.selectedMonthContainer}>
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
          </div>
        </>
      ) : (
        <div className={styles.monthCalendar}>
          <div className={styles.daysGrid}>
            {dayNames.map((day, index) => (
              <div key={index} className={styles.dayName}>
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

              return (
                <div
                  key={index}
                  className={`${styles.dayCell} ${
                    isCurrentMonth
                      ? styles.isCurrentMonth
                      : styles.nonCurrentMonthDay
                  } ${
                    eventData && eventData.totalEvents > 0
                      ? styles.eventHover
                      : ""
                  }`}
                  style={
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    year === today.getFullYear()
                      ? { color: cardBgColor || "#ffeb3b" }
                      : eventData && eventData.totalEvents > 0
                      ? { color: "#ffffff" }
                      : undefined
                  }
                  onClick={() => handleDayClick(day, isCurrentMonth)}
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
          {viewMode === "month" && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;

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
