import React from "react";
import { Users, Building2, Laptop } from "lucide-react";
import { eventTypeColors, groupedEventTypes } from "./constants";
import { Event } from "./types";
import concert from "/public/eventType/concert.svg";
import protest from "/public/eventType/protest.svg";
import sports from "/public/eventType/sport.svg";
import expo from "/public/eventType/expo.svg";
import conference from "/public/eventType/conference.svg";
import festivals from "/public/eventType/festival.svg";
import Workshops from "/public/eventType/workshop.svg";
import performingArts from "/public/eventType/arts.svg";
import community from "/public/eventType/community.svg";
import Image from "next/image";
import Link from "next/link";

const eventTypeIcons: Record<string, JSX.Element> = {
  conferences: <Image src={conference} alt="conference" className="w-8 h-8" />,
  concert: <Image src={concert} alt="concert" className="w-8 h-8" />,
  protest: <Image src={protest} alt="protest" className="w-8 h-8" />,
  sport: <Image src={sports} alt="sports" className="w-8 h-8" />,
  tradeshows: <Image src={expo} alt="expo" className="w-8 h-8" />,
  festival: <Image src={festivals} alt="festivals" className="w-8 h-8" />,
  workshops: <Image src={Workshops} alt="Workshops" className="w-8 h-8" />,
  "performing-arts": (
    <Image src={performingArts} alt="performing-arts" className="w-8 h-8" />
  ),
  community: <Image src={community} alt="community" className="w-8 h-8" />,
};

export const CustomEvent = ({ event }: { event: Event }) => {
  return (
    <Link
      href={`/search/${event.id}`}
      className="mt-3 flex items-center p-2 pl-6 gap-2 h-16 rounded-md text-sm text-[#171717] relative overflow-hidden"
      style={{
        backgroundColor: eventTypeColors[event?.eventType] || "#F0F0F0",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-2 rounded-tl-md rounded-bl-md"
        style={{
          backgroundColor: groupedEventTypes.business.includes(event.eventType)
            ? "#5055A3"
            : groupedEventTypes.social.includes(event.eventType)
            ? "#9D50A3"
            : "#7D7D7D",
        }}
      />
      {eventTypeIcons[event.eventType]}
      <span className="ml-1 overflow-hidden text-ellipsis whitespace-nowrap text-black">
        {event.title}
      </span>
    </Link>
  );
};

export const CustomMonthEvent = ({ event }: { event: Event }) => (
  <div className="text-xs bg-gray-100 p-1 rounded truncate">{event.title}</div>
);
