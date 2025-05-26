"use client";

import { useEventsService } from "@/services/eventsService";
import { Event } from "@/types/events/events";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import Text from "../new-ui/Text";

interface MapProps {
  startDate: string;
  endDate: string;
  event: Event["basic"];
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
    eventLocation,
    categories,
    format: typeOfEvent,
  } = event;
  const eventId = id;
  const { getEvents } = useEventsService();

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

  const latitude = eventLocation?.latitude;
  const longitude = eventLocation?.longitude;

  const viewBound = {
    boundType: "point",
    coordinates: {
      latitude: Number(latitude),
      longitude: Number(longitude),
      radius: 10,
    },
  };
  const viewBoundString = JSON.stringify(viewBound);
  const categorySlugs =
    (categories &&
      categories.length > 0 &&
      categories?.map((category) => category.slug)) ||
    [];

  const {
    data: eventsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["eventDetail", startDate, endDate],
    queryFn: async () =>
      await getEvents({
        view: "list",
        status: "active,cancelled,postponed",
        eventTypes:
          "community,concert,performing-arts,sport,festival,workshops,tradeshows,conferences",
        ...(startDate && { active_gte: new Date(startDate).toISOString() }),
        ...((typeOfEvent === "online" || typeOfEvent === "hybrid") && {
          eventFormats: typeOfEvent,
        }),
        ...(categorySlugs &&
          categorySlugs.length > 0 && { categories: categorySlugs.join(",") }),
      }),
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
      <div className="flex flex-col w-full h-fill gap-8 rounded-md bg-white">
        <h1 className="font-medium">
          Other online events in the same industry
        </h1>
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-black self-center" />
        ) : eventsData && eventsData.length > 0 ? (
          <ul className="flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-2 scrollbar max-xl:h-80">
            {eventsData.map((event) => {
              const {
                id,
                name,
                format: typeOfEvent,
                startDateTime,
                endDateTime,
              } = event.basic || {};
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
