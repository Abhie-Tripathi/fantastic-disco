import React, { useEffect, useState } from "react";
import moment from "moment";
import NestedCircularProgress from "./circularProgress";
import { heatmapColors } from "./constants";
import { Alert, Event } from "@/types/events";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { alertIcons, getAlertLevelBorderColor } from "@/constants/eventTypes";
import { cn } from "@/lib/utils";
import { formattedDateRange } from "@/utils/date";
import { useTheme } from "@/context/theme";

interface CustomDayHeaderProps {
  date: Date;
  label: string;
  alerts: any[] | undefined;
}

export const CustomDayHeader = ({
  date,
  label,
  alerts,
}: CustomDayHeaderProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const alertsForDay = alerts?.filter(
    (alert) =>
      moment(alert.startDate).format("YYYY-MM-DD") ===
      moment(date).format("YYYY-MM-DD")
  );

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div
      className={`h-16 text-center w-full flex items-center justify-center flex-col border bg-[#FAFAFA] dark:bg-[#171717] relative`}
    >
      <div className={`text-sm font-semibold`}>
        {moment(date).format("D MMM")}
      </div>

      {alertsForDay && alertsForDay.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className="text-xs text-red-500"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {alertsForDay.length}{" "}
            {alertsForDay.length === 1 ? "Alert" : "Alerts"}
          </PopoverTrigger>
          <PopoverContent>
            {alertsForDay.map((alertForDay) => (
              <div className="text-left" key={alertForDay.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize text-muted-foreground">
                    {alertForDay.type.toLowerCase()}
                  </span>
                  <span
                    className={cn(
                      "p-1 border-2 rounded-sm",
                      getAlertLevelBorderColor(alertForDay.level.toLowerCase())
                    )}
                  >
                    {alertIcons[alertForDay.type]}
                  </span>
                </div>
                <p className="text-sm">
                  {alertForDay.name || `New ${alertForDay.type} alert`}
                </p>
                <time className="text-xs text-muted-foreground">
                  {formattedDateRange(
                    alertForDay.startDate,
                    alertForDay.endDate
                  )}
                </time>
              </div>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

interface CustomMonthHeaderProps {
  date: Date;
  label: string;
}

export const CustomMonthHeader = ({ date, label }: CustomMonthHeaderProps) => (
  <div className="h-16 text-center w-full flex items-center justify-center flex-col border bg-[#FAFAFA] dark:bg-[#171717]">
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
  unAttended: {
    holidays: Event[] | undefined;
    alerts: any[] | undefined;
  };
  onDateClick: (date: Date) => void;
}

export const CustomDateHeader: React.FC<CustomDateEventProps> = ({
  date,
  label,
  monthEvents,
  unAttended,
  onDateClick,
}) => {
  const [open, setOpen] = useState(false);
  const currentDate = moment(date);
  const { theme } = useTheme();
  const formattedDate = currentDate.format("YYYY-MM-DD");
  const eventsForDay = monthEvents.filter(
    (event) => moment(event.start).format("YYYY-MM-DD") === formattedDate
  );
  const holidayEventForDay = unAttended.holidays?.filter(
    (event) =>
      moment(event.basic.startDateTime).format("YYYY-MM-DD") === formattedDate
  );
  const alertEventsForDay = unAttended.alerts?.filter(
    (event: Alert) =>
      moment(event.startDate).format("YYYY-MM-DD") === formattedDate
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

  const heatmapCategory = hasEvents ? eventsForDay[0]?.heatmapCategory : null;
  const backgroundColor = hasEvents
    ? heatmapColors.find((color) => color.name === heatmapCategory)?.color
    : theme === "dark" ? "#171717" : "#fff";

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div
      className={`relative p-2 h-36 flex flex-col justify-between ${
        hasEvents ? "cursor-pointer" : ""
      } border-r-[0.5px] border-l-[0.5px]`}
      style={{ backgroundColor }}
      onClick={hasEvents ? () => onDateClick(date) : undefined}
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

      {holidayEventForDay && holidayEventForDay[0] && (
        <div className="relative mt-2 bg-background border rounded-tr-md rounded-br-md text-center text-[#7d7d7d] text-sm font-medium shadow-sm truncate px-4">
          <div className="absolute left-0 top-0 bg-[#7d7d7d] w-1 h-full"></div>
          {holidayEventForDay[0].basic.name.replace(/\s*\(.*?\)\s*/g, "")}
        </div>
      )}

      {alertEventsForDay && alertEventsForDay[0] && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "absolute top-2 left-2 border-2 p-1 rounded-sm bg-background",
              getAlertLevelBorderColor(alertEventsForDay[0].level)
            )}
          >
            {alertIcons[alertEventsForDay[0].type]}
          </PopoverTrigger>
          <PopoverContent
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium capitalize text-muted-foreground">
                  {alertEventsForDay[0].type.toLowerCase()}
                </span>
                <span
                  className={cn(
                    "p-1 border-2 rounded-sm",
                    getAlertLevelBorderColor(
                      alertEventsForDay[0].level.toLowerCase()
                    )
                  )}
                >
                  {alertIcons[alertEventsForDay[0].type]}
                </span>
              </div>
              <p className="text-sm">
                {alertEventsForDay[0].name ||
                  `New ${alertEventsForDay[0].type} alert`}
              </p>
              <time className="text-xs text-muted-foreground">
                {formattedDateRange(
                  alertEventsForDay[0].startDate,
                  alertEventsForDay[0].endDate
                )}
              </time>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
