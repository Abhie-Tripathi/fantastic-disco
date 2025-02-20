"use client";

import React, { useMemo } from "react";
import { Event, GTMEventDetail } from "@/types/events/events";
import { useQuery } from "@tanstack/react-query";
import { useEventsService } from "@/services/eventsService";
import Text from "../new-ui/Text";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface MapProps {
  startDate: string;
  endDate: string;
  event: GTMEventDetail;
}

const EventsListView: React.FC<MapProps> = ({
  startDate,
  endDate,

  event,
}) => {
  const {
    id,
    startDateTime,
    endDateTime,
    primaryEventType,
    venueLocation,
    categories,
    format: typeOfEvent,
  } = event;
  const eventId = id;
  const { getEventsWithSearchParams, getEventById } = useEventsService();

  const iconUrls: Record<string, string> = {
    "performing-arts": "/eventType/arts.png",
    community: "/eventType/community.png",
    concert: "/eventType/concert.png",
    conferences: "/eventType/conference.png",
    festival: "/eventType/festival.png",
    sport: "/eventType/sport.png",
    workshops: "/eventType/workshop.png",
    tradeshows: "/eventType/expo.png",
  };

  const latitude =
    event.venueLocation?.venue?.latitude ??
    event.venueLocation?.city?.latitude ??
    event.venueLocation?.state?.latitude;
  const longitude =
    event.venueLocation?.venue?.longitude ??
    event.venueLocation?.city?.longitude ??
    event.venueLocation?.state?.longitude;

  const viewBound = {
    boundType: "point",
    coordinates: {
      latitude: Number(latitude),
      longitude: Number(longitude),
      radius: 10,
    },
  };
  const viewBoundString = JSON.stringify(viewBound);

  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    const categorySlugs = categories?.map((category) => category.slug);
    searchParams.set("status", "active,cancelled,postponed,predicted");
    searchParams.set(
      "eventTypes",
      "community,concert,performing-arts,sport,festival,workshops,tradeshows,conferences"
    );
    searchParams.set("active_gte", new Date(startDate).toISOString());
    searchParams.set("view", "list");
    !latitude && !longitude
      ? searchParams.set("locationIds", venueLocation?.city.id || "")
      : searchParams.set("viewBound", viewBoundString);
    typeOfEvent &&
      (typeOfEvent === "online" || typeOfEvent === "hybrid") &&
      (searchParams.set("eventFormats", typeOfEvent),
      searchParams.set("categories", categorySlugs?.join(",") || ""));
    return searchParams;
  }, [startDate, endDate]);

  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eventDetail", startDate, endDate],
    queryFn: async () => await getEventsWithSearchParams(params.toString()),
    refetchOnWindowFocus: false,
  });

  const ListView = ({
    eventsData,
    isLoading,
  }: {
    eventsData: Event[];
    isLoading: boolean;
  }) => {
    return (
      <div className="flex w-full h-fill justify-center rounded-md bg-white">
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        ) : eventsData && eventsData.length > 0 ? (
          <ul className="flex flex-col gap-4 h-[300px] overflow-y-auto pr-2 scrollbar max-xl:h-80">
            {eventsData.map((event) => {
              const {
                id,
                name,
                format: typeOfEvent,
                startDateTime,
                endDateTime,
              } = event;
              return (
                <li
                  key={id}
                  className="bg-[#FAFAFA] border border-[var(--neutral-light-color)] p-3 rounded-sm h-auto"
                >
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`/search/${id}`}
                    className="flex gap-8 w-fill h-auto"
                  >
                    <div className="h-full w-20 flex flex-col items-center justify-center">
                      <Text color="secondary" className="text-center w-full">
                        {format(new Date(startDateTime), "dd MMM")}
                      </Text>
                      <Text color="secondary" variant="noMargin">
                        {format(new Date(startDateTime), "y")}
                      </Text>
                    </div>
                    <div className="flex flex-col flex-1">
                      <Text className="break-normal line-clamp-1">{name}</Text>
                      <Text color="secondary" variant="noMargin">
                        {(typeOfEvent &&
                          typeOfEvent?.charAt(0).toUpperCase() +
                            typeOfEvent?.slice(1)) ||
                          ""}
                      </Text>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <Text color="secondary" className="text-center">
            No nearby events found for the date
          </Text>
        )}
      </div>
    );
  };

  return (
    <ListView
      eventsData={eventsData?.events as Event[]}
      isLoading={isLoading}
    />
  );
};

export default React.memo(EventsListView);
