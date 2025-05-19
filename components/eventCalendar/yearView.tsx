import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { heatmapColors } from "./constants";
import { CalendarMonthEventWithHeatmap } from ".";
import { Alert, Event } from "@/types/events";
import { useTheme } from "@/context/theme";
import { useFilterState } from "@/hooks/useFilterState";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const YearView = ({
  date,
  events,
  unattendedEvents,
}: {
  date: Date;
  events: CalendarMonthEventWithHeatmap[];
  unattendedEvents: {
    holidays: Event[] | undefined;
    alerts: Alert[] | undefined;
  };
}) => {
  const { getFilterValue } = useFilterState();
  const searchParams = useSearchParams();
  const months = moment.months();
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const startingMonth = (function () {
    const active_gte = getFilterValue("active_gte");
    const active_lte = getFilterValue("active_lte");
    if (active_gte) {
      return moment(active_gte).format("MMMM");
    }
    if (active_lte) {
      return moment(active_lte).format("MMMM");
    }
    return moment(date).format("MMMM");
  })();

  const monthRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const startingMonthIndex = months.indexOf(startingMonth);
    if (startingMonthIndex >= 0 && monthRefs.current[startingMonthIndex]) {
      monthRefs.current[startingMonthIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [startingMonth]);

  const getMonthEvents = (month: string) => {
    const monthIndex = months.indexOf(month);
    return events.filter(
      (event) =>
        moment(event.start).month() === monthIndex &&
        moment(event.start).year() === date.getFullYear()
    );
  };

  const getMonthAlerts = (month: string) => {
    const monthIndex = months.indexOf(month);
    return unattendedEvents.alerts?.filter(
      (event) =>
        moment(event.basic.startDate).month() === monthIndex &&
        moment(event.basic.startDate).year() === date.getFullYear()
    );
  };

  const getMonthHolidays = (month: string) => {
    const monthIndex = months.indexOf(month);
    return unattendedEvents.holidays?.filter(
      (event) => moment((event as any).startDateTime).month() === monthIndex
    );
  };

  const getHeatmapColor = (category: string) => {
    const colorObj = heatmapColors.find((color) => color.name === category);
    return colorObj ? colorObj.color : "white";
  };

  // Determine if we're using condensed view for mobile
  const isCondensedView = windowWidth < 640;

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 overflow-auto px-2 md:px-4">
      {months.map((month, index) => {
        const monthEvents = getMonthEvents(month);
        const monthAlerts = getMonthAlerts(month);
        const monthHolidays = getMonthHolidays(month);

        return (
          <div
            key={month}
            ref={(el) => {
              if (el) monthRefs.current[index] = el;
            }}
            className="scroll-target mb-8"
          >
            <h3 className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
              <div className="flex items-center gap-2 mb-1 sm:mb-0">
                <div className="font-semibold text-base md:text-lg">
                  {month}
                </div>
                {monthAlerts && monthAlerts.length > 0 && (
                  <Link
                    href={`?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      view: "list",
                      active_gte: moment(
                        `${date.getFullYear()}-${index + 1}-01`
                      ).format("YYYY-MM-DD"),
                      active_lte: moment(
                        `${date.getFullYear()}-${index + 1}-01`
                      )
                        .endOf("month")
                        .format("YYYY-MM-DD"),
                    }).toString()}`}
                    className="bg-destructive text-white text-xs px-2 py-1 rounded-full hover:opacity-90"
                  >
                    {monthAlerts.length} Alert
                  </Link>
                )}
              </div>

              {monthEvents?.[0]?.monthCount ? (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {monthEvents[0].monthCount ?? 0} Events
                </span>
              ) : null}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr>
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                      (day) => (
                        <th
                          key={day}
                          className="border font-medium text-[#666666] h-8 sm:h-12 w-10 sm:w-16 text-[10px] sm:text-xs bg-[#FAFAFA] dark:bg-[#171717]"
                        >
                          {isCondensedView ? day.charAt(0) : day}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(6)].map((_, weekIndex) => (
                    <tr key={weekIndex}>
                      {[...Array(7)].map((_, dayIndex) => {
                        const firstDayOfMonth = moment(
                          `${date.getFullYear()}-${index + 1}-01`
                        );
                        const dayOfMonth =
                          weekIndex * 7 + dayIndex - firstDayOfMonth.day() + 1;
                        const isCurrentMonth =
                          dayOfMonth > 0 &&
                          dayOfMonth <= firstDayOfMonth.daysInMonth();
                        const currentDate = moment(firstDayOfMonth).add(
                          dayOfMonth - 1,
                          "days"
                        );

                        const dayEvents = monthEvents.filter((event) =>
                          moment(event.start).isSame(currentDate, "date")
                        );

                        const dayHolidays = monthHolidays?.filter((event) =>
                          moment((event as any).startDateTime).isSame(
                            currentDate,
                            "day"
                          )
                        );
                        const dayTotalEvents = dayEvents.reduce(
                          (sum, event) => sum + (event?.count || 0),
                          0
                        );
                        const dayBusinessEvents = dayEvents
                          .filter((event) => event.eventType === "business")
                          .reduce((sum, event) => sum + (event?.count || 0), 0);
                        const daySocialEvents = dayEvents
                          .filter((event) => event.eventType === "social")
                          .reduce((sum, event) => sum + (event?.count || 0), 0);

                        const heatmapCategory =
                          dayEvents[0]?.heatmapCategory || "low";
                        const backgroundColor =
                          dayTotalEvents > 0
                            ? getHeatmapColor(heatmapCategory)
                            : theme === "dark"
                            ? "#171717"
                            : "#fff";

                        return (
                          <td
                            key={dayIndex}
                            className="p-1 sm:p-2 h-12 sm:h-16 md:h-20 w-10 sm:w-16 border align-top"
                            style={{ backgroundColor }}
                          >
                            <div className="text-end text-xs sm:text-sm text-[#A8A8A8] font-medium">
                              {isCurrentMonth ? dayOfMonth : ""}
                            </div>

                            {isCurrentMonth && (
                              <>
                                {dayTotalEvents > 0 && (
                                  <div className="text-primary font-semibold text-xs sm:text-sm text-center">
                                    {dayTotalEvents}
                                  </div>
                                )}
                                <div className="flex items-center justify-center gap-[2px] mt-1">
                                  {dayBusinessEvents > 0 && (
                                    <span className="w-1 h-1 sm:w-2 sm:h-2 bg-[#9D50A3] rounded-full"></span>
                                  )}
                                  {daySocialEvents > 0 && (
                                    <span className="w-1 h-1 sm:w-2 sm:h-2 bg-[#5055A3] rounded-full"></span>
                                  )}
                                  {dayHolidays && dayHolidays.length > 0 && (
                                    <span className="w-1 h-1 sm:w-2 sm:h-2 bg-[#7D7D7D] rounded-full"></span>
                                  )}
                                </div>
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default YearView;
