import React, { useEffect, useRef } from "react";
import moment from "moment";
import { heatmapColors } from "./constants";
import { CalendarMonthEventWithHeatmap } from ".";
import { Alert, Event } from "@/types/events";
import { Badge } from "../ui/badge";
import { useFilterState } from "@/hooks/useFilterState";

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
  const months = moment.months();

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
        moment(event.startDate).month() === monthIndex &&
        moment(event.startDate).year() === date.getFullYear()
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-auto">
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
            className="scroll-target"
          >
            <h3 className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="font-semibold flex gap-5 ">{month}</div>
                {monthAlerts && monthAlerts.length > 0 && (
                  <span className="bg-destructive text-white text-xs px-2 py-1 rounded-full">
                    {monthAlerts.length} Alert
                  </span>
                )}
              </div>

              {monthEvents?.[0]?.monthCount ? (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {monthEvents[0].monthCount ?? 0} Events
                </span>
              ) : null}
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                    (day) => (
                      <th
                        key={day}
                        className="border font-medium text-[#666666] h-12 w-[calc(100%/7)] text-xs bg-[#FAFAFA]"
                      >
                        {day}
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
                        moment((event as any).startDateTime).isSame(currentDate, "day")
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
                          : "white";

                      return (
                        <td
                          key={dayIndex}
                          className="p-2 h-20 aspect-square border align-top"
                          style={{ backgroundColor }}
                        >
                          <div className="text-end text-base text-[#A8A8A8] font-medium">
                            {isCurrentMonth ? dayOfMonth : ""}
                          </div>

                          {isCurrentMonth && (
                            <>
                              {dayTotalEvents > 0 && (
                                <div className="text-primary font-semibold text-sm text-center mb-1">
                                  {dayTotalEvents}
                                </div>
                              )}
                              <div className="flex items-center justify-center gap-[2px]">
                                {dayBusinessEvents > 0 && (
                                  <span className="w-[10px] h-[10px] bg-[#9D50A3] rounded-full"></span>
                                )}
                                {daySocialEvents > 0 && (
                                  <span className="w-[10px] h-[10px] bg-[#5055A3] rounded-full"></span>
                                )}
                                {dayHolidays && dayHolidays.length > 0 && (
                                  <span className="w-[10px] h-[10px] bg-[#7D7D7D] rounded-full"></span>
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
        );
      })}
    </div>
  );
};

export default YearView;
