import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formattedDateRange } from "@/utils/date";
import { Calendar } from "geist-icons";
import EventCard from "./EventCard";
import Image from "next/image";
import fetchIcon from "@/public/internal/fetch_icon.svg";
import { useState } from "react";

interface Props {
  name: string;
  logo: string;
  organizer: string;
  startDate: string;
  endDate: string;
  venue: string;
  state: string;
  city: string;
  country: string;
}

const SimilarEventCard = (eventData: Props) => {
  const [showSimilar, setShowSimilar] = useState<boolean>(false);
  const event = {
    name: eventData.name,
    logoUrl: eventData.logo,
    organizer: eventData.organizer,
    startDateTime: eventData.startDate,
    endDateTime: eventData.endDate,
    address: `${eventData.venue}, ${eventData.state}, ${eventData.country}`,
  };
  return (
    <>
      <div className="rounded-sm border border-[#F87275] text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 w-4/5 bg-[var(--warning-background-color)] px-4 p-3 flex gap-3">
        {event.logoUrl && (
          <div className="w-14 h-14">
            <img
              src={event.logoUrl}
              alt={`logo`}
              className="w-14 h-14 object-contain p-2 border rounded-md bg-white shadow-sm"
            />
          </div>
        )}
        <div className="flex flex-col gap-1 h-full w-full">
          <div className="text-base font-medium">{event.name}</div>
          <div className={`text-[var(--tertiary-text-color)] text-sm`}>
            {event.organizer}
          </div>
          <p className="text-sm capitalize">{event.address}</p>
          <div
            className={`flex items-center text-sm text-gray-600 gap-2 leading-6`}
          >
            <Calendar
              height={"14px"}
              width={"14px"}
              color="var(--secondary-text-color)"
            />
            <div>
              {formattedDateRange(event.startDateTime, event.endDateTime)}
            </div>
          </div>
          <div className="flex justify-between">
            <Badge
              variant="outline"
              className="text-[#0062D1] bg-[#E0EAF5]  capitalize rounded-sm"
            >
              CONFERENCE
            </Badge>

            <Button
              size="xs"
              className="hover:text-[var(--danger-text-color)] text-[var(--danger-text-color)] text-xs font-normal px-2 rounded-sm"
              variant="outline"
              onClick={() => setShowSimilar((prev) => !prev)}
            >
              2 Similar Events
            </Button>
          </div>
        </div>
      </div>

      {showSimilar && (
        <div className="flex flex-col gap-4 bg-[var(--background-secondary-color)] px-4 py-6 border border-[var(--border-color)] rounded-sm w-4/5">
          <div className="my-2">
            <div className="flex gap-1 mb-1">
              <Image src={fetchIcon} height={18} width={18} alt="loading" />
              <span className="font-medium text-base">
                Does this event match the one you're looking for?
              </span>
            </div>
          </div>

          <EventCard {...eventData} />
          <EventCard {...eventData} />
        </div>
      )}
    </>
  );
};

export default SimilarEventCard;
