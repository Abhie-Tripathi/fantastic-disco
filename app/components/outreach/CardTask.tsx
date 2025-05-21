import React from "react";
import { Badge } from "@/components/ui/badge";
import { enquiryType } from "@/types/coordinateEventType";
import { Radio } from "lucide-react";
import { formatLocationParts } from "@/utils/locationFormat";
import { formattedDateRange } from "@/utils/date";
import { cn } from "@/lib/utils";

interface CardTaskProps {
  task: enquiryType;
  name: string;
  draggable: boolean;
  eventId: string;
  enquiryId: string;
  enquiryStatus: string;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    taskName: string
  ) => void;
  handleModal: (
    id: string,
    enquiryId: string,
    enquiryStatus: string,
    task: any
  ) => void;
}

const getInetial = (name: string) => {
  const splitedName = name.split(" ");
  if (splitedName.length === 1) {
    return splitedName[0].charAt(0).toUpperCase();
  } else {
    return (
      splitedName[0].charAt(0).toUpperCase() +
      splitedName[1].charAt(0).toUpperCase()
    );
  }
};

const CardTask: React.FC<CardTaskProps> = ({
  name,
  draggable,
  eventId,
  enquiryId,
  enquiryStatus,
  onDragStart,
  handleModal,
  task,
}) => {
  const eventData = task.eventData;

  const address = eventData.eventLocation ? (
    eventData.format === "online" ? (
      <span className="flex items-center">
        <Radio className="w-4 h-4 mr-1" /> Online
      </span>
    ) : eventData.format === "hybrid" ? (
      <span>
        <Radio className="w-4 h-4 mr-1 inline-block" />
        Hybrid&nbsp;-&nbsp;
        {formatLocationParts(eventData.eventLocation)}
      </span>
    ) : (
      formatLocationParts(eventData.eventLocation)
    )
  ) : (
    "Venue to be announced"
  );

  const isCancelled = eventData.status === "cancelled";
  const isPostponed = eventData.status === "postponed";

  return (
    <div
      className="bg-background rounded-lg border shadow-sm relative cursor-move w-full"
      draggable={draggable}
      onDragStart={(event) => onDragStart(event, name)}
      onClick={() => handleModal(eventId, enquiryId, enquiryStatus, task)}
    >
      <div className="absolute left-0 top-4 h-auto w-[100px] flex items-start justify-center">
        {eventData.logoUrl ? (
          <img
            src={eventData.logoUrl || "/placeholder.svg"}
            alt={`${eventData.name} logo`}
            className="w-16 h-16 object-contain p-2 border rounded-md bg-white shadow-sm"
          />
        ) : eventData.website ? (
          <div className="w-16 h-16 relative">
            <img
              src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${eventData.website}&size=64`}
              alt={`${eventData.name} website favicon`}
              className="w-16 h-16 object-contain p-2 border rounded-md bg-white shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.dataset.error = "true";
              }}
            />
            {/* Fallback that shows when image errors */}
            <div
              className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0"
              style={{ display: "none" }}
              ref={(el) => {
                if (el) {
                  const img = el.previousSibling as HTMLImageElement;
                  if (img && img.dataset.error === "true") {
                    el.style.display = "flex";
                  }
                }
              }}
            >
              <span className="text-[#5055A3] text-lg font-semibold">
                {eventData.name.charAt(0)}
              </span>
            </div>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center">
            <span className="text-[#5055A3] text-lg font-semibold">
              {eventData.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="pl-[104px] p-4 pr-2">
        <div className="">
          <div className="flex flex-col justify-between gap-3">
            <h2 className="text-lg font-medium">{eventData.name}</h2>
            <div>
              <p className="text-sm capitalize">{address}</p>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-sm text-gray-600 mt-2",
                    isCancelled || isPostponed ? "line-through" : ""
                  )}
                >
                  {formattedDateRange(
                    eventData.startDateTime,
                    eventData.endDateTime
                  )}
                </p>
                {isCancelled && (
                  <Badge
                    variant="outline"
                    className="border-destructive text-destructive mt-2"
                  >
                    Cancelled
                  </Badge>
                )}
                {isPostponed && (
                  <Badge
                    variant="outline"
                    className="border-[#FF990A] text-[#FF990A] mt-2"
                  >
                    Postponed
                  </Badge>
                )}
              </div>
            </div>
            <div>
              {task?.owner && task?.owner?.name && (
                <div className="flex justify-between flex-wrap gap-2 h-4">
                  <Badge className="bg-[var(--primary-color)] w-7 h-7 p-[6px] rounded-full justify-center hover:bg-primary absolute bottom-3 right-2">
                    <span title={task?.owner?.name}>
                      {getInetial(task?.owner?.name)}
                    </span>
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTask;
