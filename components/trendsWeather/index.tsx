import { Event } from "@/types/events";
import { format } from "date-fns";
import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { EventDate } from "@/types/events";
// import EventsListView from "../detailPageEventsList/eventsListView";
// import EventsMapView from "../detailPageEventsList/eventsMapView";
import { isEventeli } from "@/config";
interface Props {
  eventDetails: Event["basic"];
  venueLocation: Event["basic"]["eventLocation"] | null;
  startDateTime: string;
  endDateTime: string;
}
export const DetailMapComponent = ({
  eventDetails,
  venueLocation,
  startDateTime,
  endDateTime,
}: Props) => {
  const { format: typeOfEvent } = eventDetails;
  const currentDate = new Date().toISOString().split("T")[0];
  const isFirstRender = useRef(true);
  const [api, setApi] = useState<CarouselApi>();
  const [activeDate, setActiveDate] = useState<string>();
  const [weatherActiveDate, setWeatherActiveDate] = useState(() => {
    return startDateTime &&
      endDateTime &&
      currentDate >= startDateTime &&
      currentDate <= endDateTime
      ? currentDate
      : startDateTime;
  });
  const [dates, setDates] = useState<EventDate[]>();
  // const [weatherInfo, setWeatherInfo] = useState<Weather>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // const { getDateRangeWeatherData, getWeatherData } = useMiscService();
  const [eventDateRange, setEventDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: startDateTime, endDate: endDateTime });
  const latitude =
    venueLocation?.venue?.latitude ??
    venueLocation?.city?.latitude ??
    venueLocation?.state?.latitude ??
    "";
  const longitude =
    venueLocation?.venue?.longitude ??
    venueLocation?.city?.longitude ??
    venueLocation?.state?.longitude ??
    "";

  useMemo(() => {
    const generateEventDates = (
      startDate: string | null,
      endDate: string | null
    ): void => {
      const start = new Date(startDate || "");
      const end = new Date(endDate || "");
      const adjustedStartDateTime = new Date(start);
      adjustedStartDateTime.setDate(adjustedStartDateTime.getDate() - 1);

      const adjustedEndDateTime = new Date(end);
      adjustedEndDateTime.setDate(adjustedEndDateTime.getDate() + 4);

      const dates: EventDate[] = [];

      for (
        let currentDate = adjustedStartDateTime;
        currentDate <= adjustedEndDateTime;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const isEventDay = currentDate >= start && currentDate <= end;

        dates.push({
          date: currentDate.getDate(),
          month: format(currentDate, "MMM").toUpperCase(),
          formattedDate: format(currentDate, "yyyy-MM-dd"),
          isEventDay,
        });
      }
      setDates(dates);
    };
    generateEventDates(
      startDateTime && startDateTime.split("T")[0],
      endDateTime && endDateTime.split("T")[0]
    );
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (activeDate) {
      setEventDateRange((prev) => ({
        ...prev,
        startDate: activeDate,
        endDate: activeDate,
      }));
    }
  }, [activeDate]);

  useEffect(() => {
    if (!dates) return;
    const index = dates.findIndex((date) => date.formattedDate === activeDate);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [activeDate, dates]);

  useEffect(() => {
    if (!api) {
      return;
    }
    api.scrollTo(activeIndex, false);
  }, [api]);
  return (
    <>
      {venueLocation && typeOfEvent !== "online" && (
        <div className="flex flex-col gap-4 max-xl:justify-around h-auto">
          <div className="flex flex-col gap-4">
            <div className="flex-1 bg-[#EBEBEB] h-[450px]">
              {/* {isEventeli && venueLocation && typeOfEvent === "online" ? (
                <EventsListView
                  startDate={eventDateRange.startDate}
                  endDate={eventDateRange.endDate}
                  event={eventDetails}
                />
              ) : (
                <EventsMapView
                  event={eventDetails}
                  startDate={eventDateRange.startDate}
                  endDate={eventDateRange.endDate}
                  zoom={10}
                  style={{
                    width: "100%",
                    height: "308px",
                  }}
                />
              )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
