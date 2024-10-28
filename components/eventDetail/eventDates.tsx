import { Event } from "@/types/events";
import { differenceInDays, format } from "date-fns";
import Text from "../new-ui/Text";
import { useState } from "react";
import { MouseEvent } from "react";
interface IProps {
  eventDetails: any;
}

interface EventDate {
  event: {
    dates: string;
    startTime: string;
    endTime: string;
  };
  dayNo: number;
}

type Ttabs = "Exhibitors" | "Visitors";

const EventDateCard = ({ event, dayNo }: EventDate) => {
  const { dates, startTime, endTime } = event;
  return (
    <div className="flex bg-[#FAFAFA] border border-[#EBEBEB] rounded-sm p-3 gap-10">
      <div className="flex flex-col gap-4">
        <div className="bg-[#6750A4] text-[#ffffff] rounded-sm w-fit py-2 px-3 font-semibold">
          Day {dayNo}
        </div>
        <p className="font-medium">{format(new Date(dates), "dd MMM yyyy")}</p>
      </div>
      <p className="self-center text-[#666666] font-medium">{`${startTime} - ${endTime}`}</p>
    </div>
  );
};

const EventDates = ({ eventDetails }: IProps) => {
  const { startDateTime, endDateTime, timings } = eventDetails;
  const [activeTab, setActiveTab] = useState<Ttabs>("Exhibitors");
  const eventDatesArray =
    timings &&
    Object.keys(timings).length ===
      differenceInDays(new Date(endDateTime), new Date(startDateTime)) + 1
      ? Object.entries(timings).map(([dates, times]: any) => ({
          dates,
          startTime: times.startTime,
          endTime: times.endTime,
        }))
      : (() => {
          const fallBackEventDatesArray = [];
          const start = new Date(startDateTime);
          const end = new Date(endDateTime);

          for (
            let date = start;
            date <= end;
            date.setDate(date.getDate() + 1)
          ) {
            fallBackEventDatesArray.push({
              dates: new Date(date).toISOString().split("T")[0],
              startTime: "9:00 AM",
              endTime: "6:00 PM",
            });
          }
          return fallBackEventDatesArray;
        })();
  const handleActiveTab = (e: MouseEvent<HTMLButtonElement>): void => {
    const tab = e.currentTarget.getAttribute("data-id");
    tab && setActiveTab(tab as Ttabs);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {startDateTime && endDateTime && (
          <>
            <p className="font-semibold text-[#6750A4]">
              {differenceInDays(
                new Date(endDateTime),
                new Date(startDateTime)
              ) + 1}{" "}
              day Event
            </p>
            <Text
              color="secondary"
              variant="noMargin"
              size="normal"
              fontWeight="medium"
            >{`(${format(new Date(startDateTime), "d MMM yyyy")} - ${format(
              new Date(endDateTime),
              "d MMM yyyy"
            )})`}</Text>
          </>
        )}
      </div>
      <div className="bg-[#F2F2F2] rounded-md flex items-center gap-2 p-2">
        <button
          className={`${
            activeTab === "Exhibitors"
              ? "bg-[#ffffff] text-[var(--primary-text-color)]"
              : "bg-transparent text-[#666666]"
          } rounded flex items-center gap-2 min-w-[210px] h-9 justify-center font-medium transition-colors`}
          onClick={handleActiveTab}
          data-id="Exhibitors"
        >
          <span className="text-sm font-medium">Exhibitors</span>
          {/* <InformationFill color={activeTab === "Time Trends" ? "#E6E6E6" : "#666666"} width="14px" height="14px" /> */}
        </button>
        <button
          className={`${
            activeTab === "Visitors"
              ? "bg-[#ffffff] text-[var(--primary-text-color)]"
              : "bg-transparent text-[#666666]"
          } rounded flex items-center gap-2 min-w-[210px] h-9 justify-center font-medium transition-colors`}
          onClick={handleActiveTab}
          data-id="Visitors"
        >
          <span className="text-sm font-medium">Visitors</span>
          {/* <InformationFill color={activeTab === "Category Trends" ? "#E6E6E6" : "#666666"} width="14px" height="14px" /> */}
        </button>
      </div>
      {eventDatesArray.length > 0 && (
        <div className="flex flex-col gap-8 mt-4 overflow-y-auto scrollbar h-[250px] pr-4">
          {eventDatesArray.map((event, index) => (
            <EventDateCard key={index} event={event} dayNo={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
export default EventDates;
