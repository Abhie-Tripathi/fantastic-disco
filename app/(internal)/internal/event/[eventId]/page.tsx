"use client";
import { Notes } from "@/app/components/eventDetail/Notes";
import PocExpanded from "@/app/components/internal/eventdetail/PocExpanded";
import { BookMarkEvent } from "@/components/eventDetail/bookMarkEvent";
import { AdvancedDetails } from "@/components/gtmDetail/advancedDetails";
import { AudienceIntel } from "@/components/gtmDetail/audienceIntel";
import { InsightsAndScores } from "@/components/gtmDetail/insightsAndScores";
import { Overview } from "@/components/gtmDetail/overview";
import Text from "@/components/new-ui/Text";
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
import { useCoordinateService } from "@/services/coordinateService";
import { useEventsService } from "@/services/eventsService";
import { pocDetail } from "@/types/coordinateEventType";
import { Event, EventPOCDetails, TTabs } from "@/types/events";
import { renderFormattedDates } from "@/utils/dateFormat";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft, Globe, Location } from "geist-icons";
import {
  CalendarDays,
  ChevronRight,
  MailIcon,
  MapPin,
  MessageSquareMore,
  PhoneIcon,
  Radio,
  Share2,
  Star,
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
  const [showBackToSearch, setShowBackToSearch] = useState<boolean>(false);
  const [eventPOCDetails, setEventPOCDetails] = useState<EventPOCDetails[]>([]);
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
    return <Loading className="absolute right-1/2 top-1/2" />;
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
    bannerUrl,
    logoUrl: eventLogoUrl,
    startDateTime,
    endDateTime,
    organizer,
    website,
    format: typeOfEvent,
    eventLocation,
    status,
    rating,
  } = basic || {};

  const { scores, trustScore, exhibitorsCount, speakersCount, sponsorsCount } =
    insights || {};
  const { audienceSpread, designationSpread } = audience || {};
  const {
    logoUrl: organizerLogoUrl,
    location: organizerLocation,
    name: organizerName,
  } = organizer || {};

  const filteredScores =
    scores &&
    Object.fromEntries(
      Object.entries(scores).filter(([key, _]) => key !== "impactScore")
    );

  const isInsightVisible =
    (filteredScores &&
      Object.values(filteredScores).every((value) => value !== null)) ||
    (trustScore !== null && trustScore !== undefined && trustScore > 0) ||
    (eventRankingDetails && Object.keys(eventRankingDetails).length > 0);

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
  const venueAddress =
    eventLocation?.venue?.address ||
    [
      eventLocation?.city?.name !== "Online" && eventLocation?.city?.name,
      eventLocation?.state?.name !== "Online" && eventLocation?.state?.name,
      eventLocation?.country?.name !== "Online" && eventLocation?.country?.name,
    ]
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

  return (
    <div className="p-6">
      <aside className="fixed h-screen w-[24%] pb-24 bg-[var(--primary-foreground)] pt-6 pr-6 overflow-y-auto border-r dark:border-r-2 dark:border-r-[var(--border-color)] max-xl:w-[30%]">
        {showBackToSearch && (
          <Button className="flex items-center gap-2 pb-4 text-[#666666] text-sm">
            <ArrowLeft width="14px" height="14px" color="#6750A4" />
            <span
              className="text-[var(--primary-color)] font-medium"
              onClick={() => router.back()}
            >
              Back to Search
            </span>
          </Button>
        )}
        <div className="flex items-center py-4">
          <div className="flex gap-4 items-center">
            {website && (
              <Link href={website} target="_blank" rel="noopener noreferrer">
                <Globe width="16px" height="16px" color="#666666" />
              </Link>
            )}
            {/* <button onClick={handleShare}>
              <Share2 width="17px" height="17px" color="#666666" />
            </button> */}
          </div>
        </div>
        <div className="flex mt-0 lg:mt-4 gap-4 items-start flex-col lg:flex-row">
          {!website && !eventLogoUrl ? (
            <div className="h-24 px-10 rounded-md bg-[#5055A3]/10 border border-[#5055A3]/20 flex items-center justify-center">
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
                {basic && basic.eventTypes && basic.eventTypes.length > 0 && (
                  <ul className="flex flex-row flex-wrap gap-3">
                    {basic.eventTypes.map((type: any) => (
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
                {/* {isBranded && (
                  <span className="text-[12px] font-semibold py-1 px-3 border-[#F9D7E2] border rounded-sm w-fit text-[#DF2670] bg-[#FEECF2]">
                    Branded Event
                  </span>
                )}
                {isSeries && (
                  <span className="text-[12px] font-semibold py-1 px-3 border-[#BEF4EB] border rounded-sm w-fit text-[#398E4A] bg-[#E5FAF6]">
                    Series Event
                  </span>
                )} */}
              </div>
              <div className="flex items-center gap-1">
                {rating !== null && rating > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant="outline"
                          className="text-gray-600 capitalize py-1 rounded-sm"
                        >
                          <Star
                            className="w-3 h-3 mr-1 mt-[2px]"
                            fill="#6F48AD"
                          />
                          <span className="mt-[2px]">{rating}</span>
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
            {name && <p className="text-lg font-medium">{name}</p>}
          </div>
        </div>

        <div className="flex gap-2 items-center my-4">
          {startDateTime && (
            <div className="border border-[#ebebeb] dark:border-[var(--border-color)] rounded-lg flex flex-col items-center justify-center w-10 h-10 aspect-square">
              <span className="text-[#666666] text-md font-bold">
                <CalendarDays width={20} height={20} />
              </span>
            </div>
          )}
          <Text
            fontWeight="semibold"
            variant="noMargin"
            className={`${isCancelled || isPostponed ? "line-through" : ""}`}
          >
            {eventStartDate &&
              eventEndDate &&
              renderFormattedDates(eventStartDate, eventEndDate)}
          </Text>
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
          <div className="flex gap-2 items-center my-4">
            <span className="border border-[#ebebeb] dark:border-[var(--border-color)] text-[#666666] rounded-lg flex items-center self-start justify-center text-md font-bold w-10 h-10 aspect-square">
              {typeOfEvent === "online" || typeOfEvent === "hybrid" ? (
                <Radio width={20} height={20} />
              ) : (
                <MapPin width={20} height={20} />
              )}
            </span>
            <span>
              {typeOfEvent === "online" || typeOfEvent === "hybrid" ? (
                <Text fontWeight="semibold" variant="noMargin">
                  {typeOfEvent.charAt(0).toUpperCase() + typeOfEvent.slice(1)}{" "}
                </Text>
              ) : venueName ? (
                <Text fontWeight="semibold" variant="noMargin">
                  {venueName}
                </Text>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-sm text-[var(--primary-text-color)] w-fit cursor-pointer font-semibold">
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
              {venueAddress !== "Online" && (
                <Text variant="noMargin" color="secondary">
                  {venueAddress}
                </Text>
              )}
            </span>
          </div>
        )}
        <BookMarkEvent eventId={basic.id} interests={interests} />
        <div className="flex gap-6 my-4 justify-center">
          <ButtonUI
            type="button"
            onClick={() => router.push(`/internal/event/${params.eventId}`)}
            className="flex items-center cursor-pointer justify-between 
          w-full gap-2 p-2 h-10 bg-[#FAFAFA] hover:bg-[#FAFAFA] text-black dark:text-white 
          font-normal bg dark:bg-transparent border border-[var(--neutral-light-color)]
          dark:border-[var(--border-color)] rounded-sm"
          >
            <span className="text-sm">Overview</span>
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 ml-2" />
          </ButtonUI>
        </div>
        <Accordion
          type="single"
          className="bg-[#FAFAFA] dark:border-[var(--border-color)] dark:bg-transparent border border-[var(--neutral-light-color)] rounded-sm mb-4"
          collapsible
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline p-2 font-normal text-sm">
              <p className="flex gap-3 items-center">
                Organizer
                {organizer && Object.keys(organizer).length > 0 && (
                  <span className="text-[12px] bg-[var(--primary-color)] text-white dark:text-[#131313] py-[1px] px-2 rounded-full">
                    {Object.keys.length.toString().padStart(2, "0")}
                  </span>
                )}
              </p>
            </AccordionTrigger>
            <AccordionContent className="h-fit">
              {organizer ? (
                <div className="flex gap-4 p-2 mb-1">
                  <img
                    src={
                      organizerLogoUrl
                        ? organizerLogoUrl
                        : `https://img.10times.com/userimages/${name
                            .charAt(0)
                            .toLowerCase()}.jpg`
                    }
                    className="rounded-lg bg-[var(--primary-foreground)] aspect-square w-10 h-10"
                    alt="Organizer Logo"
                  />
                  <div className="flex flex-col">
                    <Text fontWeight="medium" size="normal">
                      {organizerName}
                    </Text>
                    {organizerAddress && (
                      <div className="flex gap-2 items-center">
                        <Location color="#666666" width="14px" height="14px" />
                        <Text color="secondary" variant="noMargin">
                          {organizerAddress}
                        </Text>
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
                    <Text fontWeight="medium" color="secondary">
                      Co-organizer
                    </Text>
                    <span className="text-[12px] bg-[var(--primary-color)] text-[#ffffff] py-[1px] px-2 rounded-full">
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
                    <Text fontWeight="medium" size="normal">
                      {coOrganizer.name}
                    </Text>
                  </div>
                ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion
          type="single"
          className="bg-[#FAFAFA] dark:border-[var(--border-color)] dark:bg-transparent border border-[var(--neutral-light-color)] rounded-sm mb-4"
          collapsible
        >
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline p-2 font-normal text-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="flex gap-3 items-center">
                      Event POC
                      {eventPOCDetails.length > 0 && (
                        <span className="text-[12px] bg-[var(--primary-color)] text-white dark:text-[#131313] py-[1px] px-2 rounded-full">
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
              className={`${
                eventPOCDetails.length > 1 ? "h-36 overflow-y-auto" : "h-fit"
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
                            <Text fontWeight="medium" variant="noMargin">
                              {name}
                            </Text>
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
                  className="p-2 pb-0 w-fit cursor-pointer text-primary font-medium hover:underline hover:underline-offset-2"
                >
                  View All ({eventPOCDetails.length})
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <ButtonUI
          type="button"
          onClick={() =>
            router.push(`/internal/event/${params.eventId}?view=notes`)
          }
          className="flex items-center cursor-pointer justify-between 
          w-full gap-2 p-2 h-10 bg-[#FAFAFA] hover:bg-[#FAFAFA] text-black dark:text-white 
          font-normal bg dark:bg-transparent border border-[var(--neutral-light-color)]
          dark:border-[var(--border-color)] rounded-sm"
        >
          <div className="flex items-center gap-2">
            <MessageSquareMore width="15" height="15" />
            <span className="text-sm">Notes & Discussion</span>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 ml-2" />
        </ButtonUI>
      </aside>
      <div
        className={`ml-auto w-[72%] max-xl:w-[62%] ${
          eventDetailView === "notes"
            ? "h-[calc(100vh-100px)] pt-6"
            : eventDetailView === "pocs"
            ? "h-[calc(100vh-50px)] pt-6"
            : ""
        }`}
      >
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
            <ul className="flex flex-row gap-12 justify-between mb-4 z-10 bg-white dark:bg-[var(--heading-background-color)] shadow-[0_3px_5px_-6px_black] pt-3 items-end w-full">
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
              <button className="bg-[#6750A4] rounded-md flex items-center gap-2 justify-center py-2 px-4 text-white w-fit cursor-not-allowed">
                <Image
                  src={"/dollar.svg"}
                  alt="Dollar"
                  width={10}
                  height={10}
                />
                Cost Estimate
              </button>
              <button className="bg-[#6750A4] rounded-md flex items-center gap-2 justify-center py-2 px-4 text-white w-fit cursor-not-allowed">
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

            <section className="flex flex-col gap-6 pb-6 h-[calc(100vh-180px)] mt-5 w-full pr-4 overflow-y-auto scroll-smooth">
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
