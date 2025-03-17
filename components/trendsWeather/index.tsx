import Text from "@/components/new-ui/Text";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { isEventeli } from "@/config";
import { useMiscService } from "@/services/miscService";
import { Weather } from "@/types";
import { Event } from "@/types/events";
import { EventDate } from "@/types/events/eventDetail";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import EventsListView from "../eventDetail/eventsListView";
import EventsMapView from "../eventDetail/eventsMapView";
import { EventDetailMapSkeleton } from "../eventDetail/skeletons";
interface Props {
  eventDetails: Event;
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
  const { format: typeOfEvent } = eventDetails.basic || {};
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
  const [weatherInfo, setWeatherInfo] = useState<Weather>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { getWeatherData } = useMiscService();
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

      // Adjust startDateTime to three day before and endDateTime to three day after
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

  const { data: weatherData } = useQuery<Weather | undefined>({
    queryKey: [weatherActiveDate],
    queryFn: async () =>
      getWeatherData(latitude, longitude, weatherActiveDate ?? ""),
    refetchOnWindowFocus: false,
    enabled: isEventeli,
    gcTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (weatherData) {
      setWeatherInfo(weatherData);
    }
  }, [weatherData]);

  const minTemp =
    weatherData &&
    weatherData.temperature.min &&
    Math.floor(weatherData.temperature.min);
  const maxTemp =
    weatherData &&
    weatherData.temperature.max &&
    Math.ceil(weatherData.temperature.max);
  return !isEventeli && typeOfEvent !== "online" ? (
    <div className="flex flex-col gap-4 max-xl:justify-around h-auto">
      <div className="flex flex-col gap-4">
        <div className="flex-1 bg-[#EBEBEB] h-[450px]">
          {typeOfEvent !== "online" && (
            <EventsMapView
              event={eventDetails.basic || {}}
              startDate={eventDateRange.startDate}
              endDate={eventDateRange.endDate}
              zoom={10}
              style={{
                width: "100%",
                height: "308px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    isEventeli && (
      <div className="flex flex-col gap-4 max-xl:justify-around h-auto">
        {isEventeli
          ? typeOfEvent !== "online" && (
              <div className="flex justify-center items-center w-full max-[1756px]:w-80 self-center">
                <Carousel
                  setApi={setApi}
                  className="w-full max-w-sm px-4 cursor-pointer"
                >
                  <CarouselContent className="-ml-1">
                    {dates &&
                      dates.length > 0 &&
                      dates.map((date) => (
                        <CarouselItem
                          key={date.formattedDate}
                          className="pl-2 basis-[18%] carousel-item"
                        >
                          <div className="p-1 text-center">
                            <span className="text-sm">{date.month}</span>
                            <Card
                              className={`rounded-sm ${
                                date.formattedDate === activeDate
                                  ? "bg-[#6750A4] text-[#fff]"
                                  : date.isEventDay
                                  ? `bg-[#E6E6F9] dark:bg-[#A099E0] text-[#000] dark:text-white border border-[#A099E0]`
                                  : `bg-[#fff] dark:bg-[var(--primary-foreground)] text-[#000] dark:text-white`
                              }`}
                              onClick={() => {
                                setActiveDate(date.formattedDate);
                                setWeatherActiveDate(date.formattedDate);
                              }}
                            >
                              <CardContent className="flex aspect-square items-center justify-center p-0">
                                <span className="text-sm font-medium">
                                  {date.date}
                                </span>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-[#F2F2F2] dark:bg-[#292929] rounded-sm border-[var(--neutral-light-color)] w-12 h-12  my-[0.8rem] max-[1756px]:w-9 max-[1756px]:h-9 max-[1756px]:absolute max-[1756px]:-left-4" />
                  <CarouselNext className="bg-[#F2F2F2] dark:bg-[#292929] rounded-sm border-[var(--neutral-light-color)] w-12 h-12 my-[0.8rem] max-[1756px]:w-9 max-[1756px]:h-9 max-[1756px]:absolute max-[1756px]:-right-4" />
                </Carousel>
              </div>
            )
          : null}
        {isEventeli
          ? typeOfEvent !== "online" && (
              <div className="flex justify-between border-t-2 pt-4">
                <Text color="secondary">
                  {[
                    venueLocation?.city?.name,
                    venueLocation?.state?.name,
                    venueLocation?.country?.name,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
                <Text color="primary" size="large" fontWeight="bold">
                  {minTemp && (
                    <span className="mr-1">
                      {minTemp} <sup>°C</sup>
                    </span>
                  )}
                  {minTemp && maxTemp && <span>{"-"}</span>}
                  {maxTemp && (
                    <span className="ml-1">
                      {maxTemp} <sup>°C</sup>
                    </span>
                  )}
                </Text>
              </div>
            )
          : null}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-[#EBEBEB] h-[450px]">
            {isEventeli
              ? typeOfEvent === "online" && (
                  <EventsListView
                    startDate={eventDateRange.startDate}
                    endDate={eventDateRange.endDate}
                    event={eventDetails.basic || {}}
                  />
                )
              : null}
            {typeOfEvent !== "online" && (
              <EventsMapView
                event={eventDetails.basic || {}}
                startDate={eventDateRange.startDate}
                endDate={eventDateRange.endDate}
                zoom={10}
                style={{
                  width: "100%",
                  height: isEventeli ? "430px" : "308px",
                }}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};
