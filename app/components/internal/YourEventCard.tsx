import React, { useEffect, useState } from "react";
import StatusChangeDropdown from "@/app/components/internal/eventdetail/statusDropdown";
import { useCoordinateService } from "@/services/coordinateService";
import { GAEvent } from "@/utils/GAEvent";
import { enquiryType } from "@/types/coordinateEventType";
import { formattedDateRange } from "@/utils/date";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatLocationParts } from "@/utils/locationFormat";
import { Check, ChevronDown, Radio, Triangle } from "lucide-react";
import { cn, lightenColor } from "@/lib/utils";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { InterestConfiguration } from "@/types/configuration";

interface YourEventCardProps {
  eventId: string;
  eventData: enquiryType["eventData"];
  enquiryId: string;
  currentEnquiryStatus: string;
  upvote?: any;
  enquiryActivity?: any;
  coordinateActions: InterestConfiguration[];
  pipelineConfig: any;
  handleModal?: (id: string, enquiryId: string) => void;
  handleShortlistModal?: (eventId: string, enquiryId: string) => void;
  setSelectedId?: (status: string) => void;
  enquiryStatusUpdate: (eventId: string, status: string) => void;
}
interface VoteStatus {
  [name: string]: {
    count: number;
    myUpvoteId: string | null;
  };
}

const YourEventCard: React.FC<YourEventCardProps> = ({
  eventId,
  eventData,
  enquiryId,
  currentEnquiryStatus,
  upvote,
  enquiryActivity,
  coordinateActions,
  pipelineConfig,
  handleModal,
  handleShortlistModal,
  setSelectedId,
  enquiryStatusUpdate,
}) => {
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
  const [votesCount, setVotesCount] = useState(0);
  const [voteStatus, setVoteStatus] = useState<VoteStatus>({});

  const [showUpvoteDropdown, setShowUpvoteDropdown] = useState<boolean>(false);

  const coordinateService = useCoordinateService();

  const statusLabel = pipelineConfig?.filter(
    (item: any) => item.status === currentEnquiryStatus
  )?.[0]?.label;

  const handleVoteClick = async (myActivityId: string | null, item: string) => {
    if (item && myActivityId === null) {
      let payloadData = {
        enquiryId: enquiryId,
        activityType: "UPVOTE",
        activitySubType: item.toUpperCase(),
      };

      try {
        const createUpvote: any = await coordinateService.upVote(payloadData);

        setVoteStatus((prevState) => ({
          ...prevState,
          [item]: {
            count: prevState[item].count + 1,
            myUpvoteId: createUpvote?.id,
          },
        }));
        setVotesCount((prev) => prev + 1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (item && myActivityId !== null) {
      const deleteIntent: any =
        await coordinateService.deleteEnquiryActivityIntent(myActivityId);

      if (deleteIntent) {
        setVoteStatus((prevState) => ({
          ...prevState,
          [item]: {
            count: prevState[item].count - 1,
            myUpvoteId: null,
          },
        }));
        setVotesCount((prev) => prev - 1);
      }
    }
  };

  const handleModalOpen = () => {
    if (enquiryId && eventId && handleModal) {
      handleModal(eventId, enquiryId);
    }
  };

  const handleClickEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setVotesCount(upvote?.total || 0);

    const upvoteData: VoteStatus = {};
    coordinateActions.map((item) => {
      const temp = enquiryActivity.filter(
        (myActivity: any) =>
          myActivity.activityType === "UPVOTE" &&
          myActivity.activitySubType === item.status
      );
      let upvoteItem = {
        count: upvote[item.status.toLowerCase()],
        myUpvoteId: temp.length > 0 ? temp[0].id : null,
      };
      upvoteData[item.status.toLowerCase()] = upvoteItem;
    });

    setVoteStatus(upvoteData);
  }, []);

  const UpvoteDropdown = () => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="border px-3 gap-1.5 text-[var(--primary-color)] hover:text-[var(--primary-color)]"
          >
            <Triangle
              strokeWidth={0.5}
              className="h-3 w-3"
              color="var(--primary-color)"
              fill="var(--primary-color)"
            />
            <span>{votesCount}</span>
            Upvotes
            <ChevronDown className="h-4 w-4" color="var(--primary-color)" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-2">
          <div className="flex flex-col space-y-1">
            {coordinateActions.map((item) => (
              <Button
                key={item.status}
                variant={voteStatus[item.status] ? "secondary" : "ghost"}
                className="justify-between flex items-center gap-2"
                onClick={() =>
                  handleVoteClick(
                    voteStatus[item.status.toLowerCase()]?.myUpvoteId,
                    item.status.toLowerCase()
                  )
                }
              >
                <div className="flex items-center gap-2">
                  {voteStatus[item.status.toLowerCase()]?.myUpvoteId && (
                    <Check
                      strokeWidth={2}
                      color="#0072F5"
                      className="h-4 w-4"
                    />
                  )}
                  {item.label}
                </div>
                <div className="flex items-center gap-1">
                  <Triangle
                    strokeWidth={0.5}
                    className="h-3 w-3"
                    color="var(--primary-color)"
                    fill="var(--primary-color)"
                  />
                  {voteStatus[item.status.toLocaleLowerCase()]?.count}
                </div>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="flex justify-end border-l border-primary border-dashed w-[95%] md:w-[85%]">
      <div
        className="bg-background rounded-lg border shadow-sm relative my-6 w-[98%] cursor-pointer"
        onClick={() => {
          handleModalOpen();
          GAEvent(
            "Coordinate",
            "Coordinate",
            "Enquiry",
            "Card Clicked | View Detail"
          );
        }}
      >
        <div className="absolute left-0 top-4 md:top-6 h-auto w-[100px] md:w-[140px] flex items-start justify-center">
          {eventData.logoUrl ? (
            <img
              src={eventData.logoUrl || "/placeholder.svg"}
              alt={`${eventData.name} logo`}
              className="w-16 h-16 md:w-24 md:h-24 object-contain p-2 border rounded-md bg-white shadow-sm"
            />
          ) : eventData.website ? (
            <div className="w-16 h-16 md:w-24 md:h-24 relative">
              <img
                src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${eventData.website}&size=64`}
                alt={`${eventData.name} website favicon`}
                className="w-16 h-16 md:w-24 md:h-24 object-contain p-2 border rounded-md bg-white shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.dataset.error = "true";
                }}
              />
              {/* Fallback that shows when image errors */}
              <div
                className="w-16 h-16 md:w-24 md:h-24 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center absolute top-0 left-0"
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
                <span className="text-[#5055A3] text-lg md:text-2xl font-semibold">
                  {eventData.name.charAt(0)}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 shadow-sm flex items-center justify-center">
              <span className="text-[#5055A3] text-lg md:text-2xl font-semibold">
                {eventData.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="pl-[104px] md:pl-[136px] p-4 md:p-6 pr-2 md:pr-3">
          <div className="">
            <div className="flex flex-col justify-between gap-3">
              <h2 className="text-xl md:text-2xl font-semibold ">
                {eventData.name}
              </h2>
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
                <div className="flex justify-between flex-wrap gap-2">
                  {eventData.primaryEventType && (
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <Badge
                            variant="secondary"
                            className={
                              "flex items-center gap-2 bg-pink-100 text-pink-800 hover:bg-pink-100 uppercase rounded-sm"
                            }
                            style={{
                              color:
                                eventTypeColors[
                                  eventData.primaryEventType || ""
                                ],
                              backgroundColor: lightenColor(
                                eventTypeColors[
                                  eventData.primaryEventType || ""
                                ],
                                0.9
                              ),
                            }}
                          >
                            <span>
                              {
                                eventTypeIcons[
                                  eventData.primaryEventType || "festivals"
                                ]
                              }
                            </span>
                            <span className="capitalize">
                              {eventData.primaryEventType.toLowerCase()}
                            </span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-800 text-gray-100  text-xs px-2 rounded-md shadow-md border border-gray-700">
                          <p>Event Type</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <div
                    className="flex flex-wrap gap-2"
                    onClick={handleClickEvent}
                  >
                    <UpvoteDropdown />

                    <StatusChangeDropdown
                      setSelectedId={setSelectedId}
                      label={statusLabel}
                      eventId={eventId}
                      enquiryId={enquiryId}
                      currentEnquiryStatus={currentEnquiryStatus}
                      handleShortlistModal={handleShortlistModal}
                      pipelineConfig={pipelineConfig}
                      enquiryStatusUpdate={enquiryStatusUpdate}
                    />
                  </div>
                </div>

                {/* <div className="flex flex-wrap gap-2" onClick={handleClickEvent} >
                  <StatusChangeDropdown
                    setSelectedId={setSelectedId}
                    label={statusLabel}
                    eventId={eventId}
                    enquiryId={enquiryId}
                    currentEnquiryStatus={currentEnquiryStatus}
                    handleShortlistModal={handleShortlistModal}
                    pipelineConfig={pipelineConfig}
                    enquiryStatusUpdate={enquiryStatusUpdate}
                  />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourEventCard;
