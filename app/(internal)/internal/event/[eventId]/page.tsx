"use client";
import { Notes } from "@/app/components/eventDetail/Notes";
import PocExpanded from "@/app/components/internal/eventdetail/PocExpanded";
import { BookMarkEvent } from "@/components/eventDetail/bookMarkEvent";
import { AdvancedDetails } from "@/components/gtmDetail/advancedDetails";
import { AudienceIntel } from "@/components/gtmDetail/audienceIntel";
import { InsightsAndScores } from "@/components/gtmDetail/insightsAndScores";
import { Overview } from "@/components/gtmDetail/overview";
import Loading from "@/components/ui/Loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button as ButtonUI } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isEventeli } from "@/config";
import { eventTypeColors, eventTypeIcons } from "@/constants/eventTypes";
import { lightenColor } from "@/lib/utils";
import { useCoordinateService } from "@/services/coordinateService";
import { useEventsService } from "@/services/eventsService";
import { pocDetail } from "@/types/coordinateEventType";
import {
  Event,
  EventCoOrganizerDetails,
  EventPOCDetails,
  TTabs,
} from "@/types/events";
import { renderFormattedDates } from "@/utils/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Location } from "geist-icons";
import {
  CalendarDays,
  ClipboardList,
  Globe,
  MailIcon,
  MapPin,
  PhoneIcon,
  Radio,
  Share2,
  Star
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import "react-circular-progressbar/dist/styles.css";

const EventDetail = ({ params }: { params: { eventId: string } }) => {
  const router = useRouter();
  const eventDetailParams = useSearchParams();
  const eventDetailView = eventDetailParams.get("view");
  const [activeTab, setActiveTab] = useState<TTabs>("overview");
  const [openItem, setOpenItem] = useState("");
  const [showBackToSearch, setShowBackToSearch] = useState<boolean>(false);
  const [eventPOCDetails, setEventPOCDetails] = useState<EventPOCDetails[]>([]);
  const [showAddress, setShowAddress] = useState(false);
  const [showCoorganizers, setShowCoorganizers] = useState(false);
  const {
    getEventDetailById,
    getEventPOCDetails,
    getEventsRankingDetailsById,
    getEventEditionDetails,
    getEventExhibitorDetails,
    getEventSpeakerDetails,
    // getEventSponsorDetails,
    getEventCoOrganizerDetails,
  } = useEventsService();
  const coordinateService = useCoordinateService();
  const { data: eventData, isLoading } = useQuery<any>({
    queryKey: ["eventDetailData"],
    queryFn: () => getEventDetailById(params.eventId),
    refetchOnWindowFocus: false,
  });
  const { data: event } = useQuery<any>({
    queryKey: ["eventDetails"],
    queryFn: async () => {
      const [
        // eventDataResult,
        eventPOCDataResult,
        eventRankingDetailsResult,
        eventEditionDataResult,
        eventExhibitorDataResult,
        eventSpeakerDataResult,
        // eventSponsorDataResult,
        eventCoOrganizerDataResult,
      ] = await Promise.allSettled([
        // getEventDetailById(params.eventId),
        getEventPOCDetails(params.eventId),
        getEventsRankingDetailsById(params.eventId),
        getEventEditionDetails(params.eventId, 10, 0),
        getEventExhibitorDetails(params.eventId, 3, 0),
        getEventSpeakerDetails(params.eventId, 3, 0),
        // getEventSponsorDetails(params.eventId, 3, 0),
        getEventCoOrganizerDetails(params.eventId),
      ]);
      // const eventData =
      //   eventDataResult.status === "fulfilled" ? eventDataResult.value : null;
      const eventPOCData =
        eventPOCDataResult.status === "fulfilled"
          ? eventPOCDataResult.value
          : null;
      setEventPOCDetails(eventPOCData?.eventPoCs || []);
      const eventCoOrganizerData =
        eventCoOrganizerDataResult.status === "fulfilled"
          ? eventCoOrganizerDataResult.value
          : null;
      const eventEditionData =
        eventEditionDataResult.status === "fulfilled"
          ? eventEditionDataResult.value
          : null;
      const eventRankingDetails =
        eventRankingDetailsResult.status === "fulfilled"
          ? eventRankingDetailsResult.value
          : null;
      const eventExhibitorData =
        eventExhibitorDataResult.status === "fulfilled"
          ? eventExhibitorDataResult.value
          : null;
      const eventSpeakerData =
        eventSpeakerDataResult.status === "fulfilled"
          ? eventSpeakerDataResult.value
          : null;

      // const eventSponsorData =
      //   eventSponsorDataResult.status === "fulfilled"
      //     ? eventSponsorDataResult.value
      //     : null;
      return {
        // eventData: eventData,
        eventPOCData: eventPOCData,
        eventCoOrganizerDetails: eventCoOrganizerData,
        eventRankingDetails: eventRankingDetails,
        eventEditionData: eventEditionData,
        eventExhibitorData: eventExhibitorData,
        eventSpeakerData: eventSpeakerData,
        // eventSponsorData: eventSponsorData,
      };
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      if (window.history.length > 1) {
        setShowBackToSearch(true);
      } else {
        setShowBackToSearch(false);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <Loading className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    );
  }

  if (!event) {
    return null;
  }

  const {
    // eventData,
    eventRankingDetails,
    eventCoOrganizerDetails,
    eventEditionData,
    eventExhibitorData,
    eventSpeakerData,
    // eventSponsorData,
  } = event;
  const { basic, advance, insights, audience, interests }: Event =
    eventData || {};

  const {
    id,
    name,
    logoUrl: eventLogoUrl,
    startDateTime,
    endDateTime,
    organizer,
    website,
    format: typeOfEvent,
    primaryEventType,
    eventLocation,
    status,
    rating,
  } = basic || {};

  const {
    scores,
    trustScore,
    exhibitorsCount,
    speakersCount,
    sponsorsCount,
    estimatedAttendance,
    estimatedExhibitors,
    economicImpactBreakdown,
  } = insights || {};
  const { audienceSpread, designationSpread } = audience || {};
  const {
    logoUrl: organizerLogoUrl,
    location: organizerLocation,
    name: organizerName,
  } = organizer || {};

  const { coorganizers } = eventCoOrganizerDetails || {};

  const filteredScores =
    scores &&
    Object.fromEntries(
      Object.entries(scores).filter(([key, _]) => key !== "impactScore")
    );

  const isInsightVisible = isEventeli
    ? (filteredScores &&
        Object.values(filteredScores).every((value) => value !== null)) ||
      (trustScore !== null && trustScore !== undefined && trustScore > 0) ||
      (economicImpactBreakdown !== null &&
        economicImpactBreakdown !== undefined &&
        Object.keys(economicImpactBreakdown).length > 0) ||
      (eventRankingDetails && Object.keys(eventRankingDetails).length > 0) ||
      (estimatedAttendance !== null &&
        estimatedAttendance !== "" &&
        estimatedAttendance !== undefined) ||
      (estimatedExhibitors !== null &&
        estimatedExhibitors !== "" &&
        estimatedExhibitors !== undefined)
    : (trustScore !== null && trustScore !== undefined && trustScore > 0) ||
      (eventRankingDetails && Object.keys(eventRankingDetails).length > 0) ||
      (estimatedAttendance !== null &&
        estimatedAttendance !== "" &&
        estimatedAttendance !== undefined) ||
      (estimatedExhibitors !== null &&
        estimatedExhibitors !== "" &&
        estimatedExhibitors !== undefined);

  const isAudienceVisible =
    (audienceSpread && Object.keys(audienceSpread).length > 0) ||
    (designationSpread !== null &&
      designationSpread != undefined &&
      designationSpread.length > 0) ||
    (exhibitorsCount !== null &&
      exhibitorsCount !== undefined &&
      exhibitorsCount > 0) ||
    (sponsorsCount !== null &&
      sponsorsCount !== undefined &&
      sponsorsCount > 0) ||
    (speakersCount !== null &&
      speakersCount !== undefined &&
      speakersCount > 0);

  const isOverviewVisible = true;

  const tabs = [
    { tabName: "Overview", path: "overview", isVisible: isOverviewVisible },
    { tabName: "Insights", path: "insights", isVisible: isInsightVisible },
    { tabName: "Audience", path: "audience", isVisible: isAudienceVisible },
  ];

  const eventStartDate = startDateTime
    ? format(new Date(startDateTime), "dd MMM yyyy")
    : "";

  const eventEndDate = endDateTime
    ? format(new Date(endDateTime), "dd MMM yyyy")
    : "";

  const isCancelled = status === "cancelled";
  const isPostponed = status === "postponed";

  const venueName = eventLocation?.venue?.name;
  const venueAddress = [eventLocation?.city?.name, eventLocation?.country?.name]
    .filter(Boolean)
    .join(", ");

  const organizerAddress = (() => {
    if (organizerLocation) {
      const cityName = organizerLocation?.city?.name || "";
      const countryName = organizerLocation?.country?.name || "";

      return [cityName, countryName].filter(Boolean).join(", ");
    }
    return "";
  })();

  const eventImageSrc =
    eventLogoUrl ||
    `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${
      website || ""
    }&size=64`;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: name ?? "",
          url: `https://console.eventeli.com/search/${id}`,
        })
        .then(() => {
          console.log("Successfully shared");
        })
        .catch((error) => {
          console.error("Something went wrong", error);
        });
    }
  };

  const handleScrollTo = (section: string) => {
    const element = document.querySelector(`.${section}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const unlockPoc = async (pocId: number) => {
    try {
      setEventPOCDetails((prevPocData) =>
        prevPocData.map((poc) =>
          poc.id === pocId ? { ...poc, state: 1 } : poc
        )
      );
      const data = await coordinateService.unlockPocDetail({
        pocId,
        unmask: "email,phone",
        target: "EVENT",
        source: "eventPage",
        targetId: id,
      });
      if (data) {
        setEventPOCDetails((prevPocData) =>
          prevPocData.map((poc) =>
            poc.id === pocId
              ? {
                  ...poc,
                  email: data.email,
                  phoneNumber: data.phoneNumber,
                  state: 2,
                }
              : poc
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const isOverviewActive =
    eventDetailView === null ||
    (eventDetailView !== "pocs" && eventDetailView !== "notes")
      ? true
      : false;

  return (
    <div className="p-6">
      <aside
        className="fixed h-screen w-[24%] pb-24 bg-[var(--primary-foreground)] 
        pt-0 pr-6 overflow-y-auto border-r dark:border-r-2 dark:border-r-[var(--border-color)] 
        max-xl:w-[30%]"
      >
        {showBackToSearch && (
          <Button className="flex items-center gap-2 text-[#666666] text-sm">
            <ArrowLeft width="14px" height="14px" color="#6750A4" />
            <span
              className="text-[var(--primary-color)] font-medium"
              onClick={() => router.back()}
            >
              Back to Search
            </span>
          </Button>
        )}
        <div className="flex gap-4 mt-4 items-start flex-col lg:flex-row">
          {!website && !eventLogoUrl ? (
            <div
              className="h-24 px-10 rounded-md bg-[#5055A3]/10 border
             border-[#5055A3]/20 flex items-center justify-center"
            >
              <span className="text-[#5055A3] text-2xl font-semibold">
                {name.replace(/[+*-/"'"]/g, "").charAt(0)}
              </span>
            </div>
          ) : (
            <img
              src={eventImageSrc}
              alt="eventDetails"
              className="h-24 w-full lg:w-24 rounded-lg aspect-auto border object-contain"
            />
          )}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              <div className="flex flex-row gap-3 flex-wrap">
                {/* {basic && basic.eventTypes && basic.eventTypes.length > 0 && (
                  <ul className="flex flex-row flex-wrap gap-3">
                    {basic.eventTypes.map((type: any) => (
                      <TooltipProvider key={type.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant={"outline"}
                              className="text-xs font-semibold py-1 px-3 border
                              border-[#CCE6FF] rounded-sm w-fit
                              text-[#0062d1] bg-[#EBF5FF] dark:bg-[#10233D]
                              dark:border-[#0D3868] cursor-pointer"
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
                )} */}
                {primaryEventType && (
                  <Badge
                    variant={"outline"}
                    className="flex items-center gap-2 text-xs font-semibold py-1 px-3 border
                   rounded-sm w-fit cursor-pointer"
                    style={{
                      color: eventTypeColors[primaryEventType || ""],
                      backgroundColor: lightenColor(
                        eventTypeColors[primaryEventType || ""],
                        0.9
                      ),
                      borderColor: lightenColor(
                        eventTypeColors[primaryEventType || ""],
                        0.9
                      ),
                    }}
                  >
                    <span>
                      {eventTypeIcons[primaryEventType || "festivals"]}
                    </span>
                    <span>
                      {primaryEventType.charAt(0).toUpperCase() +
                        primaryEventType.slice(1)}
                    </span>
                  </Badge>
                )}
                {/* {isBranded && (
                  <span
                    className="text-[12px] font-semibold py-1 px-3 border-[#F9D7E2]
                   border rounded-sm w-fit text-[#DF2670] bg-[#FEECF2]"
                  >
                    Branded Event
                  </span>
                )}
                {isSeries && (
                  <span
                    className="text-[12px] font-semibold py-1 px-3 border-[#BEF4EB] 
                  border rounded-sm w-fit text-[#398E4A] bg-[#E5FAF6]"
                  >
                    Series Event
                  </span>
                )} */}
              </div>
            </div>
            {name && <p className="text-lg font-medium">{name}</p>}
          </div>
        </div>

        <div className="flex justify-between mt-1">
          <div className="flex items-center gap-1">
            {rating !== null && rating > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant="outline"
                      className="capitalize py-1 rounded-sm border-none px-0"
                    >
                      <Star
                        className="w-4 h-4 mr-1 mt-[2px]"
                        fill="#6F48AD"
                        stroke="#6F48AD"
                      />
                      <span className="mt-[2px] text-base">{rating}</span>
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
          <div className="flex items-center">
            <div className="flex gap-4 items-center">
              {website && (
                <Link
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black dark:hover:text-primary text-[#666666]"
                >
                  <Globe className="w-4 h-4" stroke="currentColor" />
                </Link>
              )}
              <ButtonUI
                variant={"link"}
                onClick={handleShare}
                className="hover:text-black dark:hover:text-primary text-[#666666] px-0"
              >
                <Share2 className="w-4 h-4" stroke="currentColor" />
              </ButtonUI>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center mt-1">
          {startDateTime && (
            <div
              className="border border-[#ebebeb] dark:border-[var(--border-color)] 
            rounded-lg flex flex-col items-center justify-center w-10 h-10 aspect-square"
            >
              <span className="text-[#666666] text-md font-bold">
                <CalendarDays width={20} height={20} />
              </span>
            </div>
          )}
          <p
            className={`${
              isCancelled || isPostponed ? "line-through" : ""
            } font-semibold text-sm`}
          >
            {eventStartDate &&
              eventEndDate &&
              renderFormattedDates(eventStartDate, eventEndDate)}
          </p>
          {isCancelled && (
            <Badge
              variant="outline"
              className="border-destructive text-destructive"
            >
              Cancelled
            </Badge>
          )}
          {isPostponed && (
            <Badge
              variant="outline"
              className="border-[#FF990A] text-[#FF990A]"
            >
              Postponed
            </Badge>
          )}
        </div>

        {(eventLocation || typeOfEvent) && (
          <div className="flex gap-2 items-center mt-3">
            <span
              className="border border-[#ebebeb] dark:border-[var(--border-color)]
             text-[#666666] rounded-lg flex items-center self-start justify-center 
             text-md font-bold w-10 h-10 aspect-square"
            >
              {typeOfEvent === "online" || typeOfEvent === "hybrid" ? (
                <Radio width={20} height={20} />
              ) : (
                <MapPin width={20} height={20} />
              )}
            </span>
            <span>
              {typeOfEvent === "online" || typeOfEvent === "hybrid" ? (
                <p className="text-[var(--primary-text-color)] font-semibold text-sm ">
                  {typeOfEvent.charAt(0).toUpperCase() + typeOfEvent.slice(1)}{" "}
                </p>
              ) : venueName ? (
                <p className="text-[var(--primary-text-color)] font-semibold text-sm">
                  <span>{venueName}</span>

                  {showAddress &&
                    eventLocation &&
                    eventLocation.venue &&
                    eventLocation.venue.address && (
                      <span>
                        {", "}
                        {eventLocation?.venue?.address || ""}
                      </span>
                    )}
                </p>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p
                        className="text-sm text-[var(--primary-text-color)]
                       w-fit cursor-pointer font-semibold"
                      >
                        TBA
                      </p>
                    </TooltipTrigger>
                    <TooltipContent
                      align="start"
                      alignOffset={-60}
                      className="tooltip-content-styles"
                    >
                      <p className="text-[var(--secondary-text-color)]">
                        Venue to be announced
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {typeOfEvent !== "online" && (
                <p className="text-[var(--secondary-text-color)] text-sm">
                  {venueAddress}
                </p>
              )}
              {typeOfEvent !== "online" &&
                typeOfEvent !== "hybrid" &&
                venueName !== "" &&
                venueName !== null &&
                venueName !== undefined && (
                  <p
                    className="mt-1 w-fit text-xs hover:underline hover:text-primary hover:underline-offset-2 
                    cursor-pointer"
                    onClick={() => setShowAddress(!showAddress)}
                  >
                    show address
                  </p>
                )}
            </span>
          </div>
        )}

        <div className="flex gap-2 items-center mt-3">
          {/** Check the organizer logo present or not */}
          {organizer ? (
            organizerLogoUrl ? (
              <img
                src={organizerLogoUrl}
                className="self-start rounded-lg bg-[var(--primary-foreground)] aspect-square w-10 h-10 
                border border-[#ebebeb] dark:border-[var(--border-color)]"
                alt="Organizer Logo"
              />
            ) : (
              <div
                className="w-10 h-10 self-start aspect-square rounded-md bg-[#5055A3]/10 flex 
                items-center justify-center border border-[#ebebeb] dark:border-[var(--border-color)]"
              >
                {organizerName && (
                  <span className="text-[#5055A3] text-2xl font-semibold">
                    {organizerName.replace(/[+*-/"'"]/g, "").charAt(0)}
                  </span>
                )}
              </div>
            )
          ) : (
            <div
              className="border border-[#ebebeb] dark:border-[var(--border-color)]
          rounded-lg flex flex-col items-center justify-center w-10 h-10 aspect-square"
            >
              <span className="text-[#666666] text-md font-bold">
                <ClipboardList width={20} height={20} />
              </span>
            </div>
          )}

          {/** Check the organizer name is coming or not */}
          <div className="flex flex-col">
            {organizer ? (
              <>
                <p className="font-medium text-sm">{organizerName}</p>
                {organizerAddress && (
                  <span className="text-sm text-[var(--secondary-text-color)]">
                    {organizerAddress}
                  </span>
                )}
              </>
            ) : (
              <p className="text-[#666666] text-sm flex items-center gap-2 p-2">
                Organization information will appear here
              </p>
            )}
            {eventCoOrganizerDetails &&
              eventCoOrganizerDetails.coorganizers &&
              eventCoOrganizerDetails.coorganizers.length > 0 && (
                <Button
                  onPress={() => setShowCoorganizers(true)}
                  className={`mt-1 w-fit text-xs hover:underline hover:text-primary 
                  hover:underline-offset-2 cursor-pointer dark:text-[var(--secondary-text-color)] dark:hover:text-white ${
                    showCoorganizers ? "hidden" : "block"
                  }`}
                >
                  see all
                </Button>
              )}
          </div>
        </div>

        <div
          className={`${
            showCoorganizers ? "flex" : "hidden"
          } gap-2 items-center mt-3`}
        >
          {coorganizers &&
            coorganizers.length > 0 &&
            coorganizers.map((coorganizer: EventCoOrganizerDetails) => {
              const { id, city, country, name, logo } = coorganizer;
              return (
                <div className="flex flex-col" key={id}>
                  <div className="flex gap-2 items-center mt-3">
                    {/** Check the co-organizer logo present or not */}
                    {coorganizer ? (
                      logo ? (
                        <img
                          src={logo}
                          className="self-start rounded-lg bg-[var(--primary-foreground)] aspect-square w-10 h-10 
                          border border-[#ebebeb] dark:border-[var(--border-color)]"
                          alt="Co-Organizer Logo"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 self-start aspect-square rounded-md bg-[#5055A3]/10 flex 
                          items-center justify-center border border-[#ebebeb] dark:border-[var(--border-color)]"
                        >
                          {name && (
                            <span className="text-[#5055A3] text-2xl font-semibold">
                              {name.replace(/[+*-/"'"]/g, "").charAt(0)}
                            </span>
                          )}
                        </div>
                      )
                    ) : (
                      <div
                        className="border border-[#ebebeb] dark:border-[var(--border-color)]
                        rounded-lg flex flex-col items-center justify-center w-10 h-10 aspect-square"
                      >
                        <span className="text-[#666666] text-md font-bold">
                          <ClipboardList width={20} height={20} />
                        </span>
                      </div>
                    )}

                    {/** Check the co-organizer name is coming or not */}
                    <div className="flex flex-col">
                      {coorganizer ? (
                        <>
                          <p className="font-medium text-sm">{name}</p>
                          {(city || country) && (
                            <span className="text-sm text-[var(--secondary-text-color)]">
                              {[city, country].filter(Boolean).join(", ")}
                            </span>
                          )}
                        </>
                      ) : (
                        <p className="text-[#666666] text-sm flex items-center gap-2 p-2">
                          Coorganizer information will appear here
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <Accordion
          type="single"
          value={openItem}
          className="bg-[#FAFAFA] dark:border-[var(--border-color)] dark:bg-transparent 
          border border-[var(--neutral-light-color)] rounded-sm mb-4 hidden"
          collapsible
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline p-2 font-normal text-sm">
              <p className="flex gap-3 items-center">
                Organizer
                {/* {organizer && Object.keys(organizer).length > 0 && (
                  <span
                    className="text-[12px] bg-[var(--primary-color)] text-white
                   dark:text-[#131313] py-[1px] px-2 rounded-full"
                  >
                    {Object.keys.length.toString().padStart(2, "0")}
                  </span>
                )} */}
              </p>
            </AccordionTrigger>
            <AccordionContent className="h-fit">
              {organizer ? (
                <div className="flex gap-4 p-2 mb-1">
                  {organizerLogoUrl ? (
                    <img
                      src={organizerLogoUrl}
                      className="rounded-lg bg-[var(--primary-foreground)] aspect-square w-10 h-10"
                      alt="Organizer Logo"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 aspect-square rounded-md bg-[#5055A3]/10 border
                     border-[#5055A3]/20 flex items-center justify-center"
                    >
                      {organizerName && (
                        <span className="text-[#5055A3] text-2xl font-semibold">
                          {organizerName.replace(/[+*-/"'"]/g, "").charAt(0)}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <p className="font-medium text-sm">{organizerName}</p>
                    {organizerAddress && (
                      <div className="flex gap-2 items-center">
                        <Location color="#666666" width="14px" height="14px" />
                        <p className="text-sm text-[var(--secondary-text-color)]">
                          {organizerAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[#666666] text-sm flex items-center gap-2 p-2">
                  Organization information will appear here
                </p>
              )}
              {eventCoOrganizerDetails &&
                eventCoOrganizerDetails.length > 0 && (
                  <div className="flex items-center gap-2 border-t-[1px] p-2">
                    <p className="text-sm font-medium text-[var(--secondary-text-color)]">
                      Co-organizer
                    </p>
                    <span
                      className="text-[12px] bg-[var(--primary-color)] text-[#ffffff]
                      py-[1px] px-2 rounded-full"
                    >
                      {eventCoOrganizerDetails.length > 0 &&
                      eventCoOrganizerDetails.length < 9
                        ? `0${eventCoOrganizerDetails.length}`
                        : eventCoOrganizerDetails.length}
                    </span>
                  </div>
                )}
              {eventCoOrganizerDetails.length > 0 &&
                eventCoOrganizerDetails.map((coOrganizer: any) => (
                  <div
                    key={coOrganizer.id}
                    className="flex gap-4 pb-1 items-center"
                  >
                    <img
                      src={
                        coOrganizer.logo !== null
                          ? coOrganizer.logo
                          : `https://img.10times.com/userimages/${coOrganizer.name
                              .charAt(0)
                              .toLowerCase()}.jpg`
                      }
                      className="rounded-lg bg-[var(--primary-foreground)] w-8 h-8 aspect-square"
                      alt="Organizer Logo"
                    />
                    <p className="text-sm font-medium">{coOrganizer.name}</p>
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <BookMarkEvent eventId={basic.id} interests={interests} />
        {/* <ButtonUI
          type="button"
          onClick={() => router.push(`/internal/event/${params.eventId}`)}
          className={`flex mt-3 items-center cursor-pointer justify-between 
            w-full gap-2 p-2 h-10 bg-[#FAFAFA] hover:bg-[#FAFAFA] text-black dark:text-white 
            font-normal bg dark:bg-transparent border border-[var(--neutral-light-color)]
            dark:border-[var(--border-color)] rounded-sm ${
              isOverviewActive
                ? "border-l-4 border-l-primary dark:border-l-primary font-medium"
                : ""
            }`}
        >
          <span className={`text-sm ${isOverviewActive ? "text-primary" : ""}`}>
            Overview
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 ml-2" />
        </ButtonUI> */}
        <Accordion
          type="single"
          onValueChange={setOpenItem}
          className={`bg-[#FAFAFA] mt-4 dark:border-[var(--border-color)]
          dark:bg-[var(--primary-light-color)] border border-[var(--neutral-light-color)] rounded-sm`}
          collapsible
        >
          <AccordionItem value="event-poc">
            <AccordionTrigger
              className={`hover:no-underline p-2 font-normal text-sm 
            ${
              openItem === "event-poc"
                ? "shadow-md rounded-sm border-l-4 border-l-primary dark:border-l-primary"
                : ""
            }
             ${
               eventDetailView === "pocs"
                 ? "rounded-sm border-l-4 border-l-primary dark:border-l-primary"
                 : ""
             }`}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p
                      className={`flex gap-3 items-center ${
                        eventDetailView === "pocs"
                          ? "text-primary font-medium"
                          : ""
                      }`}
                    >
                      Event POC
                      {eventPOCDetails.length > 0 && (
                        <span
                          className="text-[12px] bg-[var(--primary-color)]
                         text-white dark:text-[#131313] py-[1px] px-2 rounded-full"
                        >
                          {/* {eventPOCDetails.filter((poc) => poc !== null)
                            .length > 0 &&
                          eventPOCDetails.filter((poc) => poc !== null).length <
                            9
                            ? `0${
                                eventPOCDetails.filter((poc) => poc !== null)
                                  .length
                              }`
                            : eventPOCDetails.filter((poc) => poc !== null)
                                .length} */}
                          {Object.keys(eventPOCDetails)
                            .length.toString()
                            .padStart(2, "0")}
                        </span>
                      )}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="w-40 tooltip-content-styles">
                    <p className="text-left text-[var(--secondary-text-color)] font-medium">
                      Point of Contact for this event
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AccordionTrigger>
            <AccordionContent
              className={`
                ${
                  eventPOCDetails.length > 1
                    ? "h-36 bg-white dark:bg-background overflow-y-auto border-t pt-1"
                    : "h-fit"
                } pb-1 overflow-x-hidden`}
            >
              {eventPOCDetails && eventPOCDetails.length > 0 ? (
                eventPOCDetails
                  .slice(0, 5)
                  .map((poc: EventPOCDetails | null) => {
                    if (!poc) {
                      return <></>;
                    }
                    const {
                      designation,
                      email,
                      id,
                      phoneNumber,
                      profilePicture,
                      name,
                      state,
                    } = poc;
                    return (
                      <div key={id} className="flex flex-row gap-3 p-2">
                        <img
                          src={
                            profilePicture
                              ? profilePicture
                              : `https://img.10times.com/userimages/${
                                  name || "".charAt(0).toLowerCase()
                                }.jpg`
                          }
                          alt="POC Logo"
                          className="rounded-lg shadow-md h-10 w-10"
                        />
                        <div className="flex flex-col gap-2 flex-1 flex-wrap">
                          {name && (
                            <p className="font-medium text-sm">{name}</p>
                          )}
                          {designation !== null && (
                            <p className="text-[#666666] text-[12px]">
                              <span>{designation}</span>
                            </p>
                          )}
                          {email && (
                            <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                              <MailIcon
                                width="12px"
                                height="12px"
                                className="self-start mt-1"
                              />
                              <span className="break-all">{email}</span>
                            </p>
                          )}
                          {phoneNumber && (
                            <p className="text-[#666666] flex items-center gap-2 text-[12px]">
                              <PhoneIcon width="12px" height="12px" />
                              <span>{phoneNumber}</span>
                            </p>
                          )}
                          {(email || phoneNumber) && (
                            <div>
                              <ButtonUI
                                disabled={
                                  state && (state === 1 || state === 2)
                                    ? true
                                    : false
                                }
                                onClick={() => unlockPoc(id)}
                                variant={"outline"}
                                size={"sm"}
                              >
                                Show details
                              </ButtonUI>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-[#666666] text-sm flex items-center gap-2 p-2">
                  POC information will appear here
                </p>
              )}
              {eventPOCDetails && eventPOCDetails.length > 5 && (
                <p
                  onClick={() =>
                    router.push(`/internal/event/${params.eventId}?view=pocs`)
                  }
                  className="p-2 pb-0 w-fit cursor-pointer text-primary 
                  font-medium hover:underline hover:underline-offset-2"
                >
                  View All ({eventPOCDetails.length})
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* <ButtonUI
          type="button"
          onClick={() =>
            router.push(`/internal/event/${params.eventId}?view=notes`)
          }
          className={`flex items-center mt-4 cursor-pointer justify-between 
          w-full gap-2 p-2 h-10 bg-[#FAFAFA] hover:bg-[#FAFAFA] text-black dark:text-white 
          font-normal border border-[var(--neutral-light-color)]
          dark:border-[var(--border-color)] dark:bg-[var(--primary-light-color)]  rounded-sm ${
            eventDetailView === "notes"
              ? "font-medium border-l-4 border-l-primary dark:border-l-primary"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">Notes & Discussion</span>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 ml-2" />
        </ButtonUI> */}
      </aside>
      <div
        className={`ml-auto w-[72%] max-xl:w-[62%] ${
          eventDetailView === "notes"
            ? "h-[calc(100vh-150px)]"
            : eventDetailView === "pocs"
            ? "h-[calc(100vh-150px)]"
            : ""
        }`}
      >
        {(eventDetailView === "notes" || eventDetailView === "pocs") && (
          <Link
            href={`/internal/event/${params.eventId}`}
            className="flex items-center gap-2 text-[#666666] text-sm pb-3"
          >
            <ArrowLeft width="14px" height="14px" color="#6750A4" />
            <span
              className="text-[var(--primary-color)] font-medium"
              onClick={() => router.push}
            >
              Back to Detail Page
            </span>
          </Link>
        )}
        {eventDetailView === "notes" ? (
          <Notes eventId={params.eventId} stage={"COORDINATE"} />
        ) : eventDetailView === "pocs" ? (
          <PocExpanded
            eventId={params.eventId}
            pocData={eventPOCDetails as pocDetail[]}
            unlockPoc={unlockPoc}
          />
        ) : (
          <>
            <ul
              className="flex flex-row gap-12 justify-between mb-4 z-10 bg-white 
              dark:bg-[var(--heading-background-color)] shadow-[0_3px_5px_-6px_black] pt-3 items-end w-full"
            >
              <div className="flex gap-12">
                {tabs
                  .filter((tab) => tab.isVisible)
                  .map((tab) => (
                    <li
                      key={tab.tabName}
                      onClick={() => {
                        handleScrollTo(tab.path);
                      }}
                      className={`relative pb-2 font-semibold cursor-pointer ${
                        activeTab === tab.path
                          ? "text-[var(--primary-color)] border-b-2 border-b-[var(--primary-color)]"
                          : "text-[var(--tertiary-text-color)]"
                      }`}
                    >
                      {tab.tabName}
                    </li>
                  ))}
              </div>
              {/* <div className="flex gap-4 pb-2 pr-2">
                <button
                  className="bg-[#6750A4] rounded-md flex items-center gap-2 justify-center py-2 
                  px-4 text-white w-fit cursor-not-allowed"
                >
                  <Image
                    src={"/dollar.svg"}
                    alt="Dollar"
                    width={10}
                    height={10}
                  />
                  Cost Estimate
                </button>
                <button
                  className="bg-[#6750A4] rounded-md flex items-center gap-2 justify-center py-2 px-4
                 text-white w-fit cursor-not-allowed"
                >
                  <Image
                    src={"/eventRelevance.svg"}
                    alt="Speaker"
                    width={15}
                    height={15}
                  />
                  Event Relevance
                </button>
              </div> */}
            </ul>

            <section
              className="flex flex-col gap-6 pb-6 h-[calc(100vh-180px)] mt-5 
              w-full pr-4 overflow-y-auto scroll-smooth"
            >
              <Overview
                eventDetails={eventData}
                scrollSection={tabs[0].path}
                setActiveTab={setActiveTab}
              />
              <hr className="h-[1px] border-t-1 bg-[#f2f2f2]" />
              <AdvancedDetails
                eventDetails={advance}
                eventEditionData={eventEditionData}
                eventId={params.eventId}
              />
              {isInsightVisible && (
                <InsightsAndScores
                  eventDetails={eventData}
                  eventRankingDetails={eventRankingDetails}
                  scrollSection={tabs[1].path}
                  setActiveTab={setActiveTab}
                />
              )}
              {isAudienceVisible && (
                <AudienceIntel
                  eventDetails={eventData}
                  eventExhibitorData={eventExhibitorData}
                  eventSpeakerData={eventSpeakerData}
                  // eventSponsorData={eventSponsorData}
                  scrollSection={tabs[2].path}
                  setActiveTab={setActiveTab}
                />
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
