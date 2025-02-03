import { Event } from "@/types/events";
import React from "react";
import { Popup } from "react-map-gl";
import Link from "next/link";
import { eventTypeColors } from "@/constants/eventTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formattedDateRange } from "@/utils/date";

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

interface Coordinates {
  latitude: string;
  longitude: string;
}

interface PopupInfo {
  events: Event[];
  coordinates: Coordinates;
}

interface PopupProps {
  popupInfo: {
    coordinates: {
      latitude: string;
      longitude: string;
    };
    events: Event[];
  };
  setPopupInfo: (popupInfo: any | null) => void;
}

export default function MapPopup({ popupInfo, setPopupInfo }: PopupProps) {
  if (!popupInfo || popupInfo.events.length === 0) return null;

  const getAddress = (event: Event) => {
    return event.venueLocation
      ? event.venueLocation.city?.name === "Online"
        ? "Online"
        : [
            event.venueLocation?.venue?.name,
            event.venueLocation?.city?.name,
            event.venueLocation?.state?.name,
            event.venueLocation?.country?.name,
          ]
            .filter(Boolean)
            .join(", ")
      : "";
  };

  return (
    <Popup
      className="!max-w-[300px] !w-full bg-background rounded-md shadow-md"
      longitude={parseFloat(popupInfo.coordinates.longitude)}
      latitude={parseFloat(popupInfo.coordinates.latitude)}
      anchor="bottom"
      onClose={() => setPopupInfo(null)}
      closeOnClick={false}
      closeButton={false}
      offset={10}
      closeOnMove
    >
      <ScrollArea
        className={cn("w-full rounded-md", {
          "h-[260px] p-2": popupInfo.events.length > 1,
        })}
      >
        {popupInfo.events
          .sort((a, b) => {
            const startA = new Date(a.startDateTime).getTime();
            const startB = new Date(b.startDateTime).getTime();
            return (
              startA - startB ||
              new Date(a.endDateTime).getTime() -
                new Date(b.endDateTime).getTime()
            );
          })
          .map((event, index) => (
            <React.Fragment key={`${event.id}-${index}`}>
              <div className="relative pl-4 pr-2 py-2">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-md"
                  style={{
                    backgroundColor:
                      eventTypeColors[event.primaryEventType || ""],
                  }}
                />
                <div className="flex items-center justify-between pb-2 border-b">
                  <div className="flex items-center gap-2">
                    <img
                      src={iconUrls[event.primaryEventType || "festival"]}
                      alt={event.primaryEventType || "Event"}
                      className="w-5 h-5"
                    />
                    <span className="text-primary font-medium text-xs">
                      {event.primaryEventType?.toUpperCase() || "EVENT"}
                    </span>
                  </div>
                  <Link
                    href={`/search/${event.id}`}
                    className="text-primary text-xs py-0 h-5 pr-0"
                    target="_blank"
                  >
                    View Details
                  </Link>
                </div>
                <h3 className="font-medium text-sm my-2">{event.name}</h3>
                <p className="text-xs mb-2 font-medium">{getAddress(event)}</p>
                <div className="flex items-start text-xs text-primary">
                  {formattedDateRange(event.startDateTime, event.endDateTime)}
                </div>
              </div>
              {index < popupInfo.events.length - 1 && (
                <div className="my-2 border-t border-border" />
              )}
            </React.Fragment>
          ))}
      </ScrollArea>
    </Popup>
  );
}