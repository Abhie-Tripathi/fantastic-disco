// import React, { useState, useEffect } from "react";
// import styles from "./month.style.module.css";
// import { useCalendarServices } from "@/services/geniservices/calendarServices";
// const Calendar = ({ cardBgColor, currentYear }: any) => {
//   const { getYearlyEvents, getMonthlyEvents } = useCalendarServices();
//   const [year, setYear] = useState(currentYear);
//   const [months, setMonths] = useState<any>([]);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [viewMode, setViewMode] = useState<"month" | "year">("year"); // State to toggle between year and month view

//   const handlePrevYear = () => {
//     if (viewMode === "year") {
//       setYear(year - 1);
//     } else {
//       setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
//       if (currentMonth === 0) {
//         setYear(year - 1); // If it's January, go back to the previous year
//       }
//     }
//   };

//   const handleNextYear = () => {
//     if (viewMode === "year") {
//       setYear(year + 1); // Change year when in year view
//     } else {
//       setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
//       if (currentMonth === 11) {
//         setYear(year + 1);
//       }
//     }
//   };

//   const handleMonthClick = (index: number) => {
//     setCurrentMonth(index);
//     setViewMode("month");
//   };

//   const handleBackToYear = () => {
//     setViewMode("year");
//   };

//   const hexToRgba = (hex: string, alpha: number) => {
//     const hexWithoutHash = hex.replace("#", "");
//     const bigint = parseInt(hexWithoutHash, 16);
//     const r = (bigint >> 16) & 255;
//     const g = (bigint >> 8) & 255;
//     const b = bigint & 255;
//     return `rgba(${r}, ${g}, ${b}, ${alpha})`;
//   };

//   const rgbaBgColor = hexToRgba(cardBgColor, 0.4);

//   const getDaysInMonth = (month: number, year: number) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (month: number, year: number) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const generateDays = (month: number, year: number) => {
//     const daysInMonth = getDaysInMonth(month, year);
//     const firstDay = getFirstDayOfMonth(month, year);

//     const days = [];
//     const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

//     for (let i = 0; i < totalCells; i++) {
//       if (i >= firstDay && i < firstDay + daysInMonth) {
//         days.push(i - firstDay + 1);
//       } else {
//         days.push(null);
//       }
//     }
//     return days;
//   };

//   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const monthOrder = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   // Function to fetch and sort data
//   const getYearlyCalendarData = async () => {
//     const data = await getYearlyEvents();
//     const sortedMonths = data.sort(
//       (a: any, b: any) =>
//         monthOrder.indexOf(a.date) - monthOrder.indexOf(b.date)
//     );
//     setMonths(sortedMonths);
//   };

//   useEffect(() => {
//     getYearlyCalendarData();
//   }, []);

//   const getMonthlyCalendarData = async () => {
//     const res = await getMonthlyEvents();
//     console.log("res_data", res);
//   };
//   useEffect(() => {
//     getMonthlyCalendarData();
//   }, []);

//   const today = new Date();
//   return (
//     <div className={styles.calendar} style={{ backgroundColor: rgbaBgColor }}>
//       <div className={styles.yearButtons}>
//         <button
//           className={styles.prevYear}
//           onClick={handlePrevYear}
//           style={{ backgroundColor: cardBgColor }}
//         >
//           &lt;
//         </button>

//         <span
//           style={{ cursor: viewMode === "month" ? "pointer" : "default" }}
//         >
//           {viewMode === "month" ? (
//             <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
//               {months[currentMonth].date} <span>{year}</span>
//             </div>
//           ) : (
//             year
//           )}
//         </span>

//         <button
//           className={styles.nextYear}
//           onClick={handleNextYear}
//           style={{ backgroundColor: cardBgColor }}
//         >
//           &gt;
//         </button>

//         <div className={styles.currentMonthContainer}>
//           {viewMode === "year" ? (
//             <span
//               className={styles.switchBtn}
//               style={{ backgroundColor: cardBgColor }}
//               onClick={() =>
//                 setViewMode(viewMode === "year" ? "month" : "year")
//               }
//             >
//               Month
//             </span>
//           ) : (
//             <span
//               className={styles.switchBtn}
//               style={{ backgroundColor: cardBgColor }}
//               onClick={viewMode === "month" ? handleBackToYear : undefined}
//             >
//               Year
//             </span>
//           )}
//         </div>
//       </div>

//       {viewMode === "year" ? (
//         <div className={styles.body}>
//           {months.map((month: any, index: number) => (
//             <div
//               key={index}
//               className={styles.month}
//             >
//               <span
//                 className={styles.monthName}
//                 style={{ backgroundColor: cardBgColor }}
//               >
//                 {month.date.slice(0, 3)}
//               </span>
//               <span className={styles.eventCount}>{month.totalEvents}</span>
//               <span className={styles.eventCount}>events</span>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className={styles.monthCalendar}>
//           <div className={styles.daysGrid}>
//             {dayNames.map((day, index) => (
//               <div key={index} className={styles.dayName}>
//                 {day}
//               </div>
//             ))}
//             {generateDays(currentMonth, year).map((day, index) => (
//               <div
//                 key={index}
//                 style={
//                   day &&
//                   day === today.getDate() &&
//                   currentMonth === today.getMonth() &&
//                   year === today.getFullYear()
//                     ? { color: cardBgColor || "#ffeb3b" } // Fallback color
//                     : undefined
//                 }
//               >
//                 {day ? (
//                   <span className={styles.dayNumber}>{day}</span>
//                 ) : (
//                   <span className={styles.emptyDay}></span>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Calendar;
