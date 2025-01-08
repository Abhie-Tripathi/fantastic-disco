"use client";
import React, { useRef, useState } from "react";
import {
  ArrowLeft,
  Buildings,
  Globe,
  Linkedin,
  Location,
  LogoTwitterX,
  StarFill,
} from "geist-icons";
// import { Phone } from "geist-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Heading from "@/components/new-ui/Heading";
// import { Heading as SectionHeading } from "@/components/eventDetail/heading";
import Text from "@/components/new-ui/Text";
import "react-circular-progressbar/dist/styles.css";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
// import Disable from "/public/disable.svg";
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
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { useEventsService } from "@/services/eventsService";
import { GTMEventPOCDetails, EventDate } from "@/types/events";
import { Button } from "@/components/ui/button";
import { AdvancedDetails } from "@/app/components/prospectDetail/advancedDetails";
import { SectionHeading } from "@/app/components/prospectDetail/prospectHeading";
import { CompanyClients } from "@/app/components/prospectDetail/CompanyClients";
import { EventCalendar } from "@/app/components/prospectDetail/EventCalendar";

export interface RankingDetail {
  above5CountryEvent: countryRank[] | [];
  below5CountryEvent: countryRank[] | [];
  above5CategoryEvent: categoryRank[] | [];
  below5CategoryEvent: categoryRank[] | [];
  above5CountryCategoryRankEvent: countryCategoryRank[] | [];
  below5CountryCategoryEvent: countryCategoryRank[] | [];
}
const CompanyDetail = ({ params }: { params: { companyId: string } }) => {

  const [activeTab, setActiveTab] = useState<TTabs>("overview");
  const tabs = [
    { tabName: "Overview", path: "overview" },
    { tabName: "Events", path: "insights" },
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
        getEventDetailById(params.companyId),
        getEventPOCDetails(params.companyId),
        getEventEditionDetails(params.companyId, 10, 0),
        getEventExhibitorDetails(params.companyId, 3, 0),
        getEventSpeakerDetails(params.companyId, 3, 0),
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
  } = event;
  const eventDetails: GTMEventDetail = eventData.event || {};
  const eventPOCDetails: GTMEventPOCDetails[] = eventPOCData.eventPoc || [];

  if (!eventDetails) return null;
  const {
    id,
    name,
    bannerUrl,
    format: typeOfEvent,
    repeatSentiment: trustScore,
  } = eventDetails;

  const handleScrollTo = (section: string) => {
    const element = document.querySelector(`.${section}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="p-6 pt-0">
      <aside className="fixed h-screen w-[24%] pb-24 bg-[var(--primary-foreground)] pt-6 pr-6 overflow-y-auto shadow-[3px_0px_5px_-5px] dark:border-r-2 dark:border-r-[var(--border-color)] max-xl:w-[30%]">
        <button className="flex items-center gap-2 pb-4 text-[#666666] text-sm">
          <ArrowLeft width="14px" height="14px" color="#6750A4" />
          <Link
            className="text-[var(--primary-color)] font-medium"
            href={"/internal/search/events"}
          >
            Back to Search
          </Link>
        </button>

        {bannerUrl && (
          <Image
            src={bannerUrl ?? "/eventDetailFallback.png"}
            alt="eventDetails"
            width={420}
            height={280}
            className="max-h-[300px] w-fill rounded-lg"
          />
        )}

        <div className="flex bg-[#F8F8FA] dark:bg-[var(--heading-background-color)] rounded-md px-6 py-4">
          <Image
            src="https://c1.10times.com/event/df3476a1316b6ad5c70b170b4d4a174/1519356663271/5061.jpg"
            alt="eventLogo"
            className="flex h-20 w-20 rounded-xl shadow-lg"
            width={200}
            height={200}
          />
        </div>

        {name && (
          <Heading as="h6" variant="titleNoMargin" className="my-4">
            Pharmaflair
          </Heading>
        )}

        <div className="flex gap-2 items-center w-fit my-4">
          <Location color="#666666" width="14px" height="14px" />
          <span className="text-[#6E6F89] text-sm">New Delhi, India</span>
        </div>

        <div className="flex gap-2 items-center w-fit my-4">
          <Buildings color="#666666" width="14px" height="14px" />
          <span className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit">
            Pharma
          </span>

          <span className="text-[var(--info-text-color)] dark:border-[#0D3868] bg-[var(--info-background-color)] h-fit font-semibold text-xs py-1 px-4 border-[#CCE6FF] border rounded-md w-fit">
            Hospitals
          </span>

          <span className="text-[var(--info-text-color)] text-xs font-medium">
            +2 more
          </span>
        </div>

        <div className="text-[#707287] text-sm line-clamp-4 my-4">
          Platform that connects verified pharmacy and healthcare manufacturers
          with distributors, sellers, and retailers, to sell business franchises
          and take manufacturing orders. Nutrition products, derma, and
          cosmetic, ayurvedic, common disease medicines, medical equipment,
          pharmacy franchise, animal healthcare medicines, homeopathic, etc.
        </div>

        <div className="flex gap-4 my-6">
          <Linkedin color="#666666" className="cursor-pointer" />
          <LogoTwitterX color="#666666" className="cursor-pointer" />
          <Globe color="#666666" className="cursor-pointer" />
        </div>

        <Accordion
          type="single"
          className="bg-[#FAFAFA] dark:bg-transparent border border-[var(--neutral-light-color)] rounded-sm my-4"
          collapsible
        >
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline p-2 font-normal text-sm">
              <p className="flex gap-3 items-center">
                Company POC
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
          <Button variant="outline" className="p-5 w-1/2 border-[var(--primary-color)] text-[var(--primary-color)]">
            <Bookmark
              width={15}
              height={15}
              className={`w-5 h-5 fill-transparent`}
            />
            Bookmark</Button>
          <Button className="p-5 w-1/2">Connect</Button>
        </div>
      </aside>
      <div className="ml-auto w-[70%] max-xl:w-[62%]">
        <ul className="flex flex-row gap-12 justify-between mb-4 z-10 bg-white dark:bg-[var(--heading-background-color)] shadow-md pt-3 items-end w-full">
          <div className="flex gap-12">
            {tabs
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
                </div>
              ))}
          </div>
        </ul>

        <section className="flex flex-col gap-6 pb-6 h-[calc(100vh-180px)] mt-5 w-full pr-4 overflow-y-auto scroll-smooth">
          <SectionHeading
            heading="Company Details"
            scrollSection={tabs[0].path}
            setActiveTab={setActiveTab}
          />
          <AdvancedDetails
            eventDetails={eventDetails}
            eventEditionData={eventEditionData}
            eventId={params.companyId}
          />

          <SectionHeading heading="Clients" />

          <CompanyClients />

          <SectionHeading
            heading="Events"
            scrollSection={tabs[1].path}
            setActiveTab={setActiveTab}
          />

          <EventCalendar />
        </section>
      </div>
    </div>
  );
};

export default CompanyDetail;
