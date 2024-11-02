import React from "react";
import moment from "moment";
import { heatmapColors } from "./constants"; // Import heatmapColors from parent component
import { CalendarMonthEventWithHeatmap } from ".";

const YearView = ({
  date,
  events,
}: {
  date: Date;
  events: CalendarMonthEventWithHeatmap[];
}) => {
  const months = moment.months();

  const getMonthEvents = (month: string) => {
    const monthIndex = months.indexOf(month);
    return events.filter((event) => moment(event.start).month() === monthIndex);
  };

  const getHeatmapColor = (category: string) => {
    const colorObj = heatmapColors.find((color) => color.name === category);
    return colorObj ? colorObj.color : "white";
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {months.map((month, index) => {
        const monthEvents = getMonthEvents(month);
        const totalEvents = monthEvents.reduce(
          (sum, event) => sum + (event?.count || 0),
          0
        );
        const businessEvents = monthEvents
          .filter((event) => event.eventType === "business")
          .reduce((sum, event) => sum + (event?.count || 0), 0);
        const socialEvents = monthEvents
          .filter((event) => event.eventType === "social")
          .reduce((sum, event) => sum + (event?.count || 0), 0);

        return (
          <div key={month}>
            <h3 className="font-semibold mb-4 flex gap-5">
              {month}
              {totalEvents > 0 && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {totalEvents} Events
                </span>
              )}
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
                      const dayOfMonth =
                        weekIndex * 7 +
                        dayIndex -
                        moment(`${date.getFullYear()}-${index + 1}-01`).day() +
                        1;
                      const isCurrentMonth =
                        dayOfMonth > 0 &&
                        dayOfMonth <=
                          moment(
                            `${date.getFullYear()}-${index + 1}`,
                            "YYYY-MM"
                          ).daysInMonth();
                      const currentDate = moment(
                        `${date.getFullYear()}-${index + 1}-${dayOfMonth}`,
                        "YYYY-MM-DD"
                      );
                      const dayEvents = monthEvents.filter((event) =>
                        moment(event.start).isSame(currentDate, "day")
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

                          {isCurrentMonth && dayTotalEvents > 0 && (
                            <>
                              <div className="text-primary font-semibold text-sm text-center mb-1">
                                {dayTotalEvents}
                              </div>
                              <div className="flex items-center justify-center gap-[2px]">
                                {dayBusinessEvents > 0 && (
                                  <span className="w-[10px] h-[10px] bg-[#9D50A3] rounded-full"></span>
                                )}
                                {daySocialEvents > 0 && (
                                  <span className="w-[10px] h-[10px] bg-[#5055A3] rounded-full"></span>
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
