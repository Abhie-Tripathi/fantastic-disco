import React from "react";
import moment from "moment";
import NestedCircularProgress from "./circularProgress";
import { heatmapColors } from "./constants";
import { useTheme } from "@/context";
import { cn } from "@/lib/utils";

interface CustomDayHeaderProps {
  date: Date;
  label: string;
}

export const CustomDayHeader = ({ date, label }: CustomDayHeaderProps) => (
  <div
    className={`h-16 text-center w-full flex items-center justify-center flex-col border bg-[var(--heading-background-color)]`}
  >
    <div className={`text-sm font-semibold`}>
      {moment(date).format("D MMM")}
    </div>
    {/* {date.getDate() === 1 && (
      <div className="text-xs text-red-500">High Impact</div>
    )} */}
  </div>
);

interface CustomMonthHeaderProps {
  date: Date;
  label: string;
}

export const CustomMonthHeader = ({ date, label }: CustomMonthHeaderProps) => (
  <div className="h-16 text-center w-full flex items-center justify-center flex-col border bg-[var(--heading-background-color)]">
    <div className="text-sm font-semibold">{moment(date).format("ddd")}</div>
  </div>
);

interface CustomDateEventProps {
  date: Date;
  label: string;
  monthEvents: Array<{
    start: Date;
    end: Date;
    title: string;
    eventType: string;
    count: number;
    heatmapCategory: string;
  }>;
  onDateClick: (date: Date) => void;
}

export const CustomDateHeader: React.FC<CustomDateEventProps> = ({
  date,
  label,
  monthEvents,
  onDateClick,
}) => {
  const { theme } = useTheme();
  const currentDate = moment(date);
  const formattedDate = currentDate.format("YYYY-MM-DD");

  const eventsForDay = monthEvents.filter(
    (event) => moment(event.start).format("YYYY-MM-DD") === formattedDate
  );

  const businessEvents =
    eventsForDay.find((event) => event.eventType === "business")?.count || 0;
  const socialEvents =
    eventsForDay.find((event) => event.eventType === "social")?.count || 0;
  const totalEvents = businessEvents + socialEvents;

  const businessPercentage =
    totalEvents > 0 ? (businessEvents / totalEvents) * 100 : 0;
  const socialPercentage =
    totalEvents > 0 ? (socialEvents / totalEvents) * 100 : 0;

  const hasEvents = eventsForDay.length > 0;

  // Get the heatmap category for the day
  const heatmapCategory = hasEvents ? eventsForDay[0]?.heatmapCategory : null;
  const backgroundColor = hasEvents
    ? heatmapColors.find((color) => color.name === heatmapCategory)?.[theme === "light" ? "color" : "darkModeColor"]
    : "var(--primary-foreground)";

  return (
    <div
      className={cn(
        "p-2 h-[147px] flex flex-col justify-between cursor-pointer border",
        {
          "text-black": theme === "light",
        }
      )}
      style={{ backgroundColor }}
      onClick={() => onDateClick(date)}
    >
      <div className="text-lg font-semibold text-end mr-2">
        {currentDate.date()}
      </div>
      {/* {error && <div className="text-red-500">Error loading events</div>} */}
      {hasEvents && (
        <div className="flex flex-col items-center justify-center flex-grow">
          <NestedCircularProgress
            total={totalEvents}
            innerValue={businessPercentage}
            outerValue={socialPercentage}
            size={68}
          />
        </div>
      )}
    </div>
  );
};
