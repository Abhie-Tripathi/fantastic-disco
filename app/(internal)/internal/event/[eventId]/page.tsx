"use client";
import React, { useRef, useState } from "react";
import { ArrowLeft, Globe, Share, Location, StarFill } from "geist-icons";
import { Phone } from "geist-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Heading from "@/components/new-ui/Heading";
import Text from "@/components/new-ui/Text";
import "react-circular-progressbar/dist/styles.css";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import Disable from "/public/disable.svg";
import {
  categoryRank,
  countryCategoryRank,
  countryRank,
  Editions,
  Event,
  GTMEventDetail,
  TTabs,
} from "@/types/events";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Bookmark,
  CalendarDays,
  CircleSlash,
  Forward,
  MailIcon,
  MapPin,
  PhoneIcon,
  Radio,
  Share2,
} from "lucide-react";
import { useEventsService } from "@/services/eventsService";
import { GTMEventPOCDetails, EventDate } from "@/types/events";
import { Badge } from "@/components/ui/badge";
import { EventInfoAndMap } from "@/components/gtmDetail/eventInfoAndMap";
import { AdvancedDetails } from "@/components/gtmDetail/advancedDetails";
import { InsightsAndScores } from "@/components/gtmDetail/insightsAndScores";
import { AudienceIntel } from "@/components/gtmDetail/audienceIntel";
import { renderFormattedDates } from "@/utils/dateFormat";
import SaveThisEvent from "@/components/gtmDetail/saveThisEvent";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

export interface RankingDetail {
  above5CountryEvent: countryRank[] | [];
  below5CountryEvent: countryRank[] | [];
  above5CategoryEvent: categoryRank[] | [];
  below5CategoryEvent: categoryRank[] | [];
  above5CountryCategoryRankEvent: countryCategoryRank[] | [];
  below5CountryCategoryEvent: countryCategoryRank[] | [];
}
const EventDetail = ({ params }: { params: { eventId: string } }) => {
  const router = useRouter();
  const scrollableSectionRef = useRef<HTMLElement | null>(null);
  const currentDate = new Date().toISOString().split("T")[0];
  const [activeTab, setActiveTab] = useState<TTabs>("overview");
  const [eventDates, setEventDates] = useState<EventDate[]>();
  const tabs = [
    { tabName: "Overview", path: "overview" },
    { tabName: "Insights", path: "insights" },
    { tabName: "Audience", path: "audience" },
  ];
  const {
    getEventDetailById,
    getEventPOCDetails,
    getEventEditionDetails,
    getEventExhibitorDetails,
    getEventSpeakerDetails,
  } = useEventsService();
  const { data: event } = useQuery<any>({
    queryKey: ["eventDetails"],
    queryFn: async () => {
      const [
        eventDataResult,
        eventPOCDataResult,
        eventEditionDataResult,
        eventExhibitorDataResult,
        eventSpeakerDataResult,
      ] = await Promise.allSettled([
        getEventDetailById(params.eventId),
        getEventPOCDetails(params.eventId),
        getEventEditionDetails(params.eventId, 10, 0),
        getEventExhibitorDetails(params.eventId, 3, 0),
        getEventSpeakerDetails(params.eventId, 3, 0),
        // getEventCoOrganizerDetails(params.eventId),
      ]);
      const eventData =
        eventDataResult.status === "fulfilled" ? eventDataResult.value : null;
      const eventPOCData =
        eventPOCDataResult.status === "fulfilled"
          ? eventPOCDataResult.value
          : null;
      // const eventCoOrganizerData =
      //   eventCoOrganizerDataResult.status === "fulfilled"
      //     ? eventCoOrganizerDataResult.value
      //     : null;
      const eventEditionData =
        eventEditionDataResult.status === "fulfilled"
          ? eventEditionDataResult.value
          : null;
      const eventExhibitorData =
        eventExhibitorDataResult.status === "fulfilled"
          ? eventExhibitorDataResult.value
          : null;
      const eventSpeakerData =
        eventSpeakerDataResult.status === "fulfilled"
          ? eventSpeakerDataResult.value
          : null;
      return {
        eventData: eventData,
        eventPOCData: eventPOCData,
        eventEditionData: eventEditionData,
        eventExhibitorData: eventExhibitorData,
        eventSpeakerData: eventSpeakerData,
      };
    },
  });

  if (!event) return null;
  const {
    eventData,
    eventPOCData,
    eventEditionData,
    eventExhibitorData,
    eventSpeakerData,
  } = event;
  const eventDetails: GTMEventDetail = eventData.event || {};
  const eventPOCDetails: GTMEventPOCDetails[] = eventPOCData.eventPoc || [];

  if (!eventDetails) return null;
  const {
    id,
    name,
    bannerUrl,
    startDateTime,
    endDateTime,
    organizer,
    website,
    format: typeOfEvent,
    venueLocation,
    stats,
    status,
    scores,
    above5CategoryEvent,
    below5CategoryEvent,
    above5CountryEvent,
    below5CountryEvent,
    above5CountryCategoryRankEvent,
    below5CountryCategoryEvent,
    repeatSentiment: trustScore,
  } = eventDetails;

  const rankings: RankingDetail = {
    above5CategoryEvent: above5CategoryEvent,
    below5CategoryEvent: below5CategoryEvent,
    above5CountryEvent: above5CountryEvent,
    below5CountryEvent: below5CountryEvent,
    above5CountryCategoryRankEvent: above5CountryCategoryRankEvent,
    below5CountryCategoryEvent: below5CountryCategoryEvent,
  };

  const isValid =
    (scores && Object.values(scores).every((value) => value !== null)) ||
    (trustScore !== null && trustScore > 0) ||
    (rankings && Object.values(rankings).some((arr) => arr.length > 0));

  const eventStartDate = startDateTime
    ? format(new Date(startDateTime), "dd MMM yyyy")
    : "";

  const eventEndDate = endDateTime
    ? format(new Date(endDateTime), "dd MMM yyyy")
    : "";

  const formattedDate =
    eventStartDate === eventEndDate
      ? eventStartDate
      : `${eventStartDate} - ${eventEndDate}`;

  const isCancelled = status === "cancelled";
  const isPostponed = status === "postponed";
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

  return (
    <div className="p-6 pt-0">
      <aside className="fixed h-screen w-[24%] pb-24 bg-[var(--primary-foreground)] pt-6 pr-6 overflow-y-auto shadow-[3px_0px_5px_-5px] dark:border-r-2 dark:border-r-[var(--border-color)] max-xl:w-[30%]">
        <Button
          variant="link"
          className="flex items-center gap-2 pb-4 text-[#666666] text-sm"
          onClick={() => router.back()}
        >
          <ArrowLeft width="14px" height="14px" color="#6750A4" />
          <span className="text-[var(--primary-color)] font-medium">
            Back to Search
          </span>
        </Button>
        {bannerUrl && (
          <Image
            src={bannerUrl ?? "/eventDetailFallback.png"}
            alt="eventDetails"
            width={420}
            height={280}
            className="max-h-[300px] w-fill rounded-lg"
          />
        )}

        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-1">
            {stats && stats.rating !== null && stats.rating > 0 && (
              <span className="flex items-center gap-1">
                <StarFill width="16px" height="16px" color="#FFB224" />
                <span>{stats.rating}</span>
              </span>
            )}
          </div>

          <div className="ml-auto flex gap-4 items-center">
            {website && (
              <Link href={website} target="_blank" rel="noopener noreferrer">
                <Globe width="16px" height="16px" color="#666666" />
              </Link>
            )}
            <button onClick={handleShare}>
              <Share2 width="17px" height="17px" color="#666666" />
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-3 flex-wrap">
          {eventDetails &&
            eventDetails.eventTypes &&
            eventDetails.eventTypes.length > 0 && (
              <ul className="flex flex-row flex-wrap gap-3">
                {eventDetails.eventTypes.map((type: any) => (
                  <li
                    className="text-[12px] font-semibold py-1 px-3 border-[#CCE6FF] border rounded-sm w-fit text-[#0062d1] bg-[#EBF5FF] dark:bg-[#10233D] dark:border-[#0D3868]"
                    key={type.id}
                  >
                    {type.name}
                  </li>
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
        {name && (
          <Heading as="h6" variant="titleNoMargin" className="py-2">
            {name}
          </Heading>
        )}

        <div className="flex gap-2 items-center my-4">
          {startDateTime && (
            <div className="border border-[#ebebeb] dark:border-[var(--border-color)] rounded-lg flex flex-col items-center justify-center w-10 h-10 aspect-square">
              <span className="text-[#666666] text-md font-bold">
                {/* {format(new Date(startDateTime), "dd")} */}
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
          {/* {eventStartTime && eventEndTime && (
              <Text variant="noMargin" color="secondary">
                {`${eventStartTime} - ${eventEndTime} GMT+5:30`}
              </Text>
            )} */}
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

        {(venueLocation || typeOfEvent) && (
          <div className="flex gap-2 items-center my-4">
            <span className="border border-[#ebebeb] text-[#666666] rounded-lg flex items-center self-start justify-center text-md font-bold w-10 h-10 aspect-square">
              {typeOfEvent === "online" || typeOfEvent === "hybrid" ? (
                <Radio width={20} height={20} />
              ) : (
                <MapPin width={20} height={20} />
              )}
            </span>
            <span>
              {venueLocation?.venue ? (
                <>
                  {typeOfEvent === "online" || typeOfEvent === "hybrid" ? (
                    <Text fontWeight="semibold" variant="noMargin">
                      {typeOfEvent.charAt(0).toUpperCase() +
                        typeOfEvent.slice(1)}{" "}
                      Event
                    </Text>
                  ) : (
                    venueLocation.venue.name && (
                      <Text fontWeight="semibold" variant="noMargin">
                        {venueLocation.venue.name}
                      </Text>
                    )
                  )}
                  {venueLocation.venue.address &&
                    venueLocation.venue.address !== "null" && (
                      <Text variant="noMargin" color="secondary">
                        {venueLocation.venue.address}
                      </Text>
                    )}
                </>
              ) : (
                (typeOfEvent === "online" || typeOfEvent === "hybrid") && (
                  <Text fontWeight="semibold" variant="noMargin">
                    {typeOfEvent.charAt(0).toUpperCase() + typeOfEvent.slice(1)}{" "}
                    Event
                  </Text>
                )
              )}
            </span>
          </div>
        )}
        <Accordion
          type="single"
          className="bg-[#FAFAFA] dark:bg-transparent border border-[var(--neutral-light-color)] rounded-sm mb-4"
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
            <AccordionContent className="flex flex-col p-2">
              {organizer ? (
                (() => {
                  const { cityName, countryName, logo, name } = organizer;
                  return (
                    <div className="flex gap-4 pb-1 mb-1">
                      <img
                        src={
                          logo
                            ? logo
                            : `https://img.10times.com/userimages/${name
                                .charAt(0)
                                .toLowerCase()}.jpg`
                        }
                        className="rounded-lg bg-[var(--primary-foreground)] aspect-square w-10 h-10"
                        alt="Organizer Logo"
                      />
                      <div className="flex flex-col">
                        <Text fontWeight="medium" size="normal">
                          {name}
                        </Text>
                        {(cityName || countryName) && (
                          <div className="flex gap-2 items-center">
                            <Location
                              color="#666666"
                              width="14px"
                              height="14px"
                            />
                            <Text color="secondary" variant="noMargin">{`${
                              cityName ?? ""
                            }, ${countryName ?? ""}`}</Text>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p className="text-[#666666] text-sm flex items-center gap-2">
                  <CircleSlash width={15} height={15} />
                  No organizer found
                </p>
              )}
              {/* {eventCoOrganizerDetails.length > 0 ? (
                <div className="flex items-center gap-2 border-t-[1px] py-2">
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
              ) : (
                organizer && (
                  <p className="text-[#666666] text-sm flex items-center gap-2 border-t-[1px] py-2">
                    <Image src={Disable} alt="Disable" width={15} height={15} />
                    No Co-organizers found
                  </p>
                )
              )} */}
              {/* {eventCoOrganizerDetails.length > 0 &&
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
                ))} */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion
          type="single"
          className="bg-[#FAFAFA] dark:bg-transparent border border-[var(--neutral-light-color)] rounded-sm"
          collapsible
        >
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline p-2 font-normal text-sm">
              <p className="flex gap-3 items-center">
                Event POC
                {eventPOCDetails.length > 0 && (
                  <span className="text-[12px] bg-[var(--primary-color)] text-white dark:text-[#131313] py-[1px] px-2 rounded-full">
                    {eventPOCDetails.filter((poc) => poc !== null).length > 0 &&
                    eventPOCDetails.filter((poc) => poc !== null).length < 9
                      ? `0${
                          eventPOCDetails.filter((poc) => poc !== null).length
                        }`
                      : eventPOCDetails.filter((poc) => poc !== null).length}
                  </span>
                )}
              </p>
            </AccordionTrigger>
            <AccordionContent
              className={`${
                eventPOCDetails.length > 1 ? "h-36 overflow-y-auto" : "h-fit"
              } pb-1 overflow-x-hidden`}
            >
              {eventPOCDetails && eventPOCDetails.length > 0 ? (
                eventPOCDetails.map((poc: GTMEventPOCDetails | null) => {
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
                  } = poc;
                  return (
                    <div key={id} className="flex flex-row gap-3 p-2">
                      <img
                        src={
                          profilePicture
                            ? profilePicture
                            : `https://img.10times.com/userimages/${name
                                .charAt(0)
                                .toLowerCase()}.jpg`
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
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-[#666666] text-sm flex items-center gap-2 p-2">
                  <CircleSlash width={15} height={15} />
                  No POC found
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex gap-6 mt-4 justify-center">
          {/* <button className="border border-[#6750A4] rounded-md text-[#6750A4] flex  justify-center py-2 px-4 gap-2 items-center w-full">
            <Bookmark width={15} height={15} className="w-5 h-5" />
            Save this event
          </button> */}
          {/* <SaveThisEvent eventDetails={eventDetails} /> */}
          {/* <button className="bg-[#6750A4] rounded-md flex items-center justify-center py-2 px-4 text-white w-full cursor-not-allowed">
            Add this to tracker
          </button> */}
        </div>

        {/* <Button className="mt-4 w-full">Track this event</Button> */}
      </aside>
      <div className="ml-auto w-[70%] max-xl:w-[62%]">
        <ul className="flex flex-row gap-12 justify-between mb-4 z-10 bg-white dark:bg-[var(--heading-background-color)] shadow-md pt-3 items-end w-full">
          <div className="flex gap-12">
            {tabs
              .filter((tab) => !(tab.path === "insights" && !isValid))
              .map((tab) => (
                <div
                  key={tab.tabName}
                  onClick={() => {
                    handleScrollTo(tab.path);
                  }}
                  className={`relative font-semibold cursor-pointer pb-3 ${
                    activeTab === tab.path
                      ? "text-[var(--primary-color)] border-b-2 border-b-[var(--primary-color)]"
                      : "text-[var(--tertiary-text-color)]"
                  }`}
                >
                  {tab.tabName}
                  {/* {tab.tabName === "Insights" && (
                  <div className="absolute -top-1 -right-16 w-fit">
                    <span className="bg-[#FEECF2] py-2 px-3 rounded-full text-sm text-[#DF2670] relative ml-2">
                      NEW
                      <Image
                        className="absolute -right-[7px] -top-[7px]"
                        width={20}
                        height={20}
                        src={Star}
                        alt="Star"
                      />
                    </span>
                  </div>
                )} */}
                </div>
              ))}
          </div>
          {/* <div className="flex gap-4 pb-2 pr-2">
            <button className="bg-[#6750A4] rounded-md flex items-center gap-2 justify-center py-2 px-4 text-white w-fit cursor-not-allowed">
              <Image src={"/dollar.svg"} alt="Dollar" width={10} height={10} />
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
          <EventInfoAndMap
            eventDetails={eventDetails}
            scrollSection={tabs[0].path}
            setActiveTab={setActiveTab}
          />
          <hr className="h-[1px] border-t-1 bg-[#f2f2f2]" />
          <AdvancedDetails
            eventDetails={eventDetails}
            eventEditionData={eventEditionData}
            eventId={params.eventId}
          />
          <InsightsAndScores
            eventDetails={eventDetails}
            scrollSection={tabs[1].path}
            setActiveTab={setActiveTab}
          />
          <AudienceIntel
            eventDetails={eventDetails}
            eventExhibitorData={eventExhibitorData}
            eventSpeakerData={eventSpeakerData}
            scrollSection={tabs[2].path}
            setActiveTab={setActiveTab}
          />
        </section>
        {/* <section className="flex flex-col flex-1 h-full right-0  overflow-y-hidden"></section> */}
      </div>
      {/* <div className="flex flex-row h-screen gap-10 relative"></div> */}
    </div>
  );
};

export default EventDetail;
