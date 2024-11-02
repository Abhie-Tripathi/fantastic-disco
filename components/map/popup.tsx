import { Event } from "@/types/events";
import React from "react";
import { Popup } from "react-map-gl";
import { differenceInDays, format } from "date-fns";
import Link from "next/link";
import { eventTypeColors } from "@/constants/eventTypes";

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

interface PopupProps {
  popupInfo: Event;
  setPopupInfo: (popupInfo: Event | null) => void;
}

export default function MapPopup({ popupInfo, setPopupInfo }: PopupProps) {
  const formattedStartDate = format(popupInfo.startDateTime, "dd MMM yyyy");
  const formattedEndDate = format(popupInfo.endDateTime, "dd MMM yyyy");

  const days =
    differenceInDays(popupInfo.endDateTime, popupInfo.startDateTime) + 1;

  const formattedRange =
    formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedEndDate} (${days} ${
          days === 1 ? "day" : "days"
        })`;

  const address = popupInfo.venueLocation
    ? popupInfo.venueLocation.city?.name === "Online"
      ? "Online"
      : [
          popupInfo.venueLocation?.venue?.name,
          popupInfo.venueLocation?.city?.name,
          popupInfo.venueLocation?.state?.name,
          popupInfo.venueLocation?.country?.name,
        ]
          .filter(Boolean)
          .join(", ")
    : "";

  return (
    <Popup
      className="!max-w-[300px] !height-[138px] w-full bg-white rounded-md"
      longitude={parseFloat(
        popupInfo.venueLocation?.venue?.longitude ||
          popupInfo.venueLocation?.city?.longitude ||
          popupInfo.venueLocation?.state?.longitude ||
          "0"
      )}
      latitude={parseFloat(
        popupInfo.venueLocation?.venue?.latitude ||
          popupInfo.venueLocation?.city?.latitude ||
          popupInfo.venueLocation?.state?.latitude ||
          "0"
      )}
      anchor="bottom"
      onClose={() => setPopupInfo(null)}
      closeOnClick={false}
      closeButton={false}
      offset={10}
      closeOnMove
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2 rounded-md"
        style={{
          backgroundColor: eventTypeColors[popupInfo.primaryEventType || ""],
        }}
      />
      <div className="pl-4 pr-2 py-2">
        <div className="flex items-center justify-between pb-2 border-b">
          <div className="flex items-center gap-2">
            <img
              src={iconUrls[popupInfo.primaryEventType || "festival"]}
              alt={popupInfo.primaryEventType || "Event"}
              className="w-5 h-5"
            />
            <span className="text-primary font-medium text-xs">
              {popupInfo.primaryEventType?.toUpperCase() || "EVENT"}
            </span>
          </div>
          <Link
            href={`/internal/event/${popupInfo.id}`}
            className="text-primary text-xs py-0 h-5 pr-0"
            target="_blank"
          >
            View Details
          </Link>
        </div>
        <h3 className="font-medium text-sm my-2">{popupInfo.name}</h3>
        <p className="text-xs mb-2 font-medium">{address}</p>
        <div className="flex items-start text-xs text-primary">
          {formattedRange}
        </div>
      </div>
    </Popup>
  );
}
