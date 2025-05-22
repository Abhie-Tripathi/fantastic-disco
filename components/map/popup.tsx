import { Event } from "@/types/events";
import React from "react";
import { Popup } from "react-map-gl";
import Link from "next/link";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formattedDateRange } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import { lightenColor } from "@/lib/utils";
import { Star } from "lucide-react";
import { buttonVariants } from "../ui/button";

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
    return event.basic.eventLocation
      ? event.basic.format === "online"
        ? "Online"
        : [
            event.basic.eventLocation?.locationType === "VENUE"
              ? event.basic.eventLocation?.name
              : "TBA",
            event.basic.eventLocation?.cityName,
            event.basic.eventLocation?.countryName,
          ]
            .filter(Boolean)
            .join(", ")
      : "Venue to be announced";
  };

  return (
    <Popup
      className="!max-w-[310px] !w-full bg-background rounded-md shadow-md"
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
          "h-[260px]": popupInfo.events.length > 1,
        })}
      >
        {popupInfo.events
          .sort((a, b) => {
            const startA = new Date(a.basic.startDateTime).getTime();
            const startB = new Date(b.basic.startDateTime).getTime();
            return startA - startB;
          })
          .map((event, index) => (
            <React.Fragment key={`${event.basic.id}-${index}`}>
              <div className="p-3">
                <div className="flex items-start gap-3">
                  {event.basic.logoUrl ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 border border-gray-100">
                      <img
                        src={event.basic.logoUrl}
                        alt={`${event.basic.name} logo`}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center bg-gray-50 border border-gray-100">
                      <span className="text-[#5055A3] text-2xl font-semibold">
                        {event.basic.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2 capitalize rounded-sm"
                        style={{
                          color:
                            eventTypeColors[event.basic.primaryEventType || ""],
                          backgroundColor: lightenColor(
                            eventTypeColors[event.basic.primaryEventType || ""],
                            0.9
                          ),
                        }}
                      >
                        <span>
                          {
                            eventTypeIcons[
                              event.basic.primaryEventType || "festivals"
                            ]
                          }
                        </span>
                        <span>{event.basic.primaryEventType}</span>
                      </Badge>
                      {event.basic.rating > 0 && (
                        <Badge
                          variant="outline"
                          className="text-gray-600 capitalize rounded-sm"
                        >
                          <Star className="w-3 h-3 mr-1" fill="#6F48AD" />
                          <span>{event.basic.rating}</span>
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5 line-clamp-2">
                      {event.basic.name}
                    </h3>
                    <div className="text-xs text-gray-600 mb-1">
                      {getAddress(event)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-primary">
                        {formattedDateRange(
                          event.basic.startDateTime,
                          event.basic.endDateTime
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Link
                        href={`/internal/event/${event.basic.id}`}
                        className={buttonVariants({
                          variant: "default",
                          size: "xs",
                          className: "mt-1 px-2 text-xs",
                        })}
                        target="_blank"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {index < popupInfo.events.length - 1 && (
                <div className="mx-3 border-t border-border" />
              )}
            </React.Fragment>
          ))}
      </ScrollArea>
    </Popup>
  );
}
