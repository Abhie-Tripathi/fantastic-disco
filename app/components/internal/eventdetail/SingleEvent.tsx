import React from "react";
import { Event } from "@/types/events";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const SingleEvent = ({ event }: { event: Event }) => {
  const eventImageSrc =
    event.basic.logoUrl ||
    `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
      event.basic.website || ""
    }&size=64`;
  return (
    <div className="flex mt-4 gap-4 items-start">
      {!event.basic.website && !event.basic.logoUrl ? (
        <div className="h-24 px-10 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 flex items-center justify-center">
          <span className="text-[#5055A3] text-2xl font-semibold">
            {event.basic.name.replace(/[+*-/"'"]/g, "").charAt(0)}
          </span>
        </div>
      ) : (
        <img
          src={eventImageSrc}
          alt="eventDetails"
          className="h-24 w-24 rounded-lg aspect-auto border object-contain"
        />
      )}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex flex-row gap-3 flex-wrap">
            {event.basic &&
              event.basic.eventTypes &&
              event.basic.eventTypes.length > 0 && (
                <ul className="flex flex-row flex-wrap gap-3">
                  {event.basic.eventTypes.map((type: any) => (
                    <TooltipProvider key={type.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant={"outline"}
                            className="text-xs font-semibold py-1 px-3 border border-[#CCE6FF] rounded-sm w-fit text-[#0062d1] bg-[#EBF5FF] dark:bg-[#10233D] dark:border-[#0D3868] cursor-pointer"
                          >
                            {type.name}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent
                          align="center"
                          className="tooltip-content-styles"
                        >
                          <p className="text-[var(--secondary-text-color)] font-medium">
                            Event Type
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </ul>
              )}
          </div>
          <div className="flex items-center gap-1">
            {event.basic.rating !== null && event.basic.rating > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="outline"
                      className="text-gray-600 capitalize py-1 rounded-sm"
                    >
                      <Star className="w-3 h-3 mr-1" fill="#6F48AD" />
                      <span className="mt-[2px]">{event.basic.rating}</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    alignOffset={-50}
                    className="tooltip-content-styles"
                  >
                    <p className="text-[var(--secondary-text-color)] font-medium">
                      User Ratings
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        {event.basic.name && (
          <p className="text-lg font-medium">{event.basic.name}</p>
        )}
      </div>
    </div>
  );
};

export default SingleEvent;
